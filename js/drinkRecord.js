document.addEventListener("DOMContentLoaded", () => {
  const monthLabel = document.getElementById("month-label");
  const calendarDays = document.getElementById("calendar-days");
  const currentDate = new Date();
  const noDrinkButton = document.getElementById("no-drink-button");

  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  function fetchDrinkRecord() {
    const date = currentDate.toISOString().split("T")[0];
    const token = getCookie("accessToken");

    return fetch(`http://3.37.23.33:8080/api/v1/history?date=${date}`, {
      method: "GET",
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error("Error:", error);
        return {};
      });
  }

  function updateDrinkRecordDisplay(record) {
    const sojuInput = document.querySelector('input[data-drink="soju"]');
    const beerInput = document.querySelector('input[data-drink="beer"]');
    const wineInput = document.querySelector('input[data-drink="wine"]');
    const makgeolliInput = document.querySelector(
      'input[data-drink="makgeolli"]'
    );

    sojuInput.value = `${record.sojuConsumption || 0}잔`;
    beerInput.value = `${record.beerConsumption || 0}잔`;
    wineInput.value = `${record.wineConsumption || 0}잔`;
    makgeolliInput.value = `${record.makgeolliConsumption || 0}잔`;
  }

  function getCurrentDrinkCounts() {
    const sojuInput = document.querySelector('input[data-drink="soju"]');
    const beerInput = document.querySelector('input[data-drink="beer"]');
    const wineInput = document.querySelector('input[data-drink="wine"]');
    const makgeolliInput = document.querySelector(
      'input[data-drink="makgeolli"]'
    );

    return {
      soju: parseInt(sojuInput.value) || 0,
      beer: parseInt(beerInput.value) || 0,
      wine: parseInt(wineInput.value) || 0,
      makgeolli: parseInt(makgeolliInput.value) || 0,
    };
  }

  function updateCalendar(month, year) {
    const monthNames = [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
    ];
    monthLabel.textContent = monthNames[month];
    calendarDays.innerHTML = "";

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let day = 1;
    for (let i = 0; i < 6; i++) {
      const row = document.createElement("div");
      row.className = "frame-8";
      let rowHasDay = false; // Track if the row contains any valid day of the month

      for (let j = 0; j < 7; j++) {
        const cell = document.createElement("div");
        cell.className = "group";

        if (i === 0 && j < firstDay) {
          cell.classList.add("disabled-water-drop");
        } else if (day > daysInMonth) {
          cell.classList.add("disabled-water-drop");
        } else {
          rowHasDay = true;
          if (day === 1) {
            cell.classList.add("red-water-drop");
          } else if (day === 2) {
            cell.classList.add("yellow-water-drop");
          } else if (day === 3) {
            cell.classList.add("green-water-drop");
          } else {
            cell.classList.add("gray-water-drop");
          }
          cell.innerHTML = `<div class="text-wrapper-6">${day}</div>`;
          day++;
        }
        row.appendChild(cell);
      }

      // Append the row only if it contains valid days of the month
      if (rowHasDay) {
        calendarDays.appendChild(row);
      }
    }
  }

  function calCount(action, element) {
    const inputField = element.parentElement.querySelector(
      'input[name="pop_out"]'
    );
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
  }

  function updateDrinkRecord(drinkType, count) {
    const date = currentDate.toISOString().split("T")[0];
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
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  document
    .querySelector('input[name="pop_out"]')
    .addEventListener("input", function () {
      let inputValue = this.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
      if (inputValue === "") {
        inputValue = 0;
      }
      this.value = parseInt(inputValue) + "잔";
    });

  function updateDate() {
    const dayElement = document.querySelector(".day");
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const formattedDate = `${month}월 ${day}일`;

    dayElement.textContent = `${formattedDate} 나의 음주 기록`;
  }

  updateDate();

  document.getElementById("record-btn").addEventListener("click", function () {
    window.location.href = "darkRecord.html";
  });

  noDrinkButton.addEventListener("click", () => {
    const date = currentDate.toISOString().split("T")[0];
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
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("기록에 실패했습니다.");
      });
  });

  // Fetch and display the initial drink record
  fetchDrinkRecord().then(updateDrinkRecordDisplay);

  // Make sure the calCount function is globally accessible
  window.calCount = calCount;

  updateCalendar(currentMonth, currentYear);
});
