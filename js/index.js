function validateForm(event) {
  event.preventDefault();
  const id = document.getElementById("id").value;
  const password = document.getElementById("password").value;
  const caution = document.querySelector(".caution");

  if (id.length < 4 || password.length < 4) {
    caution.style.visibility = "visible";
    return false;
  }

  caution.style.visibility = "hidden";
  fetch("http://3.37.23.33:8080/api/v1/auth/login", {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({
      email: id,
      password: password,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.isSuccess) {
        // 토큰을 쿠키에 저장
        setCookie("accessToken", data.result.accessToken, 1);
        setCookie("refreshToken", data.result.refreshToken, 7);
        console.log("accessToken 저장:", getCookie("accessToken"));
        console.log("refreshToken 저장:", getCookie("refreshToken"));
        window.location.href = "home.html";
      } else {
        caution.style.visibility = "visible";
      }
    })
    .catch((error) => {
      console.error("로그인 요청 중 오류 발생:", error);
      caution.textContent = "서버 오류";
      caution.style.visibility = "visible";
    });

  return true;
}
function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = name + "=" + (value || "") + ";" + expires + ";path=/";
}
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
function refreshToken() {
  // 쿠키에서 리프레시 토큰 가져오기
  const refreshToken = getCookie("refreshToken");

  if (!refreshToken) {
    console.error("리프레시 토큰이 없습니다.");
    return;
  }

  // 서버에 리프레시 토큰 요청 보내기
  fetch("http://3.37.23.33:8080/api/v1/auth/refresh-token", {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: `Bearer ${refreshToken}`,
    },
    body: JSON.stringify({}),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.accessToken) {
        setCookie("accessToken", data.accessToken, 1);
        console.log("액세스 토큰이 갱신되었습니다:", getCookie("accessToken"));
      } else {
        console.error("새로운 액세스 토큰을 발급받지 못했습니다.");
      }
    })
    .catch((error) => {
      console.error("리프레시 토큰 요청 중 오류 발생:", error);
    });
}

// 페이지 로드 시 자동으로 토큰 갱신 시도
document.addEventListener("DOMContentLoaded", refreshToken);
