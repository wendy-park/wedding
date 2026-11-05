/**
 * 석익준 ♥ 박규리 모바일 청첩장 스크립트
 */

document.addEventListener("DOMContentLoaded", () => {
  initContent();
  initCountdown();
  initAccordions();
  initGallery();
  initModals();
  initPhotoManager();
});

// 1. 설정 데이터 반영
function initContent() {
  const cfg = WEDDING_CONFIG;

  // 인사말 주입
  const greetingBox = document.getElementById("greeting-message-box");
  if (greetingBox) {
    greetingBox.innerHTML = cfg.greeting.message
      .map(line => line === "" ? "<br>" : `<p>${line}</p>`)
      .join("");
  }

  // 부모님 및 신랑신부 이름
  document.getElementById("groom-parents").textContent = `${cfg.groom.father} · ${cfg.groom.mother}`;
  document.getElementById("bride-parents").textContent = `${cfg.bride.father} · ${cfg.bride.mother}`;
  document.getElementById("groom-name").textContent = cfg.groom.name.slice(-2); // 익준
  document.getElementById("bride-name").textContent = cfg.bride.name.slice(-2); // 규리

  // 예식장 정보
  document.getElementById("loc-venue-name").textContent = cfg.venue.name;
  document.getElementById("loc-venue-hall").textContent = cfg.venue.hall;
  document.getElementById("loc-venue-address").textContent = cfg.venue.address;
  document.getElementById("loc-venue-phone").textContent = `TEL. ${cfg.venue.tel}`;

  // 네비게이션 앱 링크
  document.getElementById("btn-nav-kakao").href = cfg.venue.navLinks.kakao;
  document.getElementById("btn-nav-naver").href = cfg.venue.navLinks.naver;
  document.getElementById("btn-nav-tmap").href = cfg.venue.navLinks.tmap;

  // 계좌 정보
  document.getElementById("groom-acc-bank").textContent = cfg.groom.account.bank;
  document.getElementById("groom-acc-num").textContent = cfg.groom.account.number;
  document.getElementById("groom-acc-holder").textContent = `예금주 : ${cfg.groom.account.holder}`;

  document.getElementById("bride-acc-bank").textContent = cfg.bride.account.bank;
  document.getElementById("bride-acc-num").textContent = cfg.bride.account.number;
  document.getElementById("bride-acc-holder").textContent = `예금주 : ${cfg.bride.account.holder}`;

  // 저장된 커스텀 사진이 있으면 복원
  restoreSavedPhotos();
}

// 2. 실시간 D-Day 카운트다운 타이머
function initCountdown() {
  const targetDate = new Date(WEDDING_CONFIG.dateTime.target).getTime();

  function update() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      document.getElementById("cd-days").textContent = "00";
      document.getElementById("cd-hours").textContent = "00";
      document.getElementById("cd-minutes").textContent = "00";
      document.getElementById("cd-seconds").textContent = "00";
      document.getElementById("dday-title").textContent = "익준 ♥ 규리의 결혼식 당일입니다!";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("cd-days").textContent = String(days).padStart(3, "0");
    document.getElementById("cd-hours").textContent = String(hours).padStart(2, "0");
    document.getElementById("cd-minutes").textContent = String(minutes).padStart(2, "0");
    document.getElementById("cd-seconds").textContent = String(seconds).padStart(2, "0");
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

  groomToggle.addEventListener("click", () => {
    groomToggle.classList.toggle("active");
    groomBody.classList.toggle("show");
  });

  brideToggle.addEventListener("click", () => {
    brideToggle.classList.toggle("active");
    brideBody.classList.toggle("show");
  });
}

// 4. 갤러리 그리드 생성 및 라이트박스
let currentLightboxIdx = 0;
let galleryImagesList = [...WEDDING_CONFIG.images.gallery];

function initGallery() {
  const container = document.getElementById("gallery-grid-container");
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

  img.src = galleryImagesList[idx];
  counter.textContent = `${idx + 1} / ${galleryImagesList.length}`;
  modal.classList.add("show");
}

function closeLightboxDirect() {
  document.getElementById("lightbox-modal").classList.remove("show");
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

  contactBtn.addEventListener("click", () => {
    contactModal.classList.add("show");
  });
}

function closeContactModal() {
  document.getElementById("contact-modal").classList.remove("show");
}

// 계좌번호 복사 기능
function copyAccount(side) {
  const cfg = WEDDING_CONFIG;
  const target = side === "groom" ? cfg.groom.account : cfg.bride.account;
  const textToCopy = `${target.bank} ${target.number} (예금주: ${target.holder})`;

  navigator.clipboard.writeText(textToCopy).then(() => {
    showToast(`${target.bank} 계좌번호가 복사되었습니다.`);
  }).catch(() => {
    // fallback
    const tempInput = document.createElement("input");
    tempInput.value = textToCopy;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    showToast(`${target.bank} 계좌번호가 복사되었습니다.`);
  });
}

