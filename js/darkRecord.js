// 임시 데이터
const darkRecords = [
        {
          date: '24년 7월 22일',
          content: '민수에게 상처를 준 것 같아 반성된다. 다음부터는 술을 적당히 마시고, 감정이 격해질 때는 한 걸음 물러서기로 다짐한다.'
        },
        {
          date: '24년 7월 23일',
          content: '지나친 음주로 집에 돌아오는 길을 기억하지 못했다. 다음부터는 집에 가기 전에 충분히 쉬어야겠다.'
        },
        {
          date: '24년 7월 24일',
          content: '술을 마시고 친구에게 불필요한 말을 했다. 앞으로는 말조심을 해야겠다.'
        },
        {
          date: '24년 7월 25일',
          content: '과음으로 인해 다음날 일을 제대로 하지 못했다. 다음에는 음주 후 충분히 쉬어야겠다.'
        },
        {
          date: '24년 7월 26일',
          content: '술에 취해 소중한 물건을 잃어버렸다. 다음부터는 술을 적당히 마시고, 중요한 물건을 안전한 곳에 보관해야겠다.'
        },
        {
          date: '24년 7월 27일',
          content: '친구와의 약속을 잊어버렸다. 음주 후에는 약속을 다시 확인해야겠다.'
        },
        {
          date: '24년 7월 28일',
          content: '술자리에서 무례한 행동을 했다. 다음에는 더 신중하게 행동해야겠다.'
        },
        {
          date: '24년 7월 29일',
          content: '과음으로 인해 건강이 나빠진 느낌이다. 앞으로는 음주량을 조절해야겠다.'
        },
        {
          date: '24년 7월 30일',
          content: '술에 취해 실수를 많이 했다. 다음에는 음주를 자제해야겠다.'
        },
        {
          date: '24년 7월 31일',
          content: '음주 후 운전을 해서 위험한 상황을 만들었다. 절대로 술을 마신 후 운전하지 않기로 다짐한다.'
        },
        {
          date: '24년 8월 1일',
          content: '과음으로 인해 다음날 일정을 취소했다. 음주 후 일정 조율을 잘해야겠다.'
        },
        {
          date: '24년 8월 2일',
          content: '술에 취해 다른 사람과 다툼이 있었다. 앞으로는 술자리에서 침착하게 행동해야겠다.'
        },
        {
          date: '24년 8월 3일',
          content: '과음으로 인해 기억이 희미하다. 다음부터는 음주량을 줄여야겠다.'
        },
        {
          date: '24년 8월 4일',
          content: '친구에게 민폐를 끼쳤다. 음주 후 행동을 더 신경써야겠다.'
        },
        {
          date: '24년 8월 5일',
          content: '과음으로 인해 건강에 문제가 생겼다. 술을 줄이고 건강을 챙겨야겠다.'
        },
        {
          date: '24년 8월 6일',
          content: '술을 마시고 소란을 피웠다. 다음부터는 더 조심해야겠다.'
        }
  ];

// 카드 렌더링
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
            <p class="card-title">${darkRecords[i].date}의 기록</p>
            <p class="card-text">${darkRecords[i].content}</p>
          </div>
          <button 
          type="button"
          class="btn detail-btn"
          data-date="${darkRecords[i].date}">
          더보기 👀
          </button>
        </div>
      </div>
    `;
    row.appendChild(col);
    }
  
    // 마지막 row가 3개의 col로 채워지지 않은 경우, 빈 col 추가
     if (row && row.children.length < 3) {
        while (row.children.length < 3) {
        const emptyCol = document.createElement('div');
        emptyCol.className = 'col';
        row.appendChild(emptyCol);
        }
    }

    // 상세 버튼 클릭
    document.querySelectorAll('.detail-btn').forEach(button => {
        button.addEventListener('click', function() {
        // const date = this.getAttribute('data-date');
        // window.location.href = `darkRecordDetail.html?date=${encodeURIComponent(date)}`;
        window.location.href = `darkRecordDetail.html`;
        });
    });

    // 쓰기 버튼 클릭
    const writeButtons = document.querySelectorAll('.write-btn');
        writeButtons.forEach(button => {
            button.addEventListener('click', function() {
            // const currentDate = new Date().toISOString().split('T')[0]; // 현재 날짜를 'YYYY-MM-DD' 형식으로 가져오기
            // window.location.href = `darkRecordWriting.html?date=${encodeURIComponent(currentDate)}`;
            window.location.href = `darkRecordWriting.html`;
            });
        });
    }