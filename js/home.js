// 사용자 주량
let userSojuAmount = 0;

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

  // 현재 날짜를 기준으로 month 파라미터 설정
  const currentMonth = new Date().getMonth() + 1; // 월은 0부터 시작하므로 +1

  // 유저 프로필 조회
  fetch(`/api/v1/user`, {
    method: "GET",
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => {
      console.log(`Response status: ${response.status}`); // 추가 로그
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data.isSuccess) {
        const userNicknameElement = document.getElementById("user-nickname");
        userNicknameElement.textContent = `${data.result.nickname}님,`;
        userSojuAmount = data.result.sojuAmount;
      }
    })
    .catch((error) => {
      console.error("사용자 정보를 가져오는 중 에러 발생:", error);
    });

  // 홈 대시보드 조회
  fetch(`/api/v1/home?month=${currentMonth}`, {
    method: "GET",
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => {
      console.log(`Response status: ${response.status}`); // 추가 로그
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data.isSuccess) {
        console.log(data.result);
        const calendarList = data.result.calendarList;
        const alcoholFreeDay = data.result.alcoholFreeDay;
        const continuousRecordDay = data.result.continuousRecordDay;
        const info = data.result.info;

        // 연속 기록
        const userContinuousRecordDayElement = document.getElementById(
          "user-continuousRecordDay"
        );
        userContinuousRecordDayElement.textContent = `연속 ${continuousRecordDay}일째 기록 완료`;

        // 술 없는 날
        const alcoholFreeDayElement = document.getElementById(
          "user-alcoholFreeDay"
        );
        alcoholFreeDayElement.textContent = `술 없는 날 ${alcoholFreeDay}일`;

        // 포인트
        const pointElement = document.getElementById("user-point");
        pointElement.textContent = info.point;

        // 칼로리
        const calorieElement = document.getElementById("user-calorie");
        calorieElement.textContent = `${info.monthlyCalorie
          .toFixed(1)
          .toLocaleString()}kcal`;

        // 예상 음주 지출
        const expectedCostElement =
          document.getElementById("user-expectedCost");
        expectedCostElement.textContent = `${info.expectedCost
          .toFixed(1)
          .toLocaleString()}원`;

        // 예상 음주 지출을 각 food의 가격으로 나누기
        const tanghuluPrice = 5000;
        const gukbapPrice = 10000;
        const chickenPrice = 20000;

        const tanghuluCount = (info.expectedCost / tanghuluPrice).toFixed(1);
        const gukbapCount = (info.expectedCost / gukbapPrice).toFixed(1);
        const chickenCount = (info.expectedCost / chickenPrice).toFixed(1);

        // 음식 가격에 따라 개수 산출
        function updateFoodCount(food, count) {
          const foodContainer = document.querySelector(
            `.food-container[data-food="${food}"]`
          );
          const foodCountElement = foodContainer.querySelector(".food-count");

          switch (food) {
            case "rice":
              foodCountElement.textContent = `${count}그릇`;
              break;
            case "tanghulu":
              foodCountElement.textContent = `${count}개`;
              break;
            case "chicken":
              foodCountElement.textContent = `${count}마리`;
              break;
            default:
              break;
          }
        }

        // 기본 선택된 음식 항목 설정
        const defaultFood = "rice";
        updateFoodCount(defaultFood, gukbapCount);
        document.querySelector(
          `.food-container[data-food="${defaultFood}"]`
        ).style.display = "flex";

        // 드롭다운 메뉴에서 선택된 항목을 감지하는 이벤트 리스너 추가
        const dropdownMenu = document.querySelector(".dropdown-menu");
        dropdownMenu.addEventListener("click", function (event) {
          const selectedFood = event.target.getAttribute("data-food");
          if (selectedFood) {
            // 모든 food-container 숨기기
            document
              .querySelectorAll(".food-container")
              .forEach((container) => {
                container.style.display = "none";
              });

            // 선택된 food-container 보이기
            const selectedFoodContainer = document.querySelector(
              `.food-container[data-food="${selectedFood}"]`
            );
            selectedFoodContainer.style.display = "flex";

            // 음식 개수 업데이트
            if (selectedFood === "rice") {
              updateFoodCount("rice", gukbapCount);
            } else if (selectedFood === "tanghulu") {
              updateFoodCount("tanghulu", tanghuluCount);
            } else if (selectedFood === "chicken") {
              updateFoodCount("chicken", chickenCount);
            }
          }
        });

        // 캘린더
        const monthLabel = document.getElementById("month-label");
        const calendarDays = document.getElementById("calendar-days");
        const currentDate = new Date();
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

          const userSojujan = userSojuAmount * 8;

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
                console.log(userSojujan);
                rowHasDay = true;
                const currentDateStr = `${year}-${String(month + 1).padStart(
                  2,
                  "0"
                )}-${String(day).padStart(2, "0")}`;
                const currentDayData = calendarList.find(
                  (item) => item.date === currentDateStr
                );
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
                cell.innerHTML = `<div class="text-wrapper-6">${day}</div>`;
                day++;
              }
              row.appendChild(cell);
            }

            if (rowHasDay) {
              calendarDays.appendChild(row);
            }
          }
        }

        updateCalendar(currentMonth, currentYear);
      } else {
        console.error("사용자 정보를 가져오는 데 실패했습니다.");
      }
    })
    .catch((error) => {
      console.error("홈 정보를 가져오는 중 에러 발생:", error);
    });

  fetch(`/api/v1/monthly-statistics/count`, {
    method: "GET",
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => {
      console.log(`Response status: ${response.status}`); // 추가 로그
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data.isSuccess && data.result) {
        const monthlyDrinkCount = data.result.drinkCount;
        const monthlyDrinkCountDifference = data.result.drinkCountDiff;

        const monthlyDrinkCountElement = document.getElementById(
          "user-monthly-drink-count"
        );
        monthlyDrinkCountElement.textContent = `음주빈도 ${monthlyDrinkCount}회`;

        const monthlyDrinkCountDifferenceElement = document.getElementById(
          "user-monthly-drink-count-difference"
        );
        const emoji = document.getElementById("emoji");
        const monthlyDrinkContainer = document.querySelector(".frame-11");

        if (monthlyDrinkCountDifference === 0) {
          emoji.innerHTML = `<img src="img/weekSmile.png" alt="weekSmile" class="emoji">`;
          monthlyDrinkCountDifferenceElement.textContent = `${monthlyDrinkCountDifference}회로 지난 달과 비슷해요`;
          monthlyDrinkContainer.style.backgroundColor = "#F8E187";
        } else if (monthlyDrinkCountDifference > 0) {
          emoji.innerHTML = `<img src="img/vomit.png" alt="vomit" class="emoji">`;
          monthlyDrinkCountDifferenceElement.textContent = `지난 달 보다 ${monthlyDrinkCountDifference}회 더 마셨어요`;
          monthlyDrinkContainer.style.backgroundColor = "#F3A59E";
        } else {
          emoji.innerHTML = `<img src="img/starface.png" alt="star" class="emoji">`;
          monthlyDrinkCountDifferenceElement.textContent = `지난 달 보다 ${Math.abs(
            monthlyDrinkCountDifference
          )}회 덜 마셨어요`;
          monthlyDrinkContainer.style.backgroundColor = "#93D6B0";
        }
      }
    })
    .catch((error) => {
      console.error("월간 대시보드 정보를 가져오는 중 에러 발생:", error);
    });

  // 오늘도 안 마셨어요 버튼
  const noDrinkButton = document.getElementById("no-drink-button");
  noDrinkButton.addEventListener("click", () => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 변환

    fetch("/api/v1/history/none-drink", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        date: formattedDate,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        alert("오늘 술을 안마셨군요! 축하드려요!");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("요청 전송 오류");
      });
  });

  let currentIndex = 0;
  const slides = document.querySelector(".slides");
  const dots = document.querySelectorAll(".dot");
  const totalSlides = document.querySelectorAll(".slide").length;

  const updateDots = () => {
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
  };

  setInterval(() => {
    currentIndex = (currentIndex + 1) % totalSlides;
    const offset = -currentIndex * 100;
    slides.style.transform = `translateX(${offset}%)`;
    updateDots();
  }, 2500); // 슬라이드 변경 간격을 3초로 설정
});
