function checkEmailUniqueness(email) {
  const accessToken = "accessToken";
  console.log("accessToken: ", accessToken);
  return fetch(
    `http://3.37.23.33:8080/api/v1/auth/join/email-check/${encodeURIComponent(
      email
    )}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
    .then((response) => {
      console.log("API Response Status:", response.status);
      if (!response.ok) {
        throw new Error("네트워크 응답에 문제가 있습니다.");
      }
      return response.json();
    })
    .then((data) => {
      console.log("API Response:", data);
      if (data.isSuccess && data.code === "COMMON200") {
        return !data.result;
      } else {
        throw new Error(data.message || "Unknown error occurred");
      }
    });
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

  if (password !== confirmPassword) {
    document.getElementById("confirmPasswordError").textContent =
      "비밀번호가 일치하지 않습니다.";
    isValid = false;
  }

  if (isValid) {
    checkEmailUniqueness(username)
      .then((isUnique) => {
        console.log("Is email unique:", isUnique);
        if (isUnique) {
          localStorage.setItem("email", username);
          localStorage.setItem("password", password);
          console.log("Email:", localStorage.getItem("email"));
          console.log("Password:", localStorage.getItem("password"));
          window.location.href = "register2.html";
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
}
