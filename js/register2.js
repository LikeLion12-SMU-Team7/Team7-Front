document
  .getElementById("nextButton")
  .addEventListener("click", function (event) {
    if (!document.getElementById("agreeCheckbox").checked) {
      event.preventDefault();
      alert("개인정보 활용에 동의하셔야 합니다.");
    }
  });
