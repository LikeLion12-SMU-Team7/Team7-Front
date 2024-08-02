// 페이지가 로드될 때 사용자 정보를 가져오는 함수
function loadUserInfo() {
  const accessToken = getCookie("accessToken");

  if (!accessToken) {
    console.error("액세스 토큰이 없습니다.");
    return;
  }

  fetch("http://3.37.23.33:8080/api/v1/user", {
    method: "GET",
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.isSuccess) {
        const userInfo = data.result;
        console.log("Email:", userInfo.email);
        console.log("Nickname:", userInfo.nickname);
        console.log("Gender:", userInfo.gender);
        console.log("Birthdate:", userInfo.birthDate);
        console.log("Weight:", userInfo.weight);
        console.log("sojuAmount:", userInfo.sojuAmount);

        document.getElementById("email").value = userInfo.email;
        document.getElementById("nickname").value = userInfo.nickname;
        document.querySelector(
          `input[name="gender"][value="${userInfo.gender.toLowerCase()}"]`
        ).checked = true;
        document.getElementById("sojuAmount").value = userInfo.sojuAmount;
        document.getElementById("birth").value = userInfo.birthDate;
        document.getElementById("weight").value = userInfo.weight;
      } else {
        console.error("사용자 정보를 가져오는 데 실패했습니다.");
      }
    })
    .catch((error) => {
      console.error("사용자 정보 요청 중 오류 발생:", error);
    });
}

// 쿠키를 가져오는 함수
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

// 페이지 로드 시 사용자 정보 로드
window.onload = function () {
  disableFields();
  loadUserInfo();
};

document
  .getElementById("logout-link")
  .addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = "/logout";
  });

// 체중 입력값 검증 함수
function validateWeightInput(input) {
  let value = input.value.replace(/\D/g, "");
  if (value.length > 3) {
    value = value.slice(0, 3);
  }

  input.value = value;
}

// 주량 증가 및 감소 함수
function calCount(action, element) {
  const inputField = element.parentElement.querySelector(
    'input[name="pop_out"]'
  );
  let currentValue = parseFloat(inputField.value);
  if (isNaN(currentValue)) {
    currentValue = 0;
  }
  if (action === "p") {
    currentValue += 0.5;
  } else if (action === "m" && currentValue > 0) {
    currentValue -= 0.5;
  }
  inputField.value = currentValue + "병";
}

// 입력 필드 비활성화 함수
function disableFields() {
  document.querySelectorAll("input").forEach((input) => {
    if (input.id !== "email") {
      input.setAttribute("readonly", "readonly");
      input.disabled = true;
    }
  });
  document
    .querySelectorAll('input[type="radio"]')
    .forEach((input) => (input.disabled = true));
  document
    .querySelectorAll(".plus, .minus")
    .forEach((button) => (button.disabled = true));
}

// 입력 필드 활성화 함수
function enableEdit() {
  document.querySelector(".fix-submit").style.display = "none";
  document.querySelector(".setting-submit").style.display = "inline-block";

  document.querySelectorAll("input").forEach((input) => {
    if (input.id !== "email") {
      input.removeAttribute("readonly");
      input.disabled = false;
    }
  });
  document
    .querySelectorAll('input[type="radio"]')
    .forEach((input) => (input.disabled = false));
  document
    .querySelectorAll(".plus, .minus")
    .forEach((button) => (button.disabled = false));
}

// 변경 사항 저장 함수
function saveChanges() {
  document.querySelector(".setting-submit").style.display = "none";
  document.querySelector(".fix-submit").style.display = "inline-block";

  disableFields();
}
