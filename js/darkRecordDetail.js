document.getElementById('edit-btn').addEventListener('click', function() {
    const inputs = document.querySelectorAll('input, textarea');
    
    // 각 요소의 disabled 속성 해제
    inputs.forEach(input => {
        input.disabled = false;
    });

    document.querySelector('.button-wrapper').style.display = 'none';
    document.getElementById('submit-btn').style.display = 'block';
});

document.getElementById('submit-btn').addEventListener('click', function(event) {
    event.preventDefault(); // 폼 제출 기본 동작 방지

    document.querySelector('form').submit();
    alert('기록이 저장되었습니다.');
});

document.getElementById('delete-btn').addEventListener('click', function() {
    if (confirm('기록을 정말 삭제하시겠습니까?')) {
        alert('기록이 삭제되었습니다.');
    }
});