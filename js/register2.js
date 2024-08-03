// vector 클래스를 클릭하면 register1.html로 이동
document.querySelector('.vector').addEventListener('click', function() {
  window.location.href = 'register1.html';
});

// 체크박스 상태에 따라 nextButton의 색상과 활성화 상태를 변경하는 함수
function updateNextButtonState() {
  const nextButton = document.getElementById('nextButton');
  const agreeCheckbox = document.getElementById('agreeCheckbox');

  if (agreeCheckbox.checked) {
    nextButton.style.backgroundColor = ''; // 기본 색상으로 복원
    nextButton.style.pointerEvents = 'auto'; // 클릭 가능
  } else {
    nextButton.style.backgroundColor = 'var(--n-200)'; // 비활성화 색상
    nextButton.style.pointerEvents = 'none'; // 클릭 불가
  }
}

// 체크박스 상태 변경 시 nextButton 상태 업데이트
document.getElementById('agreeCheckbox').addEventListener('change', updateNextButtonState);

// 페이지 로드 시 초기 상태 설정
updateNextButtonState();

// nextButton 클릭 시 체크박스 상태 확인
document.getElementById('nextButton').addEventListener('click', function(event) {
  if (!document.getElementById('agreeCheckbox').checked) {
    event.preventDefault();
    alert('개인정보 활용에 동의하지 않으면 서비스를 이용할 수 없어요!');
  }
});