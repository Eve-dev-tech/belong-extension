/* shared/storage.js  — IIFE, no ES-module syntax, safe for importScripts() and <script src> */
(function (g) {
  'use strict';

  /* ---------- raw chrome.storage helpers ---------- */
  function storageGet(key) {
    return new Promise(function (res) {
      chrome.storage.local.get(key, function (r) { res(r[key] !== undefined ? r[key] : null); });
    });
  }
  function storageSet(key, val) {
    return new Promise(function (res) {
      chrome.storage.local.set({ [key]: val }, res);
    });
  }
  function storageSetAll(obj) {
    return new Promise(function (res) { chrome.storage.local.set(obj, res); });
  }

  /* ---------- user profile ---------- */
  async function getUserProfile() {
    return (await storageGet('user_profile')) || { name: '', onboarded: false };
  }
  async function setUserProfile(profile) {
    return storageSet('user_profile', profile);
  }

  /* ---------- points ---------- */
  async function getPoints() {
    return (await storageGet('points')) || 0;
  }
  async function addPoints(n) {
    var cur = await getPoints();
    var next = cur + (n || 5);
    await storageSet('points', next);
    return next;
  }

  /* ---------- session log ---------- */
  async function logSession(session) {
    var log = (await storageGet('session_log')) || [];
    log.push(Object.assign({}, session, { completedAt: Date.now() }));
    if (log.length > 200) log.splice(0, log.length - 200);
    return storageSet('session_log', log);
  }
  async function getSessionLog() {
    return (await storageGet('session_log')) || [];
  }

  /* ---------- time data ---------- */
  async function recordDomainTime(domain, seconds) {
    var data = (await storageGet('time_data')) || {};
    data[domain] = (data[domain] || 0) + seconds;
    return storageSet('time_data', data);
  }
  async function getTimeData() {
    return (await storageGet('time_data')) || {};
  }

  /* ---------- break settings ---------- */
  async function getBreakSettings() {
    return (await storageGet('break_settings')) || { enabled: false, type: 'water', intervalMinutes: 60 };
  }
  async function setBreakSettings(s) {
    return storageSet('break_settings', s);
  }

  /* ---------- expose ---------- */
  g.BelongStorage = {
    storageGet, storageSet, storageSetAll,
    getUserProfile, setUserProfile,
    getPoints, addPoints,
    logSession, getSessionLog,
    recordDomainTime, getTimeData,
    getBreakSettings, setBreakSettings
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
