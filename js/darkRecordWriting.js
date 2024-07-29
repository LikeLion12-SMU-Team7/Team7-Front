document.getElementById('submit-btn').addEventListener('click', function(event) {
    event.preventDefault(); // 폼 제출 기본 동작 방지

    const reflectionContent = document.getElementById('reflection-content').value.trim();

    if (!reflectionContent) {
        alert('나의 반성과 다짐은 필수로 입력해 주세요!');
    } else {
        document.querySelector('form').submit();
        alert('기록이 저장되었습니다');
        window.location.href = 'darkRecord.html';
    }
});