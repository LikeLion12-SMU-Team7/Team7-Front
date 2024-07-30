document
  .getElementById("registrationForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    validateForm();
  });

function validateForm() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  let isValid = true;

  // Reset errors
  document.getElementById("usernameError").textContent = "";
  document.getElementById("passwordError").textContent = "";
  document.getElementById("confirmPasswordError").textContent = "";

  // Validate username
  if (username === "test") {
    document.getElementById("usernameError").textContent =
      "이미 등록된 이메일 아이디에요";
    isValid = false;
  } else if (!username.includes("@")) {
    document.getElementById("usernameError").textContent =
      "유효한 이메일 형식으로 입력해주세요";
    isValid = false;
  }

  // Validate password
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    document.getElementById("passwordError").textContent =
      "비밀번호는 8~24자 이내, 영문 대소문자, 숫자, 특수기호 조합으로 입력해 주세요";
    isValid = false;
  }

  // Validate confirm password
  if (password !== confirmPassword) {
    document.getElementById("confirmPasswordError").textContent =
      "비밀번호가 일치하지 않습니다.";
    isValid = false;
  }

  if (isValid) {
    console.log("Validation Passed. Form submitted!");
    window.location.href = "register2.html";
  }
}

// 모든 입력 필드의 상태를 확인하는 함수
function updateNextButtonState() {
    const nextButton = document.getElementById('nextButton');
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
  
    if (username && password && confirmPassword) {
      nextButton.style.backgroundColor = ''; // 기본 색상으로 복원
      nextButton.style.pointerEvents = 'auto'; // 클릭 가능
    } else {
      nextButton.style.backgroundColor = 'var(--n-200)'; // 비활성화 색상
      nextButton.style.pointerEvents = 'none'; // 클릭 불가
    }
  }
  
  // 입력 필드 상태 변경 시 nextButton 상태 업데이트
  document.getElementById('username').addEventListener('input', updateNextButtonState);
  document.getElementById('password').addEventListener('input', updateNextButtonState);
  document.getElementById('confirmPassword').addEventListener('input', updateNextButtonState);
  
  // 페이지 로드 시 초기 상태 설정
  updateNextButtonState();

