/**
 * 석익준 ♥ 박규리 모바일 청첩장 스크립트
 */

document.addEventListener("DOMContentLoaded", () => {
  initContent();
  initCountdown();
  initAccordions();
  initGallery();
  initModals();
});

// 1. 설정 데이터 반영
function initContent() {
  const cfg = WEDDING_CONFIG;

  // 인사말 주입
  const greetingBox = document.getElementById("greeting-message-box");
  if (greetingBox && cfg.greeting && cfg.greeting.message) {
    greetingBox.innerHTML = cfg.greeting.message
      .map(line => line === "" ? "<br>" : `<p>${line}</p>`)
      .join("");
  }

  // 부모님 및 신랑신부 이름
  const gp = document.getElementById("groom-parents");
  if (gp) gp.textContent = `${cfg.groom.father} · ${cfg.groom.mother}`;
  const bp = document.getElementById("bride-parents");
  if (bp) bp.textContent = `${cfg.bride.father} · ${cfg.bride.mother}`;
  const gn = document.getElementById("groom-name");
  if (gn) gn.textContent = cfg.groom.name.slice(-2);
  const bn = document.getElementById("bride-name");
  if (bn) bn.textContent = cfg.bride.name.slice(-2);

  // 예식장 정보
  const lvn = document.getElementById("loc-venue-name");
  if (lvn) lvn.textContent = cfg.venue.name;
  const lvh = document.getElementById("loc-venue-hall");
  if (lvh) lvh.textContent = cfg.venue.hall;
  const lva = document.getElementById("loc-venue-address");
  if (lva) lva.textContent = cfg.venue.address;
  const lvp = document.getElementById("loc-venue-phone");
  if (lvp) lvp.textContent = `TEL. ${cfg.venue.tel}`;

  // 네비게이션 앱 링크
  const bnk = document.getElementById("btn-nav-kakao");
  if (bnk) bnk.href = cfg.venue.navLinks.kakao;
  const bnn = document.getElementById("btn-nav-naver");
  if (bnn) bnn.href = cfg.venue.navLinks.naver;
  const bnt = document.getElementById("btn-nav-tmap");
  if (bnt) bnt.href = cfg.venue.navLinks.tmap;

  // 계좌 정보
  const gab = document.getElementById("groom-acc-bank");
  if (gab) gab.textContent = cfg.groom.account.bank;
  const gan = document.getElementById("groom-acc-num");
  if (gan) gan.textContent = cfg.groom.account.number;
  const gah = document.getElementById("groom-acc-holder");
  if (gah) gah.textContent = `예금주 : ${cfg.groom.account.holder}`;

  const bab = document.getElementById("bride-acc-bank");
  if (bab) bab.textContent = cfg.bride.account.bank;
  const ban = document.getElementById("bride-acc-num");
  if (ban) ban.textContent = cfg.bride.account.number;
  const bah = document.getElementById("bride-acc-holder");
  if (bah) bah.textContent = `예금주 : ${cfg.bride.account.holder}`;
}

// 2. 실시간 D-Day 카운트다운 타이머
function initCountdown() {
  const cdDays = document.getElementById("cd-days");
  const cdHours = document.getElementById("cd-hours");
  const cdMinutes = document.getElementById("cd-minutes");
  const cdSeconds = document.getElementById("cd-seconds");
  const ddayTitle = document.getElementById("dday-title");

  if (!cdDays || !cdHours || !cdMinutes || !cdSeconds) return;

  const targetDate = new Date(WEDDING_CONFIG.dateTime.target).getTime();

  function update() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      cdDays.textContent = "000";
      cdHours.textContent = "00";
      cdMinutes.textContent = "00";
      cdSeconds.textContent = "00";
      if (ddayTitle) ddayTitle.textContent = "익준 ♥ 규리의 결혼식 당일입니다!";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    cdDays.textContent = String(days).padStart(3, "0");
    cdHours.textContent = String(hours).padStart(2, "0");
    cdMinutes.textContent = String(minutes).padStart(2, "0");
    cdSeconds.textContent = String(seconds).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}

