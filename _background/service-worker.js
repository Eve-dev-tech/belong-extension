/* _background/service-worker.js */
importScripts('../shared/storage.js');

var S = BelongStorage;
var activeTabId = null, activeStart = null, activeDomain = null;
var ALARM = 'belong_break';

function domain(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch (_) { return null; }
}

async function flush() {
  if (activeDomain && activeStart) {
    var secs = Math.round((Date.now() - activeStart) / 1000);
    if (secs > 2) await S.recordDomainTime(activeDomain, secs);
  }
  activeStart = activeDomain = null;
}

chrome.tabs.onActivated.addListener(async function (info) {
  await flush();
  activeTabId = info.tabId;
  try {
    var tab = await chrome.tabs.get(info.tabId);
    if (tab.url && !tab.url.startsWith('chrome')) {
      activeDomain = domain(tab.url);
      activeStart = Date.now();
    }
  } catch (_) {}
});

chrome.tabs.onUpdated.addListener(async function (id, info, tab) {
  if (id !== activeTabId || info.status !== 'complete') return;
  await flush();
  if (tab.url && !tab.url.startsWith('chrome')) {
    activeDomain = domain(tab.url);
    activeStart = Date.now();
  }
});

if (chrome.runtime.onSuspend) chrome.runtime.onSuspend.addListener(flush);

/* ---- alarms ---- */
async function scheduleAlarm() {
  await chrome.alarms.clear(ALARM);
  var s = await S.getBreakSettings();
  if (s.enabled) {
    chrome.alarms.create(ALARM, { delayInMinutes: s.intervalMinutes, periodInMinutes: s.intervalMinutes });
  }
}

chrome.alarms.onAlarm.addListener(async function (alarm) {
  if (alarm.name !== ALARM) return;
  var s = await S.getBreakSettings();
  var msgs = {
    water:   { title: 'Hydration check 💧', message: 'Time for a quick water break!' },
    walk:    { title: 'Stand & move 🚶',    message: 'A short walk will reset your energy.' },
    breathe: { title: 'Breathe with Belong 🌿', message: 'A breathing session is ready for you.' }
  };
  var m = msgs[s.type] || msgs.water;
  chrome.notifications.create({ type: 'basic', iconUrl: '/assets/icons/icon48.png', title: m.title, message: m.message, priority: 1 });
});

chrome.storage.onChanged.addListener(function (changes) {
  if (changes.break_settings) scheduleAlarm();
});

/* ---- messages ---- */
chrome.runtime.onMessage.addListener(function (msg, _sender, respond) {
  if (msg.type === 'COMPLETE_SESSION') {
    S.addPoints(5).then(function (total) {
      S.logSession(msg.session).then(function () { respond({ ok: true, total: total }); });
    });
    return true;
  }
  if (msg.type === 'UPDATE_BREAK') {
    scheduleAlarm().then(function () { respond({ ok: true }); });
    return true;
  }
  if (msg.type === 'GET_POINTS') {
    S.getPoints().then(function (p) { respond({ points: p }); });
    return true;
  }
});

/* ---- install ---- */
chrome.runtime.onInstalled.addListener(async function (details) {
  if (details.reason === 'install') {
    await S.storageSetAll({
      points: 0, session_log: [], time_data: {},
      user_profile: { name: '', onboarded: false },
      break_settings: { enabled: false, type: 'water', intervalMinutes: 60 }
    });
    chrome.tabs.create({ url: chrome.runtime.getURL('onboarding/index.html') });
  }
});
