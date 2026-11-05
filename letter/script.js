/* ═══════════════════════════════════════════════
   석익준 ♥ 박규리 — letter/ 청첩장 스크립트
   (null-safe · 방어 코딩: 어떤 단계가 실패해도
    나머지 기능과 전체 스크립트는 계속 동작합니다)
   ═══════════════════════════════════════════════ */
(function () {
  'use strict';

  var TARGET = { y: 2027, m: 6, d: 12, h: 14, min: 50 };
  var TARGET_MS = new Date(TARGET.y + '-' + pad(TARGET.m) + '-' + pad(TARGET.d) + 'T' + pad(TARGET.h) + ':' + pad(TARGET.min) + ':00+09:00').getTime();

  var LS_GUEST = 'letter.guestbook.v1';
  var LS_RSVP = 'letter.rsvp.v1';

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function $(id) {
    try { return document.getElementById(id); } catch (e) { return null; }
  }

  function safe(name, fn) {
    try { fn(); } catch (e) {
      if (window.console && console.warn) console.warn('[letter] ' + name + ' 초기화 건너뜀:', e && e.message ? e.message : e);
    }
  }

  function readLS(key, fallback) {
    try {
      var raw = window.localStorage ? localStorage.getItem(key) : null;
      if (!raw) return fallback;
      var val = JSON.parse(raw);
      return val == null ? fallback : val;
    } catch (e) { return fallback; }
  }

  function writeLS(key, val) {
    try { if (window.localStorage) localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* 저장 실패 시에도 화면 동작은 유지 */ }
  }

  /* ────────── 토스트 ────────── */
  var toastEl = null, toastTimer = null;
  function showToast(msg) {
    toastEl = toastEl || $('toast');
    if (!toastEl || !toastEl.classList) return;
    toastEl.textContent = msg;
    toastEl.hidden = false;
    // 강제 리플로우 후 표시
    void toastEl.offsetWidth;
    toastEl.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('show');
      setTimeout(function () { try { toastEl.hidden = true; } catch (e) {} }, 300);
    }, 2100);
  }

  /* ────────── 클립보드 복사 (보안 컨텍스트 fallback 포함) ────────── */
  function copyText(text) {
    return new Promise(function (resolve) {
      if (!text) { resolve(false); return; }
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () { resolve(true); }, function () { resolve(legacyCopy(text)); });
          return;
        }
      } catch (e) { /* 아래 fallback으로 진행 */ }
      resolve(legacyCopy(text));
    });
  }
  function legacyCopy(text) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '-1000px';
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return !!ok;
    } catch (e) { return false; }
  }

  /* ────────── 스크랩북 폴라로이드 갤러리 ────────── */
  var GALLERY = [
    { src: '../images/gallery-1.jpg', cap: 'our first chapter 🌷' },
    { src: '../images/gallery-2.jpg', cap: '웃음이 가득하던 날 ☕' },
    { src: '../images/gallery-3.jpg', cap: 'golden hour, golden us 🌇' },
    { src: '../images/gallery-4.jpg', cap: '너와 나의 산책 🍂' },
    { src: '../images/gallery-5.jpg', cap: 'little moments 🧸' },
    { src: '../images/gallery-6.jpg', cap: '봄날의 데이트 🌸' },
    { src: '../images/gallery-7.jpg', cap: 'always better together 💛' },
    { src: '../images/gallery-8.jpg', cap: 'and, forever 💌' }
  ];

  function initGallery() {
    var box = $('scrapbook');
    if (!box) return;
    box.innerHTML = '';
    GALLERY.forEach(function (item, i) {
      var card = document.createElement('button');
      card.type = 'button';
      card.className = 'polaroid-card';
      card.setAttribute('aria-label', (i + 1) + '번 사진 크게 보기');
      card.setAttribute('data-index', String(i));

      var wrap = document.createElement('div');
      wrap.className = 'polaroid-imgwrap';
      var img = document.createElement('img');
      img.src = item.src;
      img.alt = '스크랩북 사진 ' + (i + 1);
      img.loading = 'lazy';
      img.onerror = function () { card.style.display = 'none'; };
      wrap.appendChild(img);

      var cap = document.createElement('p');
      cap.className = 'polaroid-caption gaegu';
      cap.textContent = item.cap;

      var tape = document.createElement('span');
      tape.className = 'sticker-tape';
      tape.setAttribute('aria-hidden', 'true');

      var pin = document.createElement('span');
      pin.className = 'sticker-pin';
      pin.textContent = i % 2 === 0 ? '📌' : '🤍';
      pin.setAttribute('aria-hidden', 'true');

      card.appendChild(pin);
      card.appendChild(wrap);
      card.appendChild(cap);
      card.appendChild(tape);
      card.addEventListener('click', function () { openLightbox(i); });
      box.appendChild(card);
    });
  }

  /* ────────── 라이트박스 ────────── */
  function openLightbox(i) {
    var lb = $('lightbox'), img = $('lightbox-img'), cap = $('lightbox-caption');
    if (!lb || !img) return;
    var item = GALLERY[i];
    if (!item) return;
    img.src = item.src;
    img.alt = '확대된 사진: ' + item.cap;
    if (cap) cap.textContent = item.cap;
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    var lb = $('lightbox');
    if (!lb) return;
    lb.hidden = true;
    document.body.style.overflow = '';
    var img = $('lightbox-img');
    if (img) img.src = '';
  }
  function initLightbox() {
    var lb = $('lightbox'), closeBtn = $('lightbox-close');
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (lb) lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && lb && !lb.hidden) closeLightbox(); });
  }

  /* ────────── 하트 달력 (2027년 6월) ────────── */
  function initCalendar() {
    var table = $('cal-table');
    if (!table) return;
    table.innerHTML = '';
    // 2027-06-12는 토요일 → 6월 1일은 화요일 (일요일 시작 달력)
    var firstDow = new Date(2027, 5, 1).getDay();
    var daysInMonth = new Date(2027, 6, 0).getDate();

    var headRow = document.createElement('tr');
    ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].forEach(function (d) {
      var th = document.createElement('th');
      th.scope = 'col';
      th.textContent = d;
      headRow.appendChild(th);
    });
    table.appendChild(headRow);

    var row = document.createElement('tr');
    var cell;
    for (var b = 0; b < firstDow; b++) { row.appendChild(document.createElement('td')); }
    for (var d = 1; d <= daysInMonth; d++) {
      var dow = (firstDow + d - 1) % 7;
      cell = document.createElement('td');
      cell.textContent = String(d);
      if (dow === 0) cell.className = 'sun';
      if (d === TARGET.d) {
        cell.className = 'today-heart';
        cell.setAttribute('aria-label', '결혼식 날짜 6월 12일');
      }
      row.appendChild(cell);
      if (dow === 6 || d === daysInMonth) { table.appendChild(row); row = document.createElement('tr'); }
    }
    var rest = firstDow + daysInMonth;
    if (rest % 7 !== 0) {
      for (var t = rest % 7; t < 7; t++) { row.appendChild(document.createElement('td')); }
      table.appendChild(row);
    }
  }

  /* ────────── D-day 실시간 카운트다운 ────────── */
  function initCountdown() {
    var elD = $('dd-d'), elH = $('dd-h'), elM = $('dd-m'), elS = $('dd-s');
    if (!elD || !elH || !elM || !elS) return;
    function tick() {
      try {
        var diff = TARGET_MS - Date.now();
        if (diff <= 0) {
          elD.textContent = '0'; elH.textContent = '00'; elM.textContent = '00'; elS.textContent = '00';
          var label = $('dday-label');
          if (label) label.textContent = '오늘, 저희의 가장 행복한 날입니다 💍';
          return;
        }
        var s = Math.floor(diff / 1000);
        elD.textContent = String(Math.floor(s / 86400));
        elH.textContent = pad(Math.floor((s % 86400) / 3600));
        elM.textContent = pad(Math.floor((s % 3600) / 60));
        elS.textContent = pad(s % 60);
      } catch (e) { /* 카운트다운 오류는 무시하고 다음 틱 대기 */ }
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ────────── 축하 방명록 ────────── */
  function initGuestbook() {
    var form = $('guest-form');
    var list = $('guest-list');
    var emptyEl = $('guest-empty');
    if (!form || !list) return;

    function render() {
      var items = readLS(LS_GUEST, []);
      if (!Array.isArray(items)) items = [];
      list.innerHTML = '';
      if (emptyEl) emptyEl.hidden = items.length > 0;
      items.forEach(function (item) {
        if (!item || typeof item !== 'object') return;
        var card = document.createElement('div');
        card.className = 'guest-card';

        var head = document.createElement('div');
        head.className = 'guest-card-head';
        var name = document.createElement('p');
        name.className = 'guest-card-name';
        name.textContent = '💌 ' + (item.name || '익명의 하객');
        var date = document.createElement('span');
        date.className = 'guest-card-date';
        date.textContent = item.date || '';
        head.appendChild(name);
        head.appendChild(date);

        var msg = document.createElement('p');
        msg.className = 'guest-card-msg';
        msg.textContent = item.message || '';

        var del = document.createElement('button');
        del.type = 'button';
        del.className = 'guest-card-del';
        del.textContent = '✕';
        del.setAttribute('aria-label', '메시지 삭제');
        del.addEventListener('click', function () {
          var pw = window.prompt('삭제하려면 작성 시의 비밀번호를 입력하세요.');
          if (pw === null) return;
          var cur = readLS(LS_GUEST, []);
          var target = null;
          for (var i = 0; i < cur.length; i++) { if (cur[i] && cur[i].id === item.id) target = cur[i]; }
          if (!target) { showToast('이미 삭제된 메시지예요.'); return; }
          if (String(target.password) !== String(pw)) { showToast('비밀번호가 일치하지 않아요 🥲'); return; }
          writeLS(LS_GUEST, cur.filter(function (x) { return x && x.id !== item.id; }));
          render();
          showToast('메시지를 삭제했어요.');
        });

        card.appendChild(del);
        card.appendChild(head);
        card.appendChild(msg);
        list.appendChild(card);
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nameEl = $('guest-name'), pwEl = $('guest-pw'), msgEl = $('guest-msg');
      if (!nameEl || !msgEl) return;
      var name = (nameEl.value || '').trim();
      var message = (msgEl.value || '').trim();
      var password = pwEl ? (pwEl.value || '').trim() : '';
      if (!name) { showToast('성함을 입력해 주세요 🙏'); if (nameEl.focus) nameEl.focus(); return; }
      if (!message) { showToast('축하 메시지를 입력해 주세요 💌'); if (msgEl.focus) msgEl.focus(); return; }
      if (password.length < 4) { showToast('비밀번호는 4자리 이상으로 입력해 주세요'); if (pwEl && pwEl.focus) pwEl.focus(); return; }
      var items = readLS(LS_GUEST, []);
      if (!Array.isArray(items)) items = [];
      items.unshift({
        id: Date.now() + '-' + Math.floor(Math.random() * 100000),
        name: name, message: message, password: password,
        date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
      });
      writeLS(LS_GUEST, items);
      form.reset();
      render();
      showToast('소중한 축하가 등록되었어요 🎉');
    });

    render();
  }

  /* ────────── RSVP ────────── */
  function initRsvp() {
    var openBtn = $('rsvp-open');
    var panel = $('rsvp-panel');
    var form = $('rsvp-form');
    if (openBtn && panel) {
      openBtn.addEventListener('click', function () {
        panel.hidden = !panel.hidden;
        openBtn.textContent = panel.hidden ? '참석 여부 전달하기 💐' : '접어두기 🙌';
        if (!panel.hidden && panel.scrollIntoView) panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nameEl = $('rsvp-name'), countEl = $('rsvp-count'), phoneEl = $('rsvp-phone');
      if (!nameEl) return;
      var name = (nameEl.value || '').trim();
      if (!name) { showToast('성함을 입력해 주세요 🙏'); if (nameEl.focus) nameEl.focus(); return; }
      var val = function (nm) {
        var el = form.querySelector('input[name="' + nm + '"]:checked');
        return el ? el.value : '';
      };
      var entry = {
        id: Date.now(),
        name: name,
        attend: val('attend') || '참석',
        side: val('side') || '신랑측',
        meal: val('meal') || '식사 예정',
        count: countEl && countEl.value ? String(parseInt(countEl.value, 10) || 0) : '0',
        phone: phoneEl && phoneEl.value ? phoneEl.value.trim() : '',
        date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
      };
      var items = readLS(LS_RSVP, []);
      if (!Array.isArray(items)) items = [];
      items.push(entry);
      writeLS(LS_RSVP, items);
      form.reset();
      showToast(entry.name + '님, 전송 완료되었어요! 감사합니다 💕');
    });
  }

  /* ────────── 오시는 길 & 계좌 복사 ────────── */
  function initLocation() {
    var links = {
      'nav-kakao': 'https://map.kakao.com/link/to/루이비스컨벤션강서점,37.561680,126.853128',
      'nav-naver': 'https://map.naver.com/v5/search/%EB%A3%A8%EC%9D%B4%EB%B9%84%EC%8A%A4%EC%BB%A8%EB%B2%A4%EC%85%98%20%EA%B0%95%EC%84%9C%EC%A0%90',
      'nav-tmap': 'https://surl.tmaps.co.kr/7b6f2f0a'
    };
    Object.keys(links).forEach(function (id) {
      var el = $(id);
      if (el) el.href = links[id];
    });

    var copyBtns = document.querySelectorAll('.btn-copy');
    Array.prototype.forEach.call(copyBtns, function (btn) {
      btn.addEventListener('click', function () {
        var num = btn.getAttribute('data-copy');
        copyText(num).then(function (ok) {
          showToast(ok ? '계좌번호가 복사되었어요 💛' : '복사에 실패했어요. 직접 번호를 눌러 복사해 주세요.');
        });
      });
    });
  }

  /* ────────── 공유하기 ────────── */
  function initShare() {
    var pageUrl = 'https://wendy-park.github.io/wedding/letter/';
    try { if (window.location && window.location.href && window.location.href.indexOf('http') === 0) pageUrl = window.location.href.split('#')[0]; } catch (e) {}
    var copyLink = $('btn-copy-link');
    if (copyLink) {
      copyLink.addEventListener('click', function () {
        copyText(pageUrl).then(function (ok) {
          showToast(ok ? '청첩장 링크가 복사되었어요 💌' : '복사에 실패했어요. 주소창의 링크를 사용해 주세요.');
        });
      });
    }
    var kakao = $('btn-kakao');
    if (kakao) {
      var url = 'https://story.kakao.com/intent/share?url=' + encodeURIComponent(pageUrl);
      kakao.href = url;
    }
  }

  /* ────────── 편지 봉투 오픈 애니메이션 ────────── */
  function initEnvelope() {
    var scene = $('envelope-scene');
    if (!scene) return;
    var opened = false;
    function open() {
      if (opened) return;
      opened = true;
      scene.classList.add('opened');
    }
    // 첫 화면 진입 시 자연스럽게 열림
    setTimeout(open, 700);
    document.addEventListener('click', open, { once: true });
  }

  /* ────────── BGM (Web Audio 감성 로맨틱 루프) ──────────
     - 브라우저토플레이 정책 준수: 반드시 사용자 터치/클릭 이후에 시작
     - 파일 없이 Web Audio로 잔잔한 피아노 아르페지오 + 패드 생성 */
  function initBgm() {
    var toggle = $('bgm-toggle');
    var muteBtn = $('bgm-mute');
    var icon = $('bgm-icon');
    var muteIcon = $('bgm-mute-icon');
    if (!toggle) return;

    var ctx = null, master = null, muted = false, playing = false, timer = null, step = 0;

    // 잔잔한 진행: C - G/B - Am - F (C Major, 느린 아르페지오)
    var CHORDS = [
      [261.63, 329.63, 392.00, 523.25],   // C
      [246.94, 293.66, 392.00, 493.88],   // G/B
      [220.00, 261.63, 329.63, 440.00],   // Am
      [174.61, 261.63, 349.23, 523.25]    // F
    ];
    var NOTE_LEN = 1.05;   // 한 음 길이(초)
    var STEP_LEN = 0.62;   // 아르페지오 스텝(초)

    function ensureCtx() {
      if (ctx) return true;
      try {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return false;
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = 0.5;
        master.connect(ctx.destination);
        return true;
      } catch (e) { ctx = null; return false; }
    }

    function note(freq, when, len, gainVal, type) {
      try {
        var osc = ctx.createOscillator();
        var g = ctx.createGain();
        osc.type = type || 'sine';
        osc.frequency.value = freq;
        g.gain.setValueAtTime(0.0001, when);
        g.gain.exponentialRampToValueAtTime(gainVal, when + 0.04);
        g.gain.exponentialRampToValueAtTime(0.0001, when + len);
        osc.connect(g);
        g.connect(master);
        osc.start(when);
        osc.stop(when + len + 0.05);
      } catch (e) { /* 개별 음 실패는 무시 */ }
    }

    function scheduleStep() {
      try {
        if (!ctx) return;
        var chord = CHORDS[Math.floor(step / 8) % CHORDS.length];
        var idx = step % 8;
        var pattern = [0, 1, 2, 3, 2, 1, 2, 3];
        var t = ctx.currentTime + 0.05;
        note(chord[pattern[idx]], t, NOTE_LEN, 0.16, 'sine');
        if (idx === 0) { // 마디마다 부드러운 베이스 패드
          note(chord[0] / 2, t, STEP_LEN * 8, 0.10, 'triangle');
        }
        step++;
      } catch (e) { /* 무시 */ }
    }

    function start() {
      if (!ensureCtx()) { showToast('이 브라우저에서는 배경음악을 지원하지 않아요 🥲'); return; }
      if (ctx.state === 'suspended' && ctx.resume) { ctx.resume().catch(function () {}); }
      playing = true;
      step = 0;
      scheduleStep();
      timer = setInterval(scheduleStep, STEP_LEN * 1000);
      toggle.classList.add('playing');
      toggle.setAttribute('aria-pressed', 'true');
      if (icon) icon.textContent = '🎧';
      showToast('BGM을 재생할게요 ♬');
    }

    function stop() {
      playing = false;
      if (timer) { clearInterval(timer); timer = null; }
      try { if (ctx && ctx.suspend) ctx.suspend().catch(function () {}); } catch (e) {}
      toggle.classList.remove('playing');
      toggle.setAttribute('aria-pressed', 'false');
      if (icon) icon.textContent = '🎧';
    }

    toggle.addEventListener('click', function () {
      if (!ensureCtx()) return;
      if (ctx.state === 'suspended' && ctx.resume) { ctx.resume().catch(function () {}); }
      if (playing) { stop(); } else { start(); }
    });

    if (muteBtn) {
      muteBtn.addEventListener('click', function () {
        if (!ensureCtx()) return;
        muted = !muted;
        try { master.gain.value = muted ? 0 : 0.5; } catch (e) {}
        if (muteIcon) muteIcon.textContent = muted ? '🔇' : '🔈';
        muteBtn.setAttribute('aria-label', muted ? '음소거 해제' : '음소거');
      });
    }
  }

  /* ────────── 실행 ────────── */
  function boot() {
    safe('toast', function () { toastEl = $('toast'); });
    safe('envelope', initEnvelope);
    safe('bgm', initBgm);
    safe('gallery', initGallery);
    safe('lightbox', initLightbox);
    safe('calendar', initCalendar);
    safe('countdown', initCountdown);
    safe('guestbook', initGuestbook);
    safe('rsvp', initRsvp);
    safe('location', initLocation);
    safe('share', initShare);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