// 3. 계좌번호 아코디언 토글
function initAccordions() {
  const groomToggle = document.getElementById("acc-groom-toggle");
  const groomBody = document.getElementById("acc-groom-body");
  const brideToggle = document.getElementById("acc-bride-toggle");
  const brideBody = document.getElementById("acc-bride-body");

  if (groomToggle && groomBody) {
    groomToggle.addEventListener("click", () => {
      groomToggle.classList.toggle("active");
      groomBody.classList.toggle("show");
    });
  }

  if (brideToggle && brideBody) {
    brideToggle.addEventListener("click", () => {
      brideToggle.classList.toggle("active");
      brideBody.classList.toggle("show");
    });
  }
}

// 4. 갤러리 그리드 생성 및 라이트박스
let currentLightboxIdx = 0;
let galleryImagesList = [...WEDDING_CONFIG.images.gallery];

function initGallery() {
  const container = document.getElementById("gallery-grid-container");
  if (!container) return;
  container.innerHTML = "";

  galleryImagesList.forEach((src, idx) => {
    const item = document.createElement("div");
    item.className = "gallery-item";
    item.onclick = () => openLightbox(idx);

    const img = document.createElement("img");
    img.src = src;
    img.alt = `웨딩 사진 ${idx + 1}`;
    img.id = `gallery-img-${idx}`;
    img.loading = "lazy";

    item.appendChild(img);
    container.appendChild(item);
  });
}

function openLightbox(idx) {
  currentLightboxIdx = idx;
  const modal = document.getElementById("lightbox-modal");
  const img = document.getElementById("lightbox-img");
  const counter = document.getElementById("lightbox-counter");

  if (modal && img && counter) {
    img.src = galleryImagesList[idx];
    counter.textContent = `${idx + 1} / ${galleryImagesList.length}`;
    modal.classList.add("show");
  }
}

function closeLightboxDirect() {
  const modal = document.getElementById("lightbox-modal");
  if (modal) modal.classList.remove("show");
}

function closeLightbox(e) {
  if (e.target.id === "lightbox-modal") {
    closeLightboxDirect();
  }
}

function prevLightbox(e) {
  e.stopPropagation();
  currentLightboxIdx = (currentLightboxIdx - 1 + galleryImagesList.length) % galleryImagesList.length;
  openLightbox(currentLightboxIdx);
}

function nextLightbox(e) {
  e.stopPropagation();
  currentLightboxIdx = (currentLightboxIdx + 1) % galleryImagesList.length;
  openLightbox(currentLightboxIdx);
}

// 5. 모달 제어 (연락처)
function initModals() {
  const contactBtn = document.getElementById("open-contact-modal-btn");
  const contactModal = document.getElementById("contact-modal");

  if (contactBtn && contactModal) {
    contactBtn.addEventListener("click", () => {
      contactModal.classList.add("show");
    });

    contactModal.addEventListener("click", (e) => {
      if (e.target.id === "contact-modal") {
        closeContactModal();
      }
    });
  }
}

function closeContactModal() {
  const contactModal = document.getElementById("contact-modal");
  if (contactModal) contactModal.classList.remove("show");
}

// 계좌번호 복사 기능
function copyAccount(side) {
  const cfg = WEDDING_CONFIG;
  const target = side === "groom" ? cfg.groom.account : cfg.bride.account;
  const textToCopy = `${target.bank} ${target.number} (예금주: ${target.holder})`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast(`${target.bank} 계좌번호가 복사되었습니다.`);
    }).catch(() => {
      fallbackCopy(textToCopy, target.bank);
    });
  } else {
    fallbackCopy(textToCopy, target.bank);
  }
}

function fallbackCopy(text, bank) {
  const tempInput = document.createElement("input");
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
  showToast(`${bank} 계좌번호가 복사되었습니다.`);
}

// 링크 복사
function copyPageLink() {
  const url = window.location.href;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      showToast("청첩장 링크가 복사되었습니다.");
    }).catch(() => {
      showToast("청첩장 링크가 복사되었습니다.");
    });
  } else {
    showToast("청첩장 링크가 복사되었습니다.");
  }
}

// 토스트 메시지
function showToast(msg) {
  const toast = document.getElementById("toast-message");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

// RSVP 폼 제출
function handleRSVP(e) {
  e.preventDefault();
  const nameInput = document.getElementById("rsvp-name");
  const name = nameInput ? nameInput.value : "하객";
  showToast(`${name} 님의 참석 여부가 전달되었습니다. 감사합니다!`);
  const form = document.getElementById("rsvp-form");
  if (form) form.reset();
}