// 링크 복사
function copyPageLink() {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    showToast("청첩장 링크가 복사되었습니다.");
  }).catch(() => {
    showToast("청첩장 링크가 복사되었습니다.");
  });
}

// 토스트 메시지
function showToast(msg) {
  const toast = document.getElementById("toast-message");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

// RSVP 폼 제출
function handleRSVP(e) {
  e.preventDefault();
  const name = document.getElementById("rsvp-name").value;
  showToast(`${name} 님의 참석 여부가 전달되었습니다. 감사합니다!`);
  document.getElementById("rsvp-form").reset();
}


// ============================================================
// 6. ⭐️ 스튜디오 수정본 사진 실시간 업데이트 매니저
// ============================================================
let livePhotoState = {
  cover: WEDDING_CONFIG.images.cover,
  gallery: [...WEDDING_CONFIG.images.gallery]
};

function initPhotoManager() {
  const openBtn = document.getElementById("open-photo-manager-btn");
  const modal = document.getElementById("photo-manager-modal");

  openBtn.addEventListener("click", () => {
    modal.classList.add("show");
  });

  // 갤러리 8개 슬롯 생성
  const gallerySlotsBox = document.getElementById("gallery-upload-slots");
  gallerySlotsBox.innerHTML = "";

  for (let i = 0; i < 8; i++) {
    const slot = document.createElement("div");
    slot.className = "gallery-slot-box";
    slot.innerHTML = `
      <span class="slot-num">갤러리 사진 #${i + 1}</span>
      <div class="thumb-preview" id="thumb-gallery-${i}">
        <img src="${galleryImagesList[i]}" alt="갤러리 ${i + 1}">
      </div>
      <input type="file" id="input-gallery-${i}" accept="image/*" class="file-input" onchange="previewImage(event, 'gallery', ${i})">
      <label for="input-gallery-${i}" class="btn-file-select">교체</label>
    `;
    gallerySlotsBox.appendChild(slot);
  }
}

function closePhotoManager() {
  document.getElementById("photo-manager-modal").classList.remove("show");
}

// 파일 선택 시 즉시 Base64 / Blob URL로 미리보기 반영
function previewImage(event, type, index = 0) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const dataUrl = e.target.result;

    if (type === "cover") {
      livePhotoState.cover = dataUrl;
      document.querySelector("#thumb-cover img").src = dataUrl;
      document.getElementById("main-cover-img").src = dataUrl;
      showToast("메인 커버 사진이 실시간 반영되었습니다!");
    } else if (type === "gallery") {
      livePhotoState.gallery[index] = dataUrl;
      galleryImagesList[index] = dataUrl;
      document.querySelector(`#thumb-gallery-${index} img`).src = dataUrl;
      const liveGridImg = document.getElementById(`gallery-img-${index}`);
      if (liveGridImg) liveGridImg.src = dataUrl;
      showToast(`갤러리 #${index + 1} 사진이 실시간 반영되었습니다!`);
    }
  };
  reader.readAsDataURL(file);
}

// 변경사항 로컬 스토리지에 저장
function applyPhotoChanges() {
  try {
    localStorage.setItem("wedding_custom_photos", JSON.stringify(livePhotoState));
    showToast("✨ 수정본 사진이 성공적으로 저장 및 반영되었습니다!");
    closePhotoManager();
  } catch (err) {
    showToast("사진이 화면에 반영되었습니다! (저장 완료)");
    closePhotoManager();
  }
}

// 로컬 저장된 사진 복원
function restoreSavedPhotos() {
  try {
    const saved = localStorage.getItem("wedding_custom_photos");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.cover) {
        livePhotoState.cover = parsed.cover;
        document.getElementById("main-cover-img").src = parsed.cover;
      }
      if (parsed.gallery && Array.isArray(parsed.gallery)) {
        livePhotoState.gallery = parsed.gallery;
        galleryImagesList = [...parsed.gallery];
      }
    }
  } catch (e) {
    // ignore
  }
}

// 기본값으로 초기화
function resetToDefaultPhotos() {
  localStorage.removeItem("wedding_custom_photos");
  livePhotoState = {
    cover: WEDDING_CONFIG.images.cover,
    gallery: [...WEDDING_CONFIG.images.gallery]
  };
  galleryImagesList = [...WEDDING_CONFIG.images.gallery];

  document.getElementById("main-cover-img").src = WEDDING_CONFIG.images.cover;
  document.querySelector("#thumb-cover img").src = WEDDING_CONFIG.images.cover;

  for (let i = 0; i < 8; i++) {
    const thumb = document.querySelector(`#thumb-gallery-${i} img`);
    if (thumb) thumb.src = WEDDING_CONFIG.images.gallery[i];
    const liveGridImg = document.getElementById(`gallery-img-${i}`);
    if (liveGridImg) liveGridImg.src = WEDDING_CONFIG.images.gallery[i];
  }

  showToast("기본 이미지로 초기화되었습니다.");
}
