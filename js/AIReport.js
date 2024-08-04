// 쿠키에서 값을 가져오는 함수
function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// 쿠키에 값을 설정하는 함수
function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + d.toUTCString();
  document.cookie = name + "=" + (value || "") + ";" + expires + ";path=/";
  console.log(`쿠키 설정: ${name}=${value}; ${expires}`);
}

// 사용자 정보를 가져오는 함수
function fetchUserInfo() {
  const apiUrl = "http://3.37.23.33:8080/api/v1/user";
  const accesstoken = getCookie("accessToken");
  console.log("accessToken:", accesstoken); // 토큰 확인

  fetch(apiUrl, {
    method: "GET",
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ${accesstoken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.isSuccess) {
        // 사용자 닉네임을 HTML 요소에 업데이트
        document.getElementById("nickname").innerText =
          data.result.nickname + "님의";
        console.log("사용자 정보:", data.result);
      } else {
        console.error("사용자 정보 요청 실패:", data.message);
      }
    })
    .catch((error) => {
      console.error("Fetch 에러:", error);
    });
}

// GPT 분석 리포트를 가져오는 함수
function fetchGptReport() {
  const apiUrl = "http://3.37.23.33:8080/api/v1/gpt/";
  const accessToken = getCookie("accessToken");
  console.log("accessToken:", accessToken); // 토큰 확인

  fetch(apiUrl, {
    method: "POST",
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.isSuccess) {
        // 응답 결과를 HTML 요소에 업데이트
        document.getElementById("reportContent").innerText = data.result;
        document.querySelector(".button-frame").classList.add("hidden"); // 버튼 숨기기
        document.querySelector(".button-frame").classList.add("active");

        // 구매 이력을 쿠키에 저장
        setCookie("hasPurchased", "true", 7); // 쿠키에 'hasPurchased' 값을 'true'로 설정
        console.log("AI 분석 리포트:", data.result);
      } else {
        console.error("AI 분석 리포트 요청 실패:", data.message);
      }
    })
    .catch((error) => {
      console.error("Fetch 에러:", error);
    });
}

// 버튼 클릭 시 호출되는 함수
function btnClick() {
  fetchGptReport();
}

// 페이지 로드 후 사용자 정보 가져오기 및 구매 이력 확인
document.addEventListener("DOMContentLoaded", function () {
  fetchUserInfo(); // 사용자 정보 가져오기

  // 쿠키에서 구매 이력 확인
  const hasPurchased = getCookie("hasPurchased");
  console.log("hasPurchased 쿠키:", hasPurchased); // 쿠키 값 확인
  if (hasPurchased === "true") {
    console.log("구매 이력이 있습니다.");
    document.querySelector(".button-frame").classList.add("hidden");
    fetchGptReport(); // 구매 이력이 있으면 리포트 불러오기
  } else {
    console.log("구매 이력이 없습니다.");
    document.querySelector(".button-frame").classList.remove("hidden");
  }

  // 버튼 클릭 이벤트 설정
  document.getElementById("purchaseBtn").addEventListener("click", btnClick);
});
