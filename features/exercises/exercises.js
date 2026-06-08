/* features/exercises/exercises.js — IIFE */
(function (g) {
  'use strict';

  var EXERCISES = [
    {
      id: 'chest', name: 'Chest Opener', emoji: '🫶', color: '#C97070', pale: '#FAEAEA',
      target: 'Chest & upper back',
      desc: 'Counteract hunched posture by opening your chest and strengthening your upper body.',
      region: 'chest',
      steps: ['Clasp hands behind your back', 'Straighten arms, squeeze shoulder blades', 'Lift chest gently and hold', 'Release and repeat'],
      animKey: 'chest'
    },
    {
      id: 'arms', name: 'Arm Circles', emoji: '🔄', color: '#7A7EBF', pale: '#EEEEF9',
      target: 'Shoulders & arms',
      desc: 'Loosen shoulders and improve blood flow with gentle circular movements.',
      region: 'shoulder',
      steps: ['Extend both arms out to your sides', 'Make small circles forward × 10', 'Reverse direction × 10', 'Gradually widen the circles'],
      animKey: 'arms'
    },
    {
      id: 'hamstring', name: 'Hamstring Stretch', emoji: '🦵', color: '#9E8A4A', pale: '#F5F0E0',
      target: 'Hamstrings & lower back',
      desc: 'Release tight tension from prolonged sitting with this static stretch.',
      region: 'legs',
      steps: ['Sit at the edge of your chair', 'Extend one leg straight out', 'Lean gently forward from the hip', 'Hold 20–30 s, switch sides'],
      animKey: 'hamstring'
    },
    {
      id: 'squat', name: 'Chair Squats', emoji: '🪑', color: '#4A9E7A', pale: '#E0F5EC',
      target: 'Legs & glutes',
      desc: 'Improve lower-body mobility and stimulate blood flow.',
      region: 'lower',
      steps: ['Stand in front of your chair', 'Lower slowly to almost-sitting', 'Pause just above the seat', 'Rise and repeat 8–12 times'],
      animKey: 'squat'
    },
    {
      id: 'neck', name: 'Neck Stretch', emoji: '🦒', color: '#9E4A7A', pale: '#F5E0EE',
      target: 'Neck & upper traps',
      desc: 'Release neck tension and stiffness caused by screen time.',
      region: 'neck',
      steps: ['Sit tall, relax your shoulders', 'Tilt head slowly to the right', 'Hold 20 seconds, feel the stretch', 'Return to centre, repeat left'],
      animKey: 'neck'
    },
    {
      id: 'twist', name: 'Seated Spinal Twist', emoji: '🌀', color: '#4A7A9E', pale: '#E3EEF7',
      target: 'Spine & core',
      desc: 'Decompress the spine and relieve tension built up from sitting.',
      region: 'spine',
      steps: ['Sit tall, feet flat on the floor', 'Place right hand on left knee', 'Twist gently left, look over shoulder', 'Hold 20 s, repeat other side'],
      animKey: 'twist'
    }
  ];

  var DURATIONS = [
    { label: '2 min', s: 120 },
    { label: '3 min', s: 180 },
    { label: '5 min', s: 300 }
  ];

  /* ── body-map mini SVG ── */
  function bodyMap(ex) {
    var rc = { chest:'#D9CFC2', shoulder:'#D9CFC2', neck:'#D9CFC2', legs:'#D9CFC2', lower:'#D9CFC2', spine:'#D9CFC2' };
    var hl = ex.color;
    function fill(region) { return ex.region === region ? 'fill="' + hl + '" opacity="0.85"' : 'fill="#D9CFC2"'; }
    return '<svg width="72" height="220" viewBox="0 0 72 220" style="flex-shrink:0">' +
      '<circle cx="36" cy="22" r="16" fill="#D9CFC2" stroke="#B4A898" stroke-width="1.2"/>' +
      '<rect x="30" y="37" width="12" height="12" rx="4" ' + (ex.region==='neck'?'fill="'+hl+'" opacity=".85"':'fill="#D9CFC2"') + '/>' +
      '<rect x="18" y="48" width="36" height="52" rx="7" ' + ((['chest','spine'].includes(ex.region))?'fill="'+hl+'" opacity=".75"':'fill="#D9CFC2"') + '/>' +
      '<rect x="4"  y="50" width="13" height="40" rx="6" ' + (ex.region==='shoulder'?'fill="'+hl+'" opacity=".85"':'fill="#D9CFC2"') + ' transform="rotate(8 10 50)"/>' +
      '<rect x="55" y="50" width="13" height="40" rx="6" ' + (ex.region==='shoulder'?'fill="'+hl+'" opacity=".85"':'fill="#D9CFC2"') + ' transform="rotate(-8 62 50)"/>' +
      '<rect x="18" y="96" width="36" height="22" rx="6" ' + ((['lower','legs'].includes(ex.region))?'fill="'+hl+'" opacity=".75"':'fill="#D9CFC2"') + '/>' +
      '<rect x="20" y="114" width="13" height="60" rx="6" ' + ((['legs','lower'].includes(ex.region))?'fill="'+hl+'" opacity=".65"':'fill="#D9CFC2"') + '/>' +
      '<rect x="39" y="114" width="13" height="60" rx="6" ' + ((['legs','lower'].includes(ex.region))?'fill="'+hl+'" opacity=".65"':'fill="#D9CFC2"') + '/>' +
      '<ellipse cx="26" cy="177" rx="9" ry="5" fill="#D9CFC2"/>' +
      '<ellipse cx="46" cy="177" rx="9" ry="5" fill="#D9CFC2"/>' +
      '<text x="36" y="200" text-anchor="middle" font-size="9" fill="' + ex.color + '" font-weight="600" font-family="DM Sans,sans-serif">' + ex.target + '</text>' +
    '</svg>';
  }

  /* ── animated exercise SVG figures ── */
  var ANIMS = {
    chest: '<style>@keyframes chestA{0%,100%{transform:rotate(0)}50%{transform:rotate(30deg)}} .cl{transform-origin:18px 62px;animation:chestA 2.8s ease-in-out infinite}.cr{transform-origin:90px 62px;animation:chestA 2.8s ease-in-out infinite reverse}</style>',
    arms:  '<style>@keyframes armSpin{to{transform:rotate(360deg)}} .cl{transform-origin:18px 60px;animation:armSpin 2.2s linear infinite}.cr{transform-origin:90px 60px;animation:armSpin 2.2s linear infinite reverse}</style>',
    hamstring:'<style>@keyframes legEx{0%,100%{transform:rotate(0)}50%{transform:rotate(-30deg)}} .ll{transform-origin:28px 118px;animation:legEx 3s ease-in-out infinite}</style>',
    squat: '<style>@keyframes sqA{0%,100%{transform:translateY(0)}50%{transform:translateY(20px)}} .sq{animation:sqA 2.4s ease-in-out infinite}</style>',
    neck:  '<style>@keyframes nkA{0%,100%{transform:rotate(0)}50%{transform:rotate(20deg)}} .hd{transform-origin:54px 26px;animation:nkA 3s ease-in-out infinite}</style>',
    twist: '<style>@keyframes twA{0%,100%{transform:rotate(0)}50%{transform:rotate(24deg)}} .up{transform-origin:54px 76px;animation:twA 3s ease-in-out infinite}</style>'
  };

  function animFigure(ex) {
    var c = ex.color;
    var bases = {
      chest:
        ANIMS.chest +
        '<circle cx="54" cy="24" r="16" fill="#D9CFC2" stroke="#B4A898" stroke-width="1.2"/>' +
        '<rect x="36" y="38" width="36" height="52" rx="7" fill="' + c + '" opacity=".75"/>' +
        '<rect class="cl" x="4" y="44" width="13" height="44" rx="6" fill="#D9CFC2"/>' +
        '<rect class="cr" x="91" y="44" width="13" height="44" rx="6" fill="#D9CFC2"/>' +
        '<rect x="36" y="86" width="36" height="22" rx="6" fill="#D9CFC2"/>' +
        '<rect x="38" y="104" width="13" height="58" rx="6" fill="#D9CFC2"/>' +
        '<rect x="57" y="104" width="13" height="58" rx="6" fill="#D9CFC2"/>',
      arms:
        ANIMS.arms +
        '<circle cx="54" cy="24" r="16" fill="#D9CFC2" stroke="#B4A898" stroke-width="1.2"/>' +
        '<rect x="36" y="38" width="36" height="52" rx="7" fill="#D9CFC2"/>' +
        '<rect class="cl" x="4" y="44" width="13" height="44" rx="6" fill="' + c + '" opacity=".85"/>' +
        '<rect class="cr" x="91" y="44" width="13" height="44" rx="6" fill="' + c + '" opacity=".85"/>' +
        '<rect x="36" y="86" width="36" height="22" rx="6" fill="#D9CFC2"/>' +
        '<rect x="38" y="104" width="13" height="58" rx="6" fill="#D9CFC2"/>' +
        '<rect x="57" y="104" width="13" height="58" rx="6" fill="#D9CFC2"/>',
      hamstring:
        ANIMS.hamstring +
        '<circle cx="54" cy="24" r="16" fill="#D9CFC2" stroke="#B4A898" stroke-width="1.2"/>' +
        '<rect x="36" y="38" width="36" height="52" rx="7" fill="#D9CFC2"/>' +
        '<rect x="10" y="44" width="13" height="40" rx="6" fill="#D9CFC2" transform="rotate(8 16 44)"/>' +
        '<rect x="85" y="44" width="13" height="40" rx="6" fill="#D9CFC2" transform="rotate(-8 91 44)"/>' +
        '<rect x="36" y="86" width="36" height="22" rx="6" fill="#D9CFC2"/>' +
        '<rect class="ll" x="38" y="104" width="13" height="58" rx="6" fill="' + c + '" opacity=".8"/>' +
        '<rect x="57" y="104" width="13" height="58" rx="6" fill="#D9CFC2"/>',
      squat:
        ANIMS.squat +
        '<g class="sq">' +
        '<circle cx="54" cy="24" r="16" fill="#D9CFC2" stroke="#B4A898" stroke-width="1.2"/>' +
        '<rect x="36" y="38" width="36" height="50" rx="7" fill="' + c + '" opacity=".75"/>' +
        '<rect x="10" y="44" width="13" height="38" rx="6" fill="#D9CFC2" transform="rotate(8 16 44)"/>' +
        '<rect x="85" y="44" width="13" height="38" rx="6" fill="#D9CFC2" transform="rotate(-8 91 44)"/>' +
        '<rect x="36" y="84" width="36" height="22" rx="6" fill="' + c + '" opacity=".5"/>' +
        '<rect x="34" y="102" width="13" height="55" rx="6" fill="' + c + '" opacity=".8" transform="rotate(14 40 102)"/>' +
        '<rect x="61" y="102" width="13" height="55" rx="6" fill="' + c + '" opacity=".8" transform="rotate(-14 67 102)"/>' +
        '</g>',
      neck:
        ANIMS.neck +
        '<g class="hd"><circle cx="54" cy="24" r="16" fill="#D9CFC2" stroke="' + c + '" stroke-width="2"/>' +
        '<rect x="49" y="39" width="10" height="10" rx="4" fill="' + c + '" opacity=".8"/></g>' +
        '<rect x="36" y="48" width="36" height="52" rx="7" fill="#D9CFC2"/>' +
        '<rect x="10" y="52" width="13" height="40" rx="6" fill="#D9CFC2" transform="rotate(8 16 52)"/>' +
        '<rect x="85" y="52" width="13" height="40" rx="6" fill="#D9CFC2" transform="rotate(-8 91 52)"/>' +
        '<rect x="36" y="96" width="36" height="22" rx="6" fill="#D9CFC2"/>' +
        '<rect x="38" y="114" width="13" height="58" rx="6" fill="#D9CFC2"/>' +
        '<rect x="57" y="114" width="13" height="58" rx="6" fill="#D9CFC2"/>',
      twist:
        ANIMS.twist +
        '<circle cx="54" cy="24" r="16" fill="#D9CFC2" stroke="#B4A898" stroke-width="1.2"/>' +
        '<g class="up">' +
        '<rect x="36" y="38" width="36" height="52" rx="7" fill="' + c + '" opacity=".75"/>' +
        '<rect x="6" y="44" width="13" height="42" rx="6" fill="#D9CFC2" transform="rotate(12 12 44)"/>' +
        '<rect x="89" y="44" width="13" height="42" rx="6" fill="#D9CFC2" transform="rotate(-12 95 44)"/>' +
        '</g>' +
        '<rect x="36" y="86" width="36" height="22" rx="6" fill="#D9CFC2"/>' +
        '<rect x="38" y="104" width="13" height="58" rx="6" fill="#D9CFC2"/>' +
        '<rect x="57" y="104" width="13" height="58" rx="6" fill="#D9CFC2"/>'
    };
    var body = bases[ex.animKey] || bases.chest;
    return '<svg width="108" height="190" viewBox="0 0 108 185">' + body +
      '<ellipse cx="44" cy="165" rx="9" ry="5" fill="#D9CFC2"/>' +
      '<ellipse cx="64" cy="165" rx="9" ry="5" fill="#D9CFC2"/></svg>';
  }

  function fmt(s) { return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
  function render(el, html) { el.innerHTML = html; }

  /* ── 1. Picker ────────────────────────────────────────── */
  function showPicker(el, goHome) {
    render(el, '<button class="back-btn" id="ex-back">← Back to home</button>' +
      '<div style="text-align:center;margin:20px 0 24px"><div style="font-family:\'DM Serif Display\',Georgia,serif;font-size:28px;color:var(--ink);margin-bottom:6px">Desk Exercises</div>' +
      '<div style="color:var(--muted);font-size:15px">Choose an exercise to begin</div></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px" id="ex-grid"></div>');

    document.getElementById('ex-back').onclick = goHome;

    var grid = document.getElementById('ex-grid');
    EXERCISES.forEach(function (ex, i) {
      var d = document.createElement('div');
      d.className = 'fade-up d' + ((i % 4) + 1);
      d.style.cssText = 'background:var(--card);border:1.5px solid var(--border);border-radius:var(--r-l);padding:14px;cursor:pointer;transition:all var(--t-mid) var(--ease);display:flex;gap:10px;align-items:flex-start;';
      d.innerHTML = bodyMap(ex) +
        '<div><div style="font-size:18px;margin-bottom:4px">' + ex.emoji + '</div>' +
        '<div style="font-family:\'DM Serif Display\',Georgia,serif;font-size:14px;color:var(--ink);margin-bottom:2px">' + ex.name + '</div>' +
        '<div style="font-size:11px;font-weight:600;color:' + ex.color + ';margin-bottom:4px">' + ex.target + '</div>' +
        '<div style="font-size:12px;color:var(--muted);line-height:1.4">' + ex.desc + '</div></div>';
      d.onmouseenter = function () { d.style.borderColor = ex.color; d.style.background = ex.pale; d.style.transform = 'translateY(-2px)'; d.style.boxShadow = 'var(--shadow-m)'; };
      d.onmouseleave = function () { d.style.borderColor = 'var(--border)'; d.style.background = 'var(--card)'; d.style.transform = ''; d.style.boxShadow = ''; };
      d.onclick = function () { showDuration(el, goHome, ex); };
      grid.appendChild(d);
    });
  }

  /* ── 2. Duration ──────────────────────────────────────── */
  function showDuration(el, goHome, ex) {
    render(el, '<button class="back-btn" id="ex-back2">← Back</button>' +
      '<div style="text-align:center;margin:20px 0 28px" class="fade-up">' +
      '<div style="font-size:40px;margin-bottom:8px">' + ex.emoji + '</div>' +
      '<div style="font-family:\'DM Serif Display\',Georgia,serif;font-size:24px;color:var(--ink);margin-bottom:4px">' + ex.name + '</div>' +
      '<div style="font-size:12px;font-weight:600;color:' + ex.color + ';margin-bottom:8px">' + ex.target + '</div>' +
      '<div style="font-size:15px;color:var(--muted)">How long would you like?</div></div>' +
      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px" id="dur-grid2"></div>');

    document.getElementById('ex-back2').onclick = function () { showPicker(el, goHome); };
    var grid = document.getElementById('dur-grid2');
    DURATIONS.forEach(function (d, i) {
      var btn = document.createElement('div');
      btn.className = 'fade-up d' + (i + 1);
      btn.style.cssText = 'background:var(--card);border:1.5px solid var(--border);border-radius:var(--r-l);padding:24px 12px;cursor:pointer;text-align:center;transition:all var(--t-mid) var(--ease);';
      btn.innerHTML = '<div style="font-family:\'DM Serif Display\',Georgia,serif;font-size:26px;color:var(--ink)">' + d.label + '</div>';
      btn.onmouseenter = function () { btn.style.borderColor = ex.color; btn.style.background = ex.pale; btn.style.transform = 'translateY(-2px)'; };
      btn.onmouseleave = function () { btn.style.borderColor = 'var(--border)'; btn.style.background = 'var(--card)'; btn.style.transform = ''; };
      btn.onclick = function () { showCountdown(el, goHome, ex, d.s); };
      grid.appendChild(btn);
    });
  }

  /* ── 3. 5-second prepare countdown ───────────────────── */
  function showCountdown(el, goHome, ex, dur) {
    var n = 5;
    render(el,
      '<div style="text-align:center;max-width:340px;margin:0 auto" class="fade-up">' +
      '<div style="font-family:\'DM Serif Display\',Georgia,serif;font-size:18px;color:var(--ink);margin-bottom:6px">' + ex.name + '</div>' +
      '<div style="font-size:15px;color:var(--muted);margin-bottom:40px">Get ready to begin…</div>' +
      '<div id="big-n" style="font-family:\'DM Serif Display\',Georgia,serif;font-size:110px;color:' + ex.color + ';line-height:1;margin-bottom:36px">5</div>' +
      '<div style="font-size:14px;color:var(--muted)">Find a comfortable position</div></div>');

    var iv = setInterval(function () {
      n--;
      var el2 = document.getElementById('big-n');
      if (!el2) { clearInterval(iv); return; }
      if (n <= 0) { clearInterval(iv); showSession(el, goHome, ex, dur); return; }
      el2.textContent = String(n);
      el2.style.animation = 'none'; void el2.offsetHeight; el2.style.animation = 'fadeUp .25s var(--ease) both';
    }, 1000);
  }

  /* ── 4. Exercise session ──────────────────────────────── */
  function showSession(el, goHome, ex, totalSecs) {
    render(el,
      '<div style="max-width:460px;margin:0 auto" id="ex-sess">' +
      '<div style="text-align:center;margin-bottom:20px">' +
        '<div style="font-family:\'DM Serif Display\',Georgia,serif;font-size:20px;color:var(--ink);margin-bottom:2px">' + ex.emoji + ' ' + ex.name + '</div>' +
        '<div style="font-size:13px;font-weight:600;color:' + ex.color + '">' + ex.target + '</div>' +
      '</div>' +

      '<div style="display:flex;justify-content:center;margin-bottom:20px">' + animFigure(ex) + '</div>' +

      '<div style="background:var(--card);border:1px solid var(--border);border-radius:var(--r-l);padding:16px 18px;margin-bottom:16px">' +
        '<div class="label">Steps</div>' +
        ex.steps.map(function (s, i) {
          return '<div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:8px">' +
            '<div style="width:20px;height:20px;border-radius:50%;background:' + ex.pale + ';color:' + ex.color + ';font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px">' + (i + 1) + '</div>' +
            '<div style="font-size:14px;color:var(--ink);line-height:1.5">' + s + '</div></div>';
        }).join('') +
      '</div>' +

      '<div style="background:var(--border);border-radius:99px;height:5px;margin-bottom:8px;overflow:hidden">' +
        '<div id="ex-prog" style="height:100%;background:' + ex.color + ';border-radius:99px;width:0%;transition:width 1s linear"></div>' +
      '</div>' +
      '<div style="font-size:13px;color:var(--muted);text-align:center;margin-bottom:18px"><span id="ex-rem">' + fmt(totalSecs) + '</span> remaining</div>' +

      '<div style="display:flex;gap:10px;justify-content:center">' +
        '<button class="btn btn-secondary btn-sm" id="ex-pause">⏸ Pause</button>' +
        '<button class="btn btn-primary btn-sm" id="ex-done" style="background:' + ex.color + '">✓ Complete</button>' +
      '</div></div>');

    var elapsed = 0, paused = false;
    var iv = setInterval(function () {
      if (paused) return;
      elapsed++;
      var left = Math.max(0, totalSecs - elapsed);
      var prog = document.getElementById('ex-prog');
      var rem  = document.getElementById('ex-rem');
      if (prog) prog.style.width = ((elapsed / totalSecs) * 100) + '%';
      if (rem)  rem.textContent  = fmt(left);
      if (elapsed >= totalSecs) { clearInterval(iv); showCongrats(el, goHome, ex, totalSecs); }
    }, 1000);

    document.getElementById('ex-pause').onclick = function () {
      paused = !paused;
      this.textContent = paused ? '▶ Resume' : '⏸ Pause';
    };
    document.getElementById('ex-done').onclick = function () {
      clearInterval(iv); showCongrats(el, goHome, ex, totalSecs);
    };
  }

  /* ── 5. Congrats ─────────────────────────────────────── */
  function showCongrats(el, goHome, ex, dur) {
    chrome.runtime.sendMessage({ type: 'COMPLETE_SESSION', session: { type: 'exercise', subtype: ex.id, duration: dur } });
    render(el,
      '<div class="congrats fade-up">' +
      '<div class="trophy">🌟</div>' +
      '<h2>Great work!</h2>' +
      '<p style="color:var(--muted);font-size:15px;line-height:1.7">You completed the ' + ex.name + '.<br>Your body thanks you for the movement.</p>' +
      '<div class="pts-pill">⭐ +5 points earned</div>' +
      '<div class="action-row">' +
        '<button class="btn btn-secondary btn-sm" id="ex-again">Try another</button>' +
        '<button class="btn btn-primary" id="ex-home">Back to home</button>' +
      '</div></div>');
    document.getElementById('ex-again').onclick = function () { showPicker(el, goHome); };
    document.getElementById('ex-home').onclick  = goHome;
  }

  g.BelongExercises = { init: showPicker };
})(window);
