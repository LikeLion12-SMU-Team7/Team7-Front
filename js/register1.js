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
      "이미 등록된 아이디입니다.";
    isValid = false;
  } else if (!username.includes("@")) {
    document.getElementById("usernameError").textContent =
      "유효한 이메일 형식으로 입력해주세요.";
    isValid = false;
  }

  // Validate password
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    document.getElementById("passwordError").textContent =
      "비밀번호는 대소문자, 특수기호를 포함한 8자리 이상이어야 합니다.";
    isValid = false;
  }

  // Validate confirm password
  if (password !== confirmPassword) {
    document.getElementById("confirmPasswordError").textContent =
      "비밀번호가 일치하지 않습니다.";
    isValid = false;
  }

  if (isValid) {
    checkEmailUniqueness(username)
      .then((isUnique) => {
        console.log("Is email unique:", !isUnique);
        if (isUnique) {
          localStorage.setItem("email", username);
          localStorage.setItem("password", password);
          console.log("Email:", localStorage.getItem("email"));
          console.log("Password:", localStorage.getItem("password"));
        } else {
          document.getElementById("usernameError").textContent =
            "이미 등록된 이메일입니다.";
        }
      })
      .catch((error) => {
        console.error("Error checking email uniqueness:", error);
        alert("이메일 중복 검사를 수행하는 도중 오류가 발생했습니다.");
      });
  }
  if (isValid) {
    alert("Validation Passed. Form submitted!");
    localStorage.setItem("email", username);
    localStorage.setItem("password", password);
    console.log("Email:", localStorage.getItem("email"));
    console.log("Password:", localStorage.getItem("password"));
    window.location.href = "register2.html";
  }
}
function checkEmailUniqueness(email) {
  const token = "token";
  return fetch(
    `http://3.37.23.33:8080/api/v1/auth/join/email-check/${encodeURIComponent(
      email
    )}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("API Response:", data);
      return !data;
    });
}
