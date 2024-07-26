document
  .getElementById("nextButton")
  .addEventListener("click", function (event) {
    var nickname = document.getElementById("nickname").value;
    var testNicknames = ["test"]; // 중복 닉네임 목록
    if (
      nickname.length < 2 ||
      nickname.length > 7 ||
      testNicknames.includes(nickname)
    ) {
      alert(
        "닉네임은 최소 2글자, 최대 7글자이며, 'test'와 중복될 수 없습니다."
      );
      return;
    }
    var gender = document.querySelector('input[name="gender"]:checked');
    if (!gender) {
      alert("성별을 선택해주세요.");
      return;
    }
    var birthdate = document.getElementById("birthdate").value;
    if (!birthdate) {
      alert("생년월일을 입력해주세요.");
      return;
    }
    var weight = document.getElementById("weight").value;
    if (!weight) {
      alert("체중을 입력해주세요.");
      return;
    }
    // 유효성 검사가 모두 통과되면 다음 페이지로 이동
    window.location.href = "register4.html";
  });
