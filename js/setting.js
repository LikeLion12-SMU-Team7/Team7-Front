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
  const accessToken = getCookie("accessToken");

  if (!accessToken) {
    console.error("액세스 토큰이 없습니다.");
    return;
  }

  // 폼 필드에서 값 가져오기
  const nickname = document.getElementById("nickname").value;
  const gender = document.querySelector('input[name="gender"]:checked').value;
  const sojuAmount = parseFloat(document.getElementById("sojuAmount").value);
  const birthDate = document.getElementById("birth").value;
  const weight = parseFloat(document.getElementById("weight").value);

  // 요청 본문 생성
  const requestBody = {
    nickname: nickname,
    gender: gender.toUpperCase(),
    sojuAmount: sojuAmount,
    birthDate: birthDate,
    weight: weight,
  };

  // 변경 사항 저장을 위한 API 요청
  fetch("http://3.37.23.33:8080/api/v1/user", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.isSuccess) {
        console.log("정보가 성공적으로 저장되었습니다.");
        const updatedUserInfo = data.result;
        console.log("Email:", updatedUserInfo.email);
        console.log("Nickname:", updatedUserInfo.nickname);
        console.log("Gender:", updatedUserInfo.gender);
        console.log("Birthdate:", updatedUserInfo.birthDate);
        console.log("Weight:", updatedUserInfo.weight);
        console.log("Soju Amount:", updatedUserInfo.sojuAmount);

        disableFields(); // 저장 후 필드 비활성화
        document.querySelector(".setting-submit").style.display = "none"; // 저장 버튼 숨기기
        document.querySelector(".fix-submit").style.display = "inline-block"; // 수정 버튼 보이기
      } else {
        console.error("정보 저장에 실패했습니다: ", data.message);
      }
    })
    .catch((error) => {
      console.error("정보 저장 중 오류 발생:", error);
    });
}
