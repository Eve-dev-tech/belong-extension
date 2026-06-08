/* features/focus/focus.js — IIFE */
(function (g) {
  'use strict';

  var PRESETS = [
    { label: 'Classic Pomodoro', desc: '25 min focus · 5 min break',  work: 25, brk: 5  },
    { label: 'Deep work',        desc: '45 min focus · 10 min break', work: 45, brk: 10 },
    { label: 'Quick sprint',     desc: '15 min focus · 5 min break',  work: 15, brk: 5  }
  ];

  var CIRC = 2 * Math.PI * 88; // r=88

  function fmt(s) { return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); }
  function render(el, html) { el.innerHTML = html; }

  var workMins = 25, brkMins = 5, phase = 'work', elapsed = 0, paused = false, cycleCount = 0, iv = null;

  /* ── 1. Config ────────────────────────────────────────── */
  function showConfig(el, goHome) {
    render(el,
      '<button class="back-btn" id="fc-back">← Back to home</button>' +
      '<div style="text-align:center;margin:20px 0 24px" class="fade-up">' +
        '<div style="font-family:\'DM Serif Display\',Georgia,serif;font-size:28px;color:var(--ink);margin-bottom:6px">Focus Timer</div>' +
        '<div style="color:var(--muted);font-size:15px">Choose a session length to begin</div>' +
      '</div>' +

      '<div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px">' +
        PRESETS.map(function (p, i) {
          return '<div class="fade-up d' + (i + 1) + '" data-w="' + p.work + '" data-b="' + p.brk + '" style="background:var(--card);border:1.5px solid var(--border);border-radius:var(--r-l);padding:16px 20px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;transition:all var(--t-mid) var(--ease)" id="fc-p' + i + '">' +
            '<div><div style="font-family:\'DM Serif Display\',Georgia,serif;font-size:16px;color:var(--ink);margin-bottom:2px">' + p.label + '</div><div style="font-size:13px;color:var(--muted)">' + p.desc + '</div></div>' +
            '<div style="font-family:\'DM Serif Display\',Georgia,serif;font-size:26px;color:var(--blue)">' + p.work + 'm</div>' +
          '</div>';
        }).join('') +
      '</div>' +

      '<div class="fade-up d4" style="background:var(--card);border:1.5px solid var(--border);border-radius:var(--r-l);padding:16px 18px">' +
        '<div class="label">Custom duration</div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px">' +
          '<div><label style="font-size:12px;color:var(--muted);display:block;margin-bottom:6px">Focus (minutes)</label>' +
            '<input id="fc-work" type="number" min="5" max="120" value="25" style="width:100%;padding:10px 12px;border:1.5px solid var(--border-m);border-radius:var(--r-m);font-size:16px;color:var(--ink);font-family:inherit;outline:none"></div>' +
          '<div><label style="font-size:12px;color:var(--muted);display:block;margin-bottom:6px">Break (minutes)</label>' +
            '<input id="fc-brk"  type="number" min="1" max="30"  value="5"  style="width:100%;padding:10px 12px;border:1.5px solid var(--border-m);border-radius:var(--r-m);font-size:16px;color:var(--ink);font-family:inherit;outline:none"></div>' +
        '</div>' +
        '<button class="btn btn-primary" id="fc-custom" style="width:100%">Start custom session</button>' +
      '</div>');

    document.getElementById('fc-back').onclick = goHome;

    PRESETS.forEach(function (p, i) {
      var el2 = document.getElementById('fc-p' + i);
      el2.onmouseenter = function () { el2.style.borderColor = 'var(--blue)'; el2.style.background = 'var(--blue-pale)'; el2.style.transform = 'translateY(-2px)'; el2.style.boxShadow = 'var(--shadow-m)'; };
      el2.onmouseleave = function () { el2.style.borderColor = 'var(--border)'; el2.style.background = 'var(--card)'; el2.style.transform = ''; el2.style.boxShadow = ''; };
      el2.onclick = function () { workMins = p.work; brkMins = p.brk; startSession(el, goHome); };
    });

    document.getElementById('fc-custom').onclick = function () {
      workMins = parseInt(document.getElementById('fc-work').value) || 25;
      brkMins  = parseInt(document.getElementById('fc-brk').value)  || 5;
      startSession(el, goHome);
    };
  }

  /* ── 2. Start session ─────────────────────────────────── */
  function startSession(el, goHome) {
    phase = 'work'; elapsed = 0; paused = false;
    showTimer(el, goHome);
    runTimer(el, goHome);
  }

  /* ── 3. Timer UI ──────────────────────────────────────── */
  function showTimer(el, goHome) {
    var total = (phase === 'work' ? workMins : brkMins) * 60;
    var remaining = total - elapsed;
    var prog = elapsed / total;
    var offset = CIRC * (1 - prog);
    var col  = phase === 'work' ? '#4A7A9E' : '#6B9E78';
    var pale = phase === 'work' ? 'var(--blue-pale)' : 'var(--sage-pale)';

    render(el,
      '<div style="text-align:center;max-width:340px;margin:0 auto" id="fc-wrap">' +
        (cycleCount > 0 ? '<div style="font-size:13px;color:var(--muted);margin-bottom:6px">' + cycleCount + ' cycle' + (cycleCount > 1 ? 's' : '') + ' completed</div>' : '') +
        '<div style="font-size:16px;margin-bottom:4px">' + (phase === 'work' ? '🎯' : '☕') + '</div>' +
        '<div style="font-family:\'DM Serif Display\',Georgia,serif;font-size:16px;color:' + col + ';margin-bottom:24px">' + (phase === 'work' ? 'Focus time' : 'Break time') + '</div>' +

        '<div style="position:relative;width:210px;height:210px;margin:0 auto 28px">' +
          '<svg width="210" height="210" style="position:absolute;inset:0;overflow:visible">' +
            '<circle cx="105" cy="105" r="88" fill="none" stroke="' + col + '" stroke-width="5" opacity=".12"/>' +
            '<circle id="fc-arc" cx="105" cy="105" r="88" fill="none" stroke="' + col + '" stroke-width="6" ' +
              'stroke-dasharray="' + CIRC + '" stroke-dashoffset="' + offset + '" stroke-linecap="round" ' +
              'transform="rotate(-90 105 105)" style="transition:stroke-dashoffset 1s linear"/>' +
          '</svg>' +
          '<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">' +
            '<div id="fc-disp" style="font-family:\'DM Serif Display\',Georgia,serif;font-size:42px;color:var(--ink)">' + fmt(remaining) + '</div>' +
            '<div style="font-size:12px;color:var(--muted);margin-top:2px">' + (phase === 'work' ? workMins + 'm session' : brkMins + 'm break') + '</div>' +
          '</div>' +
        '</div>' +

        '<div style="display:flex;gap:10px;justify-content:center;margin-bottom:14px">' +
          '<button class="btn btn-secondary btn-sm" id="fc-pause">⏸ Pause</button>' +
          '<button class="btn btn-ghost btn-sm" id="fc-stop">Stop</button>' +
        '</div>' +
        '<div style="font-size:13px;color:var(--hint)">' + (phase === 'work' ? 'Stay focused. A break is on the way.' : 'Rest, stretch, or grab some water.') + '</div>' +
      '</div>');

    document.getElementById('fc-pause').onclick = function () {
      paused = !paused;
      this.textContent = paused ? '▶ Resume' : '⏸ Pause';
    };
    document.getElementById('fc-stop').onclick = function () {
      if (iv) clearInterval(iv);
      showConfig(el, goHome);
    };
  }

  /* ── 4. Timer logic ───────────────────────────────────── */
  function runTimer(el, goHome) {
    if (iv) clearInterval(iv);
    iv = setInterval(function () {
      if (paused) return;
      elapsed++;
      var total   = (phase === 'work' ? workMins : brkMins) * 60;
      var left    = Math.max(0, total - elapsed);
      var prog    = elapsed / total;
      var offset  = CIRC * (1 - prog);

      var arc  = document.getElementById('fc-arc');
      var disp = document.getElementById('fc-disp');
      if (!arc || !disp) { clearInterval(iv); return; }
      arc.style.strokeDashoffset = String(offset);
      disp.textContent = fmt(left);

      if (elapsed >= total) {
        clearInterval(iv);
        if (phase === 'work') { cycleCount++; showWorkDone(el, goHome); }
        else                  { showBreakDone(el, goHome); }
      }
    }, 1000);
  }

  /* ── 5. Work done ─────────────────────────────────────── */
  function showWorkDone(el, goHome) {
    chrome.runtime.sendMessage({ type: 'COMPLETE_SESSION', session: { type: 'focus', subtype: 'work', duration: workMins * 60 } });
    render(el,
      '<div class="congrats fade-up">' +
      '<div class="trophy">🎉</div>' +
      '<h2>Focus complete!</h2>' +
      '<p style="color:var(--muted);font-size:15px;line-height:1.7">You focused for ' + workMins + ' minutes.<br>Time for a ' + brkMins + '-minute break.</p>' +
      '<div class="pts-pill">⭐ +5 points earned</div>' +
      '<div style="font-size:14px;font-weight:600;color:var(--muted);margin-top:8px">How would you like to spend your break?</div>' +
      '<div style="display:flex;flex-direction:column;gap:8px;width:100%">' +
        '<button class="btn btn-secondary" id="fc-wb1">🫁 Breathing exercise</button>' +
        '<button class="btn btn-secondary" id="fc-wb2">🧘 Desk exercise</button>' +
        '<button class="btn btn-secondary" id="fc-wb3">⏱ Just run break timer (' + brkMins + ' min)</button>' +
      '</div>' +
      '<button class="btn btn-ghost" id="fc-wh">Back to home</button>' +
      '</div>');
    document.getElementById('fc-wb1').onclick = function () { if (window.BelongBreathing) { render(el, ''); BelongBreathing.init(el, function () { showConfig(el, goHome); }); } };
    document.getElementById('fc-wb2').onclick = function () { if (window.BelongExercises) { render(el, ''); BelongExercises.init(el, function () { showConfig(el, goHome); }); } };
    document.getElementById('fc-wb3').onclick = function () { phase = 'break'; elapsed = 0; showTimer(el, goHome); runTimer(el, goHome); };
    document.getElementById('fc-wh').onclick  = goHome;
  }

  /* ── 6. Break done ────────────────────────────────────── */
  function showBreakDone(el, goHome) {
    render(el,
      '<div class="congrats fade-up">' +
      '<div class="trophy">☀️</div>' +
      '<h2>Break\'s over!</h2>' +
      '<p style="color:var(--muted);font-size:15px;line-height:1.7">' + cycleCount + ' pomodoro cycle' + (cycleCount > 1 ? 's' : '') + ' completed.<br>Ready for another round?</p>' +
      '<div class="action-row">' +
        '<button class="btn btn-primary" id="fc-next">Start next session</button>' +
        '<button class="btn btn-secondary" id="fc-bh">Back to home</button>' +
      '</div></div>');
    document.getElementById('fc-next').onclick = function () { startSession(el, goHome); };
    document.getElementById('fc-bh').onclick   = goHome;
  }

  g.BelongFocus = { init: showConfig };
})(window);
