
document.addEventListener("DOMContentLoaded", function () {
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

  const accessToken = getCookie("accessToken");
  // console.log("Access Token:", accessToken); // 토큰 확인을 위해 콘솔에 출력

  fetch(`http://3.37.23.33:8080/api/v1/memory`, {
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
      const darkRecords = data.result;

      const cardContainer = document.getElementById('card-container');
      const noContentContainer = document.querySelector('.no-content-container');

      if (darkRecords.length === 0) {
        noContentContainer.style.display = 'flex';
        cardContainer.style.display = 'none';
      } else {
        noContentContainer.style.display = 'none';
        cardContainer.style.display = 'flex';

        let row;

        for (let i = 0; i < darkRecords.length; i++) {
          if (i % 3 === 0) {
            row = document.createElement('div');
            row.className = 'row';
            cardContainer.appendChild(row);
          }

          const col = document.createElement('div');
          col.className = 'col';
          col.innerHTML = `
            <div class="card">
              <div class="card-body">
                <div class="card-title-wrapper">
                  <p class="card-title">${darkRecords[i].createdAt}의 기록${darkRecords[i].memoryId}</p>
                  <p class="card-text">${darkRecords[i].content}</p>
                </div>
                <button 
                type="button"
                class="btn detail-btn"
                data-date="${darkRecords[i].createdAt}">
                더보기 👀
                </button>
              </div>
            </div>
          `;
          row.appendChild(col);
        }

        if (row && row.children.length < 3) {
          while (row.children.length < 3) {
            const emptyCol = document.createElement('div');
            emptyCol.className = 'col';
            row.appendChild(emptyCol);
          }
        }

        document.querySelectorAll('.detail-btn').forEach((button, index) => {
          button.addEventListener('click', function() {
            const memoryId = darkRecords[index].memoryId;
            window.location.href = `/darkRecordDetail.html?memoryId=${memoryId}`;
          });
        });

        const writeButtons = document.querySelectorAll('.write-btn');
        writeButtons.forEach(button => {
          button.addEventListener('click', function() {
            const currentDate = new Date().toISOString().split('T')[0];
            window.location.href = `darkRecordWriting.html?date=${encodeURIComponent(currentDate)}`;
          });
        });
      }
    } else {
      console.error("사용자 정보를 가져오는 데 실패했습니다.");
    }
  })
  .catch(error => {
    console.error('흑역사 정보를 가져오는 중 에러 발생:', error);
  });
});