// 사용자 주량
let userSojuAmount = 0;
let formattedDate = ""; // formattedDate 변수를 전역으로 선언

document.addEventListener("DOMContentLoaded", () => {
  
  fetchTodayDrinkRecord();
  // 현재 날짜를 기준으로 month 파라미터 설정
  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();
  const currentDate = new Date();

  const noDrinkButton = document.getElementById("no-drink-button");
  const preMonthButton = document.getElementById("pre-month");
  const nextMonthButton = document.getElementById("next-month");

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  function fetchUserData() {
    const token = getCookie("accessToken");

    return fetch("http://3.37.23.33:8080/api/v1/user", {
      method: "GET",
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.isSuccess && data.result) {
          console.log(data.result)
          userSojuAmount = data.result.sojuAmount;
          console.log(userSojuAmount)
          return data.result.nickname;
        } else {
          console.error("Failed to fetch user data from the API:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching user data from the API:", error);
      });
  }


  function fetchMemoryRecords() {
    const token = getCookie("accessToken");

    return fetch("http://3.37.23.33:8080/api/v1/memory", {
      method: "GET",
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.isSuccess && data.result) {
          return data.result;
        } else {
          console.error("Failed to fetch memory records from the API:", data.message);
          return [];
        }
      })
      .catch((error) => {
        console.error("Error fetching memory records from the API:", error);
        return [];
      });
  }

  function fetchDrinkRecord(date) {
    const token = getCookie("accessToken");
    const month = new Date(date).getMonth() + 1; // 월을 1부터 12까지로 맞추기 위해 +1
  
    return fetch(`http://3.37.23.33:8080/api/v1/history?month=${month}`, { // date를 month로 변경
      method: "GET",
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        console.log(data.result)
      })
      .catch((error) => {
        console.error("Error:", error);
        return {};
      });
  }

  function getMemoryContentByDate(date) {
    fetchMemoryRecords().then((records) => {
      const memory = records.find(record => record.createdAt === date);
      if (memory) {
        console.log(`Memory content for ${date}: ${memory.content}`);
        // 여기서 memory.content를 원하는 방식으로 처리합니다.
      } else {
        console.log(`No memory record found for ${date}`);
      }
    });
  }


  function updateDrinkRecordDisplay(record = {}) {
    sojuInput.value = `${record.sojuConsumption || 0}잔`;
    beerInput.value = `${record.beerConsumption || 0}잔`;
    wineInput.value = `${record.wineConsumption || 0}잔`;
    makgeolliInput.value = `${record.makgeolliConsumption || 0}잔`;
  
    document.querySelector('.text-wrapper-8[data-drink="soju"]').textContent = `소주 ${record.sojuConsumption || 0}잔 (${(record.sojuConsumption || 0) * 45}ml)`;
    document.querySelector('.text-wrapper-8[data-drink="beer"]').textContent = `맥주 ${record.beerConsumption || 0}잔 (${(record.beerConsumption || 0) * 167}ml)`;
    document.querySelector('.text-wrapper-8[data-drink="wine"]').textContent = `와인 ${record.wineConsumption || 0}잔 (${(record.wineConsumption || 0) * 150}ml)`;
    document.querySelector('.text-wrapper-8[data-drink="makgeolli"]').textContent = `막걸리 ${record.makgeolliConsumption || 0}잔 (${(record.makgeolliConsumption || 0) * 150}ml)`;
  }

  const sojuInput = document.querySelector('input[data-drink="soju"]');
  const beerInput = document.querySelector('input[data-drink="beer"]');
  const wineInput = document.querySelector('input[data-drink="wine"]');
  const makgeolliInput = document.querySelector('input[data-drink="makgeolli"]');

  function fetchTodayDrinkRecord(date) {
    const token = getCookie("accessToken");
    const queryDate = date || new Date().toISOString().split("T")[0];
  
    return fetch(`http://3.37.23.33:8080/api/v1/history/today?date=${queryDate}`, {
      method: "GET",
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.isSuccess && data.result) {
          updateDrinkRecordDisplay({
            sojuConsumption: data.result.todaySojuConsumption,
            beerConsumption: data.result.todayBeerConsumption,
            wineConsumption: data.result.todayWineConsumption,
            makgeolliConsumption: data.result.todayMakgeolliConsumption,
          });
          console.log(data.result)
        } else {
          console.error("Failed to fetch drink record:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  function calCount(action, element) {
    const inputField = element.parentElement.querySelector('input[name="pop_out"]');
    let currentValue = parseInt(inputField.value);
    if (isNaN(currentValue)) {
      currentValue = 0;
    }
    if (action === "p") {
      currentValue += 1;
    } else if (action === "m" && currentValue > 0) {
      currentValue -= 1;
    }
    inputField.value = currentValue + "잔";
    updateDrinkRecord(element.dataset.drink, currentValue);
    updateDrinkRecordDisplay(getCurrentDrinkCounts());
  }

  function getCurrentDrinkCounts() {
    const sojuInput = document.querySelector('input[data-drink="soju"]');
    const beerInput = document.querySelector('input[data-drink="beer"]');
    const wineInput = document.querySelector('input[data-drink="wine"]');
    const makgeolliInput = document.querySelector('input[data-drink="makgeolli"]');

    return {
      soju: parseInt(sojuInput.value) || 0,
      beer: parseInt(beerInput.value) || 0,
      wine: parseInt(wineInput.value) || 0,
      makgeolli: parseInt(makgeolliInput.value) || 0,
    };
  }

  function updateDrinkRecord(drinkType, count) {
    const date = formattedDate || currentDate.toISOString().split("T")[0];
    const token = getCookie("accessToken");

    const currentCounts = getCurrentDrinkCounts();

    if (drinkType === "soju") currentCounts.soju = count;
    else if (drinkType === "beer") currentCounts.beer = count;
    else if (drinkType === "wine") currentCounts.wine = count;
    else if (drinkType === "makgeolli") currentCounts.makgeolli = count;

    fetch("http://3.37.23.33:8080/api/v1/history", {
      method: "POST",
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date,
        sojuConsumption: currentCounts.soju,
        wineConsumption: currentCounts.wine,
        beerConsumption: currentCounts.beer,
        makgeolliConsumption: currentCounts.makgeolli,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        updateCalendar(currentMonth, currentYear);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

document.querySelectorAll('input[name="pop_out"]').forEach((input) => {
    input.addEventListener("input", function () {
      let inputValue = this.value.replace(/[^0-9]/g, "");
      if (inputValue === "") {
        inputValue = 0;
      }
      this.value = parseInt(inputValue) + "잔";
    });
  });

  function fetchCalendarData(month, year) {
    const token = getCookie("accessToken");
    return fetch(`http://3.37.23.33:8080/api/v1/home?month=${month + 1}`, {
      method: "GET",
      headers: {
        'Accept': "*/*",
        'Authorization': `Bearer ${token}`,
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
        return data.result.calendarList;
      } else {
        throw new Error("Failed to fetch calendar data");
      }
    });
  }

  function updateCalendar(month, year) {
    const monthLabel = document.getElementById("month-label");
    const calendarDays = document.getElementById("calendar-days");
    const monthNames = [
      "1월", "2월", "3월", "4월", "5월", "6월",
      "7월", "8월", "9월", "10월", "11월", "12월"
    ];

    monthLabel.textContent = monthNames[month];
    calendarDays.innerHTML = "";

    fetchCalendarData(month, year).then(calendarList => {
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const userSojujan = userSojuAmount * 8;

      let day = 1;
      for (let i = 0; i < 6; i++) {
        const row = document.createElement("div");
        row.className = "frame-8";
        let rowHasDay = false;

        for (let j = 0; j < 7; j++) {
          const cell = document.createElement("div");
          cell.className = "group";

          if (i === 0 && j < firstDay) {
            cell.classList.add("disabled-water-drop");
          } else if (day > daysInMonth) {
            cell.classList.add("disabled-water-drop");
          } else {
            rowHasDay = true;
            const currentDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const currentDayData = calendarList.find(item => item.date === currentDateStr);
            if (currentDayData) {
              if (userSojujan > currentDayData.totalConsumption) {
                cell.classList.add("green-water-drop");
              } else if (userSojujan === currentDayData.totalConsumption) {
                cell.classList.add("yellow-water-drop");
              } else {
                cell.classList.add("red-water-drop");
              }
              } else {
                cell.classList.add("gray-water-drop");
              }
              
              cell.addEventListener('click', function() {
              formattedDate = currentDateStr;
              fetchTodayDrinkRecord(currentDateStr);
              updateDate(currentDateStr);
            });
            cell.textContent = day;
            day++;
          }
          row.appendChild(cell);
        }
        
        if (rowHasDay) {
          calendarDays.appendChild(row);
        }
      }
    }).catch(error => {
      console.error('Error fetching calendar data:', error);
    });
  }

  function updateDate(date) {
    const dayElement = document.querySelector(".day");
    const [year, month, day] = date.split("-");
    const formattedDateStr = `${month}월 ${day}일`;
    dayElement.textContent = `${formattedDateStr} 나의 음주 기록`;
  }

  function updateNickname(nickname) {
    const textWrapper = document.querySelector(".text-wrapper");
    textWrapper.innerHTML = `${nickname}님,<br />오늘의 음주를 기록해주세요`;
  }

  fetchUserData().then(updateNickname);

  const todayDate = currentDate.toISOString().split("T")[0];
  updateDate(todayDate);
  updateCalendar(currentMonth, currentYear);

  document.getElementById("record-btn").addEventListener("click", function () {
    window.location.href = "darkRecord.html";
  });

  noDrinkButton.addEventListener("click", () => {
    const date = formattedDate || currentDate.toISOString().split("T")[0];
    const token = getCookie("accessToken");

    fetch("http://3.37.23.33:8080/api/v1/history/none-drink", {
      method: "POST",
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("오늘 술을 안마셨군요! 축하드려요!");
        updateDrinkRecordDisplay({
          sojuConsumption: 0,
          beerConsumption: 0,
          wineConsumption: 0,
          makgeolliConsumption: 0,
        });
        updateCalendar(currentMonth, currentYear);
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("기록에 실패했습니다.");
      });
  });

  preMonthButton.addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    updateCalendar(currentMonth, currentYear);
  });

  nextMonthButton.addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    updateCalendar(currentMonth, currentYear);
  });

  fetchDrinkRecord(todayDate).then(updateDrinkRecordDisplay);

  window.calCount = calCount;
});