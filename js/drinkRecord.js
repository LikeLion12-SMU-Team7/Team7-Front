document.addEventListener("DOMContentLoaded", () => {
  const monthLabel = document.getElementById("month-label");
  const calendarDays = document.getElementById("calendar-days");
  const currentDate = new Date();
  const noDrinkButton = document.getElementById("no-drink-button");
  noDrinkButton.addEventListener("click", () => {
    alert("오늘 술을 안마셨군요! 축하드려요!");
  });
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();

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

  updateCalendar(currentMonth, currentYear);

  // You can add event listeners for buttons to navigate between months if needed
});
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
