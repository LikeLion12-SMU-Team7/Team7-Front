document.addEventListener("DOMContentLoaded", function () {
    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear().toString().slice(-2); // 연도를 두 자리로 변환
        const month = date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더함
        const day = date.getDate();
    
        return `${year}년 ${month}월 ${day}일`;
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

    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    const accessToken = getCookie("accessToken");
    const memoryId = getQueryParam('memoryId'); // URL에서 memoryId를 가져옴

    fetch(`http://3.37.23.33:8080/api/v1/memory/${memoryId}`, {
        method: "GET",
        headers: {
            'Accept': "*/*",
            'Authorization': `Bearer ${accessToken}`,
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.isSuccess) {
            const result = data.result;
            const formattedDate = formatDate(result.createdAt);
            document.querySelector('.text-main p').textContent = `${formattedDate}의 기록`;
            document.getElementById('when-content').value = result.when;
            document.getElementById('where-content').value = result.where;
            document.getElementById('who-content').value = result.withWho;
            document.getElementById('what-content').value = result.what;
            document.getElementById('how-content').value = result.how;
            document.getElementById('why-content').value = result.why;
            document.getElementById('reflection-content').value = result.content;
        } else {
            console.error('Failed to fetch memory details:', data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

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
});