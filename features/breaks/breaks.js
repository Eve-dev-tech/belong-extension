/* features/breaks/breaks.js — IIFE */
(function (g) {
  'use strict';

  var TYPES = [
    { id: 'water',   emoji: '💧', name: 'Water break',    desc: 'A reminder to hydrate — essential for focus.', color: '#4A7A9E', pale: '#E3EEF7' },
    { id: 'walk',    emoji: '🚶', name: 'Walking break',   desc: 'Stand up and take a short walk to reset.', color: '#4A9E7A', pale: '#E0F5EC' },
    { id: 'breathe', emoji: '🌿', name: 'Breathing break', desc: 'A prompt to do a quick breathing exercise.', color: '#6B9E78', pale: '#EDF5EF' }
  ];

  var INTERVALS = [
    { label: 'Every 30 min', m: 30 },
    { label: 'Every 45 min', m: 45 },
    { label: 'Every hour',   m: 60 },
    { label: 'Every 90 min', m: 90 },
    { label: 'Every 2 hrs',  m: 120 }
  ];

  function render(el, html) { el.innerHTML = html; }

  async function showConfig(el, goHome) {
    var cur = await BelongStorage.getBreakSettings();
    var selType = cur.type || 'water';
    var selIv   = cur.intervalMinutes || 60;
    var enabled = !!cur.enabled;

    function typeObj() { return TYPES.find(function (t) { return t.id === selType; }) || TYPES[0]; }

    render(el,
      '<button class="back-btn" id="br-back">← Back to home</button>' +
      '<div style="text-align:center;margin:20px 0 24px" class="fade-up">' +
        '<div style="font-family:\'DM Serif Display\',Georgia,serif;font-size:28px;color:var(--ink);margin-bottom:6px">Break Reminders</div>' +
        '<div style="color:var(--muted);font-size:15px">Gentle nudges to step away and recharge</div>' +
      '</div>' +

      /* toggle */
      '<div style="background:var(--card);border:1.5px solid var(--border);border-radius:var(--r-l);padding:16px 18px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between" class="fade-up d1">' +
        '<div><div style="font-size:15px;font-weight:600;color:var(--ink);margin-bottom:2px">Enable reminders</div>' +
          '<div style="font-size:13px;color:var(--muted)">Show browser notifications at set intervals</div></div>' +
        '<label style="position:relative;width:44px;height:24px;flex-shrink:0;cursor:pointer">' +
          '<input type="checkbox" id="br-toggle" style="opacity:0;width:0;height:0">' +
          '<div id="br-track" style="position:absolute;inset:0;border-radius:12px;background:#D4CCC0;transition:background 200ms"></div>' +
          '<div id="br-thumb" style="position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:white;box-shadow:0 1px 3px rgba(0,0,0,.18);transition:left 200ms"></div>' +
        '</label>' +
      '</div>' +

      /* type */
      '<div class="fade-up d2" style="margin-bottom:14px"><div class="label">Break type</div>' +
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px" id="br-types"></div>' +
        '<div id="br-type-desc" style="font-size:13px;color:var(--muted);margin-top:10px;padding:10px 14px;border-radius:var(--r-m);line-height:1.5"></div>' +
      '</div>' +

      /* interval */
      '<div class="fade-up d3" style="margin-bottom:22px"><div class="label">How often?</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:8px" id="br-ivs"></div>' +
      '</div>' +

      /* save */
      '<button class="btn btn-primary" id="br-save" style="width:100%" class="fade-up d4">Save reminder settings</button>' +
      '<div id="br-status" style="text-align:center;font-size:12px;color:var(--hint);margin-top:10px"></div>');

    document.getElementById('br-back').onclick = goHome;

    /* init toggle */
    var toggle = document.getElementById('br-toggle');
    toggle.checked = enabled;
    updateToggleUI(enabled);
    toggle.onchange = function () { enabled = toggle.checked; updateToggleUI(enabled); };

    function updateToggleUI(on) {
      document.getElementById('br-track').style.background = on ? 'var(--sage)' : '#D4CCC0';
      document.getElementById('br-thumb').style.left = on ? '23px' : '3px';
    }

    /* type buttons */
    var typeCont = document.getElementById('br-types');
    TYPES.forEach(function (t) {
      var d = document.createElement('div');
      d.id = 'br-t-' + t.id;
      d.style.cssText = 'padding:14px 8px;border-radius:var(--r-m);cursor:pointer;text-align:center;border:1.5px solid var(--border);background:var(--card);transition:all 160ms ease;';
      d.innerHTML = '<div style="font-size:24px;margin-bottom:5px">' + t.emoji + '</div><div style="font-size:12px;font-weight:600;color:var(--ink)">' + t.name.split(' ')[0] + '</div>';
      d.onclick = function () { selType = t.id; refreshTypes(); };
      typeCont.appendChild(d);
    });

    function refreshTypes() {
      TYPES.forEach(function (t) {
        var d = document.getElementById('br-t-' + t.id);
        var on = t.id === selType;
        d.style.borderColor = on ? t.color : 'var(--border)';
        d.style.background  = on ? t.pale  : 'var(--card)';
      });
      var to = typeObj();
      var desc = document.getElementById('br-type-desc');
      desc.textContent = to.desc;
      desc.style.background = to.pale;
    }
    refreshTypes();

    /* interval buttons */
    var ivCont = document.getElementById('br-ivs');
    INTERVALS.forEach(function (iv) {
      var d = document.createElement('div');
      d.id = 'br-iv-' + iv.m;
      d.style.cssText = 'padding:8px 16px;border-radius:var(--r-pill);cursor:pointer;font-size:14px;font-family:inherit;border:1.5px solid var(--border);background:var(--card);color:var(--muted);transition:all 160ms ease;';
      d.textContent = iv.label;
      d.onclick = function () { selIv = iv.m; refreshIvs(); };
      ivCont.appendChild(d);
    });

    function refreshIvs() {
      INTERVALS.forEach(function (iv) {
        var d = document.getElementById('br-iv-' + iv.m);
        var on = iv.m === selIv;
        d.style.borderColor = on ? 'var(--sage)' : 'var(--border)';
        d.style.background  = on ? 'var(--sage-pale)' : 'var(--card)';
        d.style.color       = on ? 'var(--sage-d)' : 'var(--muted)';
        d.style.fontWeight  = on ? '600' : '400';
      });
      var s = document.getElementById('br-status');
      if (s) s.textContent = enabled ? 'Next reminder in ~' + selIv + ' min' : 'Reminders are off';
    }
    refreshIvs();

    /* save */
    document.getElementById('br-save').onclick = async function () {
      var settings = { enabled: enabled, type: selType, intervalMinutes: selIv };
      await BelongStorage.setBreakSettings(settings);
      chrome.runtime.sendMessage({ type: 'UPDATE_BREAK', settings: settings });
      showSaved(el, goHome, settings);
    };
  }

  function showSaved(el, goHome, settings) {
    var t = TYPES.find(function (x) { return x.id === settings.type; }) || TYPES[0];
    var iv = INTERVALS.find(function (x) { return x.m === settings.intervalMinutes; });
    render(el,
      '<div class="congrats fade-up">' +
      '<div class="trophy">' + (settings.enabled ? '🔔' : '🔕') + '</div>' +
      '<h2>' + (settings.enabled ? 'Reminders set!' : 'Reminders off') + '</h2>' +
      '<p style="color:var(--muted);font-size:15px;line-height:1.7">' +
        (settings.enabled
          ? 'You\'ll get a <strong>' + t.name.toLowerCase() + '</strong> ' + (iv ? iv.label.toLowerCase() : '') + '.'
          : 'Break reminders are disabled. Turn them on any time.') +
      '</p>' +
      '<div class="action-row">' +
        '<button class="btn btn-secondary btn-sm" id="br-edit">Edit settings</button>' +
        '<button class="btn btn-primary" id="br-home">Back to home</button>' +
      '</div></div>');
    document.getElementById('br-edit').onclick = function () { showConfig(el, goHome); };
    document.getElementById('br-home').onclick = goHome;
  }

  g.BelongBreaks = { init: showConfig };
})(window);
