document.addEventListener('DOMContentLoaded', function() {
    const dropdownMenuButton = document.getElementById('dropdownMenuButton');
    const dateDropdown = document.getElementById('date-dropdown');
    const selectedDateInput = document.getElementById('selected-date');

    // 최근 7일의 날짜를 계산하여 드롭다운 리스트에 추가
    const today = new Date();
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString = date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const listItem = document.createElement('li');
        const linkItem = document.createElement('a');
        linkItem.className = 'dropdown-item';
        linkItem.href = '#';
        linkItem.textContent = dateString;
        linkItem.addEventListener('click', function(event) {
            event.preventDefault();
            dropdownMenuButton.textContent = dateString;
            selectedDateInput.value = dateString;
        });

        listItem.appendChild(linkItem);
        dateDropdown.appendChild(listItem);
    }
});

document.getElementById('submit-btn').addEventListener('click', function(event) {
    event.preventDefault(); // 폼 제출 기본 동작 방지

    const whenContent = document.getElementById('when-content').value.trim();
    const whereContent = document.getElementById('where-content').value.trim();
    const whoContent = document.getElementById('who-content').value.trim();
    const whatContent = document.getElementById('what-content').value.trim();
    const howContent = document.getElementById('how-content').value.trim();
    const whyContent = document.getElementById('why-content').value.trim();
    const reflectionContent = document.getElementById('reflection-content').value.trim();
    const selectedDate = document.getElementById('selected-date').value;

    if (!reflectionContent) {
        alert('나의 반성과 다짐은 필수로 입력해 주세요!');
    } else if (!selectedDate) {
        alert('날짜를 선택해 주세요!');
    } else {
        const data = {
            when: whenContent,
            where: whereContent,
            withWho: whoContent,
            what: whatContent,
            how: howContent,
            why: whyContent,
            content: reflectionContent
        };

        fetch('/api/v1/memory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            alert('기록이 저장되었습니다');
            window.location.href = 'darkRecord.html';
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('기록 저장에 실패했습니다.');
        });
    }
});