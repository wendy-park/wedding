/**
 * 익준 ♥ 규리 모바일 청첩장 설정 파일
 * 사진이 나오면 아래 이미지 경로를 수정하거나,
 * images/ 폴더의 파일(cover.jpg, gallery-1.jpg ~)을 직접 교체하시면 됩니다.
 */
const WEDDING_CONFIG = {
  // 신랑 & 신부 정보
  groom: {
    name: "석익준",
    relation: "장남",
    father: "석부모님",
    mother: "석어머님",
    phone: "010-0000-0000",
    account: {
      bank: "국민은행",
      number: "000-000-000000",
      holder: "석익준"
    }
  },
  bride: {
    name: "박규리",
    relation: "장녀",
    father: "박부모님",
    mother: "박어머님",
    phone: "010-8700-9597",
    account: {
      bank: "신한은행",
      number: "000-000-000000",
      holder: "박규리"
    }
  },

  // 예식 일시
  dateTime: {
    target: "2027-06-12T14:50:00+09:00",
    year: 2027,
    month: 6,
    day: 12,
    dayOfWeek: "토요일",
    timeStr: "오후 2시 50분",
    display: "2027. 06. 12 SAT PM 2:50"
  },

  // 예식 장소 (루이비스컨벤션 강서점 세인트그레이스홀)
  venue: {
    name: "루이비스컨벤션 강서점",
    hall: "8층 세인트그레이스홀 (단독홀)",
    address: "서울특별시 강서구 양천로 476, 금부빌딩 8F",
    tel: "02-2658-1002",
    subway: "지하철 9호선 가양역 10번 출구 (도보 2분, 약 110m)",
    bus: "가양역·마포고등학교 정류장 하차 (간선 652, 672, 지선 6627, 6632 등)",
    parking: "본관(금부빌딩) B2~B6 400대 주차 가능 (하객 2시간 무료) / 제2주차장(아벨테크노 지식산업센터) 3시간 무료 지원",
    navLinks: {
      kakao: "https://map.kakao.com/link/to/루이비스컨벤션강서점,37.561680,126.853128",
      naver: "https://map.naver.com/v5/search/%EB%A3%A8%EC%9D%B4%EB%B9%84%EC%8A%A4%EC%BB%A8%EB%B2%A4%EC%85%98%20%EA%B0%95%EC%84%9C%EC%A0%90",
      tmap: "https://surl.tmaps.co.kr/7b6f2f0a"
    }
  },

  // 모시는 글
  greeting: {
    subtitle: "INVITATION",
    title: "소중한 분들을 초대합니다",
    message: [
      "서로의 계절이 되어주기로 약속했습니다.",
      "오랜 시간 함께 걸어온 저희 두 사람이",
      "이제 평생을 약속하는 첫걸음을 떼려 합니다.",
      "",
      "곁에서 따뜻한 온기로 아껴주신 소중한 분들을 모시고",
      "축복 속에 새 출발을 시작하고자 합니다.",
      "귀한 걸음 하시어 저희의 앞날을 함께 빛내주시면",
      "더없는 기쁨으로 간직하겠습니다."
    ]
  },

  // 사진 경로 (스튜디오 수정본 나오면 교체)
  images: {
    cover: "images/cover.jpg",
    gallery: [
      "images/gallery-1.jpg",
      "images/gallery-2.jpg",
      "images/gallery-3.jpg",
      "images/gallery-4.jpg",
      "images/gallery-5.jpg",
      "images/gallery-6.jpg",
      "images/gallery-7.jpg",
      "images/gallery-8.jpg"
    ]
  }
};
