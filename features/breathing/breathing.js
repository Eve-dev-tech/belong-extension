/* features/breathing/breathing.js  — IIFE, no ES modules */
(function (g) {
  'use strict';

  var TECHNIQUES = [
    {
      id: 'box', name: 'Box Breathing', emoji: '🟦', tag: 'Deep relaxation',
      desc: 'Equal counts for inhale, hold, exhale, hold — creates deep calm and mental clarity.',
      color: '#6B9E78', pale: '#EDF5EF',
      phases: [{ label: 'Inhale', s: 4 }, { label: 'Hold', s: 4 }, { label: 'Exhale', s: 4 }, { label: 'Hold', s: 4 }]
    },
    {
      id: '478', name: '4-7-8 Breathing', emoji: '🌙', tag: 'Regulate & focus',
      desc: 'Inhale 4, hold 7, exhale 8. A natural sedative for the nervous system.',
      color: '#7A7EBF', pale: '#EEEEF9',
      phases: [{ label: 'Inhale', s: 4 }, { label: 'Hold', s: 7 }, { label: 'Exhale', s: 8 }]
    },
    {
      id: '711', name: '7-11 Breathing', emoji: '🌿', tag: 'Feel less anxious',
      desc: 'Longer exhale activates the parasympathetic system, quickly reducing anxiety.',
      color: '#9E8A4A', pale: '#F5F0E0',
      phases: [{ label: 'Inhale', s: 7 }, { label: 'Exhale', s: 11 }]
    }
  ];

  var DURATIONS = [
    { label: '2 min', s: 120 },
    { label: '3 min', s: 180 },
    { label: '5 min', s: 300 }
  ];

  var phaseHints = {
    'Inhale': 'Breathe in slowly through your nose',
    'Hold':   'Hold gently — stay relaxed',
    'Exhale': 'Release slowly through your mouth'
  };

  function fmt(secs) {
    return Math.floor(secs / 60) + ':' + String(secs % 60).padStart(2, '0');
  }

  function render(el, html) { el.innerHTML = html; }

  /* ── 1. Technique picker ──────────────────────────────── */
  function showPicker(el, goHome) {
    render(el, '<button class="back-btn" id="b-back">← Back to home</button>' +
      '<div style="text-align:center;margin:20px 0 28px"><div style="font-family:\'DM Serif Display\',Georgia,serif;font-size:28px;color:var(--ink);margin-bottom:6px;">Guided Breathing</div>' +
      '<div style="color:var(--muted);font-size:15px;">Choose a technique to begin</div></div>' +
      '<div id="tech-list" style="display:flex;flex-direction:column;gap:10px;"></div>');

    document.getElementById('b-back').onclick = goHome;

    var list = document.getElementById('tech-list');
    TECHNIQUES.forEach(function (t, i) {
      var d = document.createElement('div');
      d.className = 'fade-up d' + (i + 1);
      d.style.cssText = 'background:var(--card);border:1.5px solid var(--border);border-radius:var(--r-l);padding:18px 20px;cursor:pointer;display:flex;align-items:center;gap:16px;transition:all var(--t-mid) var(--ease);';
      d.innerHTML = '<div style="font-size:30px;flex-shrink:0">' + t.emoji + '</div>' +
        '<div style="flex:1"><div style="font-family:\'DM Serif Display\',Georgia,serif;font-size:17px;color:var(--ink);margin-bottom:2px">' + t.name + '</div>' +
        '<div style="font-size:12px;font-weight:600;color:' + t.color + ';margin-bottom:4px">' + t.tag + '</div>' +
        '<div style="font-size:13px;color:var(--muted);line-height:1.5">' + t.desc + '</div></div>' +
        '<div style="font-size:11px;font-weight:600;padding:4px 10px;background:' + t.pale + ';color:' + t.color + ';border-radius:var(--r-pill);flex-shrink:0">' +
        t.phases.map(function (p) { return p.s; }).join('-') + '</div>';
      d.onmouseenter = function () { d.style.borderColor = t.color; d.style.background = t.pale; d.style.transform = 'translateY(-2px)'; d.style.boxShadow = 'var(--shadow-m)'; };
      d.onmouseleave = function () { d.style.borderColor = 'var(--border)'; d.style.background = 'var(--card)'; d.style.transform = ''; d.style.boxShadow = ''; };
      d.onclick = function () { showDuration(el, goHome, t); };
      list.appendChild(d);
    });
  }

  /* ── 2. Duration picker ───────────────────────────────── */
  function showDuration(el, goHome, tech) {
    render(el, '<button class="back-btn" id="b-back2">← Back</button>' +
      '<div style="text-align:center;margin:20px 0 28px" class="fade-up">' +
      '<div style="font-size:40px;margin-bottom:8px">' + tech.emoji + '</div>' +
      '<div style="font-family:\'DM Serif Display\',Georgia,serif;font-size:26px;color:var(--ink);margin-bottom:4px">' + tech.name + '</div>' +
      '<div style="font-size:13px;color:' + tech.color + ';font-weight:600;margin-bottom:8px">' + tech.phases.map(function (p) { return p.label + ' ' + p.s + 's'; }).join(' · ') + '</div>' +
      '<div style="font-size:15px;color:var(--muted)">How long would you like to breathe?</div></div>' +
      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px" id="dur-grid"></div>');

    document.getElementById('b-back2').onclick = function () { showPicker(el, goHome); };

    var grid = document.getElementById('dur-grid');
    var cycleTotal = tech.phases.reduce(function (a, p) { return a + p.s; }, 0);
    DURATIONS.forEach(function (d, i) {
      var btn = document.createElement('div');
      btn.className = 'fade-up d' + (i + 1);
      btn.style.cssText = 'background:var(--card);border:1.5px solid var(--border);border-radius:var(--r-l);padding:24px 12px;cursor:pointer;text-align:center;transition:all var(--t-mid) var(--ease);';
      btn.innerHTML = '<div style="font-family:\'DM Serif Display\',Georgia,serif;font-size:26px;color:var(--ink);margin-bottom:4px">' + d.label + '</div>' +
        '<div style="font-size:12px;color:var(--muted)">~' + Math.round(d.s / cycleTotal) + ' cycles</div>';
      btn.onmouseenter = function () { btn.style.borderColor = tech.color; btn.style.background = tech.pale; btn.style.transform = 'translateY(-2px)'; };
      btn.onmouseleave = function () { btn.style.borderColor = 'var(--border)'; btn.style.background = 'var(--card)'; btn.style.transform = ''; };
      btn.onclick = function () { showSession(el, goHome, tech, d.s); };
      grid.appendChild(btn);
    });
  }

  /* ── 3. Animated breathing session ───────────────────── */
  function showSession(el, goHome, tech, totalSecs) {
    render(el,
      '<div style="text-align:center;max-width:360px;margin:0 auto" id="sess-wrap">' +
      '<div style="font-family:\'DM Serif Display\',Georgia,serif;font-size:18px;color:var(--ink);margin-bottom:2px">' + tech.name + '</div>' +
      '<div style="font-size:13px;color:var(--muted);margin-bottom:28px">Follow the circle</div>' +

      '<div style="position:relative;width:220px;height:220px;margin:0 auto 28px">' +
        '<svg width="220" height="220" style="position:absolute;inset:0;overflow:visible">' +
          '<circle cx="110" cy="110" r="96" fill="none" stroke="' + tech.color + '" stroke-width="3" opacity=".14"/>' +
          '<circle id="b-arc" cx="110" cy="110" r="96" fill="none" stroke="' + tech.color + '" stroke-width="4" ' +
            'stroke-dasharray="603" stroke-dashoffset="603" stroke-linecap="round" transform="rotate(-90 110 110)"/>' +
        '</svg>' +
        '<div id="b-circle" style="position:absolute;top:50%;left:50%;width:90px;height:90px;margin:-45px 0 0 -45px;' +
          'border-radius:50%;background:' + tech.color + ';opacity:.88;display:flex;align-items:center;justify-content:center;' +
          'transition:transform .15s linear,opacity .3s ease">' +
          '<div id="b-cnt" style="font-family:\'DM Serif Display\',Georgia,serif;font-size:28px;color:white"></div>' +
        '</div>' +
      '</div>' +

      '<div id="b-phase" style="font-family:\'DM Serif Display\',Georgia,serif;font-size:26px;color:var(--ink);min-height:38px;margin-bottom:6px"></div>' +
      '<div id="b-hint" style="font-size:14px;color:var(--muted);min-height:20px;margin-bottom:24px"></div>' +

      '<div style="font-size:13px;color:var(--muted);margin-bottom:20px">' +
        'Remaining: <strong id="b-remain" style="color:var(--ink)">' + fmt(totalSecs) + '</strong>' +
      '</div>' +

      '<button class="btn btn-secondary btn-sm" id="b-stop">End session</button>' +
      '</div>');

    document.getElementById('b-stop').onclick = function () { stopAnim(); showPicker(el, goHome); };

    var raf = null;
    var phaseIdx = 0, phaseEl = 0, sessEl = 0, lastTs = null;

    function scale(phase, prog) {
      if (phase.label === 'Inhale') return 1 + prog * 0.65;
      if (phase.label === 'Exhale') return 1.65 - prog * 0.65;
      return phaseIdx % 2 === 1 ? 1.65 : 1;
    }

    function tick(ts) {
      if (!lastTs) lastTs = ts;
      var dt = ts - lastTs; lastTs = ts;
      sessEl += dt; phaseEl += dt;

      var phase = tech.phases[phaseIdx];
      var phDur = phase.s * 1000;
      var prog = Math.min(phaseEl / phDur, 1);

      var circ = document.getElementById('b-circle');
      var arc  = document.getElementById('b-arc');
      var cnt  = document.getElementById('b-cnt');
      var pLbl = document.getElementById('b-phase');
      var hint = document.getElementById('b-hint');
      var rem  = document.getElementById('b-remain');

      if (!circ) return;

      var sc = scale(phase, prog);
      circ.style.transform = 'scale(' + sc + ')';
      circ.style.opacity   = String(0.7 + prog * 0.15);

      var secsInPhase = Math.ceil((phDur - phaseEl) / 1000);
      cnt.textContent  = secsInPhase > 0 ? secsInPhase : '';
      pLbl.textContent = phase.label;
      hint.textContent = phaseHints[phase.label] || '';

      arc.style.strokeDashoffset = String(603 * (1 - sessEl / (totalSecs * 1000)));

      var secsLeft = Math.max(0, Math.ceil((totalSecs * 1000 - sessEl) / 1000));
      rem.textContent = fmt(secsLeft);

      if (phaseEl >= phDur) { phaseEl = 0; phaseIdx = (phaseIdx + 1) % tech.phases.length; }
      if (sessEl >= totalSecs * 1000) { stopAnim(); showCongrats(el, goHome, tech, totalSecs); return; }

      raf = requestAnimationFrame(tick);
    }

    function stopAnim() { if (raf) { cancelAnimationFrame(raf); raf = null; } }
    raf = requestAnimationFrame(tick);
  }

  /* ── 4. Congratulations ──────────────────────────────── */
  function showCongrats(el, goHome, tech, dur) {
    chrome.runtime.sendMessage({ type: 'COMPLETE_SESSION', session: { type: 'breathing', subtype: tech.id, duration: dur } });

    render(el,
      '<div class="congrats fade-up">' +
      '<div class="trophy">✨</div>' +
      '<h2>Well done!</h2>' +
      '<p style="color:var(--muted);font-size:15px;line-height:1.7">You completed ' +
        (DURATIONS.find(function (d) { return d.s === dur; }) || { label: '' }).label + ' of ' + tech.name + '.<br>' +
        'Take a moment to notice how you feel.</p>' +
      '<div class="pts-pill">⭐ +5 points earned</div>' +
      '<div class="action-row">' +
        '<button class="btn btn-secondary btn-sm" id="c-again">Try another</button>' +
        '<button class="btn btn-primary" id="c-home">Back to home</button>' +
      '</div></div>');

    document.getElementById('c-again').onclick = function () { showPicker(el, goHome); };
    document.getElementById('c-home').onclick  = goHome;
  }

  /* ── public API ──────────────────────────────────────── */
  g.BelongBreathing = { init: showPicker };

})(window);
