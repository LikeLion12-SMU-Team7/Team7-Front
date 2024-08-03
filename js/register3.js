function isValidDate(dateString) {
  // 날짜 형식이 YYYY-MM-DD인지 확인
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regex)) return false;

  const date = new Date(dateString);
  const timestamp = date.getTime();

  if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) return false;

  return dateString === date.toISOString().split('T')[0];
}


// vector 클래스를 클릭하면 register1.html로 이동
document.querySelector('.vector').addEventListener('click', function() {
  window.location.href = 'register2.html';
});

// 모든 입력 필드와 버튼을 변수에 저장
const nicknameInput = document.getElementById("nickname");
const genderInputs = document.querySelectorAll('input[name="gender"]');
const birthdateInput = document.getElementById("birthdate");
const weightInput = document.getElementById("weight");
const nextButton = document.getElementById("nextButton");

// 입력 필드의 값이 변경될 때마다 호출되는 함수
function checkInputs() {
  const nickname = nicknameInput.value;
  const gender = Array.from(genderInputs).some(input => input.checked);
  const birthdate = birthdateInput.value;
  const weight = weightInput.value;

  if (nickname && gender && birthdate && weight) {
    nextButton.style.backgroundColor = ""; // 원래 색상으로 변경
    nextButton.style.pointerEvents = "auto"; // 버튼 활성화
  } else {
    nextButton.style.backgroundColor = "var(--n-200)"; // 색상 변경
    nextButton.style.pointerEvents = "none"; // 버튼 비활성화
  }
}

// 각 입력 필드에 이벤트 리스너 추가
nicknameInput.addEventListener("input", checkInputs);
genderInputs.forEach(input => input.addEventListener("change", checkInputs));
birthdateInput.addEventListener("input", checkInputs);
weightInput.addEventListener("input", checkInputs);

// 초기 상태 확인
checkInputs();

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
        "닉네임은 최소 2글자, 최대 7글자이며, 'test'와 중복될 수 없어요"
      );
      return;
    }
    
    var gender = document.querySelector('input[name="gender"]:checked');
    if (!gender) {
      alert("성별을 선택해 주세요");
      return;
    }
    var birthdate = document.getElementById("birthdate").value;
    if (!birthdate) {
      alert("생년월일을 입력해 주세요");
      return;
    }

    if (!isValidDate(birthdate)) {
      alert("유효한 생년월일을 입력해 주세요!");
      return;
    }  

    var weight = document.getElementById("weight").value;
    if (!weight) {
      alert("체중을 입력해 주세요");
      return;
    }
  
    if (weight > 200) {
      alert("유효한 몸무게를 입력해 주세요!");
      return;
    }
    localStorage.setItem("nickname", nickname);
    localStorage.setItem("gender", gender.value);
    localStorage.setItem("birthdate", birthdate);
    localStorage.setItem("weight", weight);

    // Log saved values to console
    console.log("Nickname:", localStorage.getItem("nickname"));
    console.log("Gender:", localStorage.getItem("gender"));
    console.log("Birthdate:", localStorage.getItem("birthdate"));
    console.log("Weight:", localStorage.getItem("weight"));
    // 유효성 검사가 모두 통과되면 다음 페이지로 이동
    window.location.href = "register4.html";
  });
