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
