document.addEventListener("DOMContentLoaded", function () {
  const nickname = localStorage.getItem("nickname");
  document.getElementById("text-name").textContent = nickname + "님!";
});
document.getElementById("startButton").addEventListener("click", function () {
  const email = localStorage.getItem("email");
  const password = localStorage.getItem("password");
  const nickname = localStorage.getItem("nickname");
  const gender = localStorage.getItem("gender");
  const birthdate = localStorage.getItem("birthdate");
  const weight = localStorage.getItem("weight");
  const sojuAmount = localStorage.getItem("sojuAmount");

  console.log("Email:", email);
  console.log("Password:", password);
  console.log("Nickname:", nickname);
  console.log("Gender:", gender);
  console.log("Birthdate:", birthdate);
  console.log("Weight:", weight);
  console.log("SojuAmount:", sojuAmount);

  const data = {
    email: email,
    password: password,
    nickname: nickname,
    gender: gender,
    birthDate: birthdate,
    weight: weight,
    sojuAmount: sojuAmount,
  };

  fetch("http://3.37.23.33:8080/api/v1/auth/join", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      alert("회원가입 성공!");
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("회원가입 실패");
    });

  window.location.href = "index.html";
});
