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
  const accessToken = getCookie("accessToken");
  console.log("accessToken:", accessToken); // 토큰 확인

  fetch(apiUrl, {
    method: "GET",
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ${accessToken}`,
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
        if (data.result.status === "previous") {
          console.log("이전 AI 분석 리포트:", data.result.report);
          document.getElementById("reportContent").innerText =
            data.result.report;
          document.getElementById("p").style.opacity = "1";
          document.getElementById("frame3").style.opacity = "1";
          document.getElementById("purchaseBtn").style.display = "none";
        } else if (data.result.status === "new") {
          setCookie("purchased", "true", 7);
          document.getElementById("purchaseBtn").style.display = "block"; // 버튼 표시
          console.log("새로운 AI 분석 리포트:", data.result.report);
          document.getElementById("reportContent").innerText =
            data.result.report;
          document.getElementById("p").style.opacity = "1";
          document.getElementById("frame3").style.opacity = "1";
        }
      } else {
        console.error("AI 분석 리포트 요청 실패:", data.message);
      }
    })
    .catch((error) => {
      console.error("Fetch 에러:", error);
    });
}

// 포인트를 가져오는 함수
function fetchPoints() {
  const month = new Date().getMonth() + 1; // 현재 월을 가져옴
  const apiUrl = `http://3.37.23.33:8080/api/v1/home?month=${month}`;
  const accessToken = getCookie("accessToken");
  console.log("accessToken:", accessToken); // 토큰 확인

  return fetch(apiUrl, {
    method: "GET",
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.isSuccess) {
        const points = data.result.info.point;
        console.log("현재 포인트:", points); // 현재 포인트를 콘솔에 출력
        return points;
      } else {
        console.error("포인트 정보 요청 실패:", data.message);
        return 0;
      }
    })
    .catch((error) => {
      console.error("Fetch 에러:", error);
      return 0;
    });
}

// 버튼 클릭 시 호출되는 함수
function btnClick() {
  fetchPoints().then((points) => {
    if (points >= 10) {
      fetchGptReport(); // 새로운 GPT 리포트를 생성 및 구매 버튼 숨기기
      alert("구매 완료되었습니다.");
    } else {
      console.log("포인트가 부족합니다. 현재 포인트:", points); // 포인트가 부족할 때 현재 포인트를 콘솔에 출력
      alert("포인트가 부족합니다. 구매할 수 없습니다.");
    }
  });
}

// 페이지 로드 후 사용자 정보 가져오기 및 리포트 처리
document.addEventListener("DOMContentLoaded", function () {
  fetchUserInfo(); // 사용자 정보 가져오기
  fetchGptReport(); // 초기 리포트 요청
});
