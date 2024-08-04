// Function to get a cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

// Fetch user data to get gender
function fetchUserData() {
  const accessToken = getCookie("accessToken");

  if (!accessToken) {
    console.error("Access token not found in cookies");
    return;
  }

  return fetch("http://3.37.23.33:8080/api/v1/user", {
    method: "GET",
    headers: {
      accept: "*/*",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.isSuccess && data.result) {
        return data.result;
      } else {
        console.error("Failed to fetch user data from the API:", data.message);
        return null;
      }
    })
    .catch((error) => {
      console.error("Error fetching user data from the API:", error);
      return null;
    });
}

// Fetch data from the API and update the HTML
function updateDrinkStatistics() {
  const accessToken = getCookie("accessToken");
  console.log(accessToken);

  if (!accessToken) {
    console.error("Access token not found in cookies");
    return;
  }

  fetch("http://3.37.23.33:8080/api/v1/weekly-statistics/count", {
    method: "GET",
    headers: {
      accept: "*/*",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.isSuccess && data.result) {
        const { drinkCount, drinkCountDiff, totalAlcohol, totalAlcoholDiff } =
          data.result;

        // Update the drink count
        const drinkCountElements = document.querySelectorAll(".drink-count");
        drinkCountElements.forEach((element) => {
          element.textContent = `${drinkCount}회`;
        });

        // Update the drink count difference
        const drinkCountDiffElement =
          document.querySelector(".drink-count-diff");
        if (drinkCountDiff === 0) {
          drinkCountDiffElement.textContent = "지난 주랑 비슷해요";
        } else if (drinkCountDiff > 0) {
          drinkCountDiffElement.innerHTML = `지난 주보다 <span class="text-wrapper-15">${drinkCountDiff}회</span> 더 마셨어요`;
        } else {
          drinkCountDiffElement.innerHTML = `지난 주보다 <span class="text-wrapper-17">${Math.abs(
            drinkCountDiff
          )}회</span> 덜 마셨어요`;
        }

        // Update the total alcohol
        const totalAlcoholElements =
          document.querySelectorAll(".total-alcohol");
        totalAlcoholElements.forEach((element) => {
          element.textContent = `${totalAlcohol.toFixed(1)}g`;
        });

        // Update the total alcohol difference
        const totalAlcoholDiffElement = document.querySelector(
          ".total-alcohol-diff"
        );
        if (totalAlcoholDiff === 0) {
          totalAlcoholDiffElement.textContent = "지난 주랑 비슷해요";
        } else if (totalAlcoholDiff > 0) {
          totalAlcoholDiffElement.innerHTML = `총 알콜(g) 기준, 지난 주보다 <span class="text-wrapper-15">${totalAlcoholDiff.toFixed(
            1
          )}g</span> 더 마셨어요`;
        } else {
          totalAlcoholDiffElement.innerHTML = `총 알콜(g) 기준, 지난 주보다 <span class="text-wrapper-17">${Math.abs(
            totalAlcoholDiff.toFixed(1)
          )}g</span> 덜 마셨어요`;
        }
      } else {
        console.error("Failed to fetch data from the API:", data.message);
      }
    })
    .catch((error) => {
      console.error("Error fetching data from the API:", error);
    });
}

function updateDrinkDifferences() {
  const accessToken = getCookie("accessToken");

  if (!accessToken) {
    console.error("Access token not found in cookies");
    return;
  }

  fetch("http://3.37.23.33:8080/api/v1/weekly-statistics/compared", {
    method: "GET",
    headers: {
      accept: "*/*",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.isSuccess && data.result) {
        const {
          weeklySojuCount,
          weeklyWineCount,
          weeklyBeerCount,
          weeklyMakgeolliCount,
          sojuDifference,
          wineDifference,
          beerDifference,
          makgeolliDifference,
        } = data.result;

        // Bottle volumes
        const SOJU_VOLUME = 360;
        const BEER_VOLUME = 500;
        const WINE_VOLUME = 750;
        const MAKGGEOLLI_VOLUME = 750;

        // Update soju weekly count and difference
        const sojuCountElement = document.querySelector(".soju-weekly");
        sojuCountElement.textContent = `${weeklySojuCount}병 (${(
          weeklySojuCount * SOJU_VOLUME
        ).toLocaleString()}ml)`;
        const sojuDiffElement = document.querySelector(".soju-difference");
        if (sojuDifference === 0) {
          sojuDiffElement.textContent = "지난 주랑 비슷해요";
        } else if (sojuDifference > 0) {
          sojuDiffElement.innerHTML = `지난주보다 <span class="text-wrapper-15">${sojuDifference}병</span> 만큼 더 마셨어요`;
        } else {
          sojuDiffElement.innerHTML = `지난주보다 <span class="text-wrapper-17">${Math.abs(
            sojuDifference
          )}병</span> 만큼 덜 마셨어요`;
        }

        // Update wine weekly count and difference
        const wineCountElement = document.querySelector(".wine-weekly");
        wineCountElement.textContent = `${weeklyWineCount}병 (${(
          weeklyWineCount * WINE_VOLUME
        ).toLocaleString()}ml)`;
        const wineDiffElement = document.querySelector(".wine-difference");
        if (wineDifference === 0) {
          wineDiffElement.textContent = "지난 주랑 비슷해요";
        } else if (wineDifference > 0) {
          wineDiffElement.innerHTML = `지난주보다 <span class="text-wrapper-15">${wineDifference}병</span> 만큼 더 마셨어요`;
        } else {
          wineDiffElement.innerHTML = `지난주보다 <span class="text-wrapper-17">${Math.abs(
            wineDifference
          )}병</span> 만큼 덜 마셨어요`;
        }

        // Update beer weekly count and difference
        const beerCountElement = document.querySelector(".beer-weekly");
        beerCountElement.textContent = `${weeklyBeerCount}병 (${(
          weeklyBeerCount * BEER_VOLUME
        ).toLocaleString()}ml)`;
        const beerDiffElement = document.querySelector(".beer-difference");
        if (beerDifference === 0) {
          beerDiffElement.textContent = "지난 주랑 비슷해요";
        } else if (beerDifference > 0) {
          beerDiffElement.innerHTML = `지난주보다 <span class="text-wrapper-15">${beerDifference}병</span> 만큼 더 마셨어요`;
        } else {
          beerDiffElement.innerHTML = `지난주보다 <span class="text-wrapper-17">${Math.abs(
            beerDifference
          )}병</span> 만큼 덜 마셨어요`;
        }

        // Update makgeolli weekly count and difference
        const makgeolliCountElement =
          document.querySelector(".makgeolli-weekly");
        makgeolliCountElement.textContent = `${weeklyMakgeolliCount}병 (${(
          weeklyMakgeolliCount * MAKGGEOLLI_VOLUME
        ).toLocaleString()}ml)`;
        const makgeolliDiffElement = document.querySelector(
          ".makgeolli-difference"
        );
        if (makgeolliDifference === 0) {
          makgeolliDiffElement.textContent = "지난 주랑 비슷해요";
        } else if (makgeolliDifference > 0) {
          makgeolliDiffElement.innerHTML = `지난주보다 <span class="text-wrapper-15">${makgeolliDifference}병</span> 만큼 더 마셨어요`;
        } else {
          makgeolliDiffElement.innerHTML = `지난주보다 <span class="text-wrapper-17">${Math.abs(
            makgeolliDifference
          )}병</span> 만큼 덜 마셨어요`;
        }

        // Calculate the total volume
        const totalVolume =
          weeklySojuCount * SOJU_VOLUME +
          weeklyBeerCount * BEER_VOLUME +
          weeklyWineCount * WINE_VOLUME +
          weeklyMakgeolliCount * MAKGGEOLLI_VOLUME;

        // Update the heights of the rectangles
        const sojuHeight =
          ((weeklySojuCount * SOJU_VOLUME) / totalVolume) * 100;
        const beerHeight =
          ((weeklyBeerCount * BEER_VOLUME) / totalVolume) * 100;
        const wineHeight =
          ((weeklyWineCount * WINE_VOLUME) / totalVolume) * 100;
        const makgeolliHeight =
          ((weeklyMakgeolliCount * MAKGGEOLLI_VOLUME) / totalVolume) * 100;

        document.querySelector(".rectangle-3").style.height = `${sojuHeight}px`;
        document.querySelector(".rectangle-4").style.height = `${beerHeight}px`;
        document.querySelector(".rectangle-5").style.height = `${wineHeight}px`;
        document.querySelector(
          ".rectangle-6"
        ).style.height = `${makgeolliHeight}px`;
      } else {
        console.error("Failed to fetch data from the API:", data.message);
      }
    })
    .catch((error) => {
      console.error("Error fetching data from the API:", error);
    });
}

function updateAverageDrinkAmounts() {
  const accessToken = getCookie("accessToken");

  if (!accessToken) {
    console.error("Access token not found in cookies");
    return;
  }

  fetch("http://3.37.23.33:8080/api/v1/weekly-statistics/average", {
    method: "GET",
    headers: {
      accept: "*/*",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.isSuccess && data.result) {
        const { sojuAverage, wineAverage, beerAverage, makgeolliAverage } =
          data.result;

        // Bottle volumes
        const SOJU_VOLUME = 360;
        const BEER_VOLUME = 500;
        const WINE_VOLUME = 750;
        const MAKGGEOLLI_VOLUME = 750;

        // Update soju average
        const sojuAverageElements = document.querySelectorAll(".soju-average");
        sojuAverageElements.forEach((element) => {
          element.textContent = `${sojuAverage.toFixed(1)}병 (${(
            sojuAverage * SOJU_VOLUME
          ).toLocaleString()}ml)`;
        });

        // Update wine average
        const wineAverageElements = document.querySelectorAll(".wine-average");
        wineAverageElements.forEach((element) => {
          element.textContent = `${wineAverage.toFixed(1)}병 (${(
            wineAverage * WINE_VOLUME
          ).toLocaleString()}ml)`;
        });

        // Update beer average
        const beerAverageElements = document.querySelectorAll(".beer-average");
        beerAverageElements.forEach((element) => {
          element.textContent = `${beerAverage.toFixed(1)}병 (${(
            beerAverage * BEER_VOLUME
          ).toLocaleString()}ml)`;
        });

        // Update makgeolli average
        const makgeolliAverageElements =
          document.querySelectorAll(".makgeolli-average");
        makgeolliAverageElements.forEach((element) => {
          element.textContent = `${makgeolliAverage.toFixed(1)}병 (${(
            makgeolliAverage * MAKGGEOLLI_VOLUME
          ).toLocaleString()}ml)`;
        });
      } else {
        console.error("Failed to fetch data from the API:", data.message);
      }
    })
    .catch((error) => {
      console.error("Error fetching data from the API:", error);
    });
}

function updateWeeklyDrinkFrequency() {
  const accessToken = getCookie("accessToken");

  if (!accessToken) {
    console.error("Access token not found in cookies");
    return;
  }

  fetch("http://3.37.23.33:8080/api/v1/weekly-statistics/count", {
    method: "GET",
    headers: {
      accept: "*/*",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.isSuccess && data.result) {
        const { drinkCount } = data.result;

        const messageElement = document.querySelector(".element-2");
        const drinkFrequencyElement = document.querySelector(".drink-count");
        const drinkFrequencyRectangle = document.getElementById(
          "drink-count-rectangle"
        );

        // Update the drink frequency
        drinkFrequencyElement.textContent = `${drinkCount}회`;

        // Update the message based on drink frequency
        if (drinkCount > 2) {
          messageElement.innerHTML = `적정 음주 빈도보다 일주일에 <span class="text-wrapper-15">${
            drinkCount - 2
          }회</span> 더 마셔요`;
        } else if (drinkCount < 2) {
          messageElement.innerHTML = `적정 음주 빈도보다 일주일에 <span class="text-wrapper-17">${
            2 - drinkCount
          }회</span> 덜 마셔요`;
        } else {
          messageElement.textContent = "적정 음주 빈도예요";
        }

        // Update the height of the rectangle
        let height = drinkCount * 25;
        if (height > 100) {
          height = 100;
        }
        drinkFrequencyRectangle.style.height = `${height}px`;
      } else {
        console.error("Failed to fetch data from the API:", data.message);
      }
    })
    .catch((error) => {
      console.error("Error fetching data from the API:", error);
    });
}

function updateGenderBasedStats() {
  const accessToken = getCookie("accessToken");

  if (!accessToken) {
    console.error("Access token not found in cookies");
    return;
  }

  fetchUserData().then((userData) => {
    if (!userData) return;

    const { gender } = userData;

    const MALE_FREQUENCY = 5;
    const FEMALE_FREQUENCY = 3;
    const MALE_AMOUNT = 15;
    const FEMALE_AMOUNT = 10;

    const recommendedFrequency =
      gender === "MALE" ? MALE_FREQUENCY : FEMALE_FREQUENCY;
    const recommendedAmount = gender === "MALE" ? MALE_AMOUNT : FEMALE_AMOUNT;

    fetch("http://3.37.23.33:8080/api/v1/weekly-statistics/count", {
      method: "GET",
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.isSuccess && data.result) {
          const { drinkCount } = data.result;

          const frequencyMessageElement = document.querySelector(
            ".frequency-comparison"
          );
          if (drinkCount > recommendedFrequency) {
            frequencyMessageElement.innerHTML = `성별 적정 음주 빈도보다 일주일에 <span class="text-wrapper-15">${
              drinkCount - recommendedFrequency
            }회</span> 더 마셔요`;
          } else if (drinkCount < recommendedFrequency) {
            frequencyMessageElement.innerHTML = `성별 적정 음주 빈도보다 일주일에 <span class="text-wrapper-17">${
              recommendedFrequency - drinkCount
            }회</span> 덜 마셔요`;
          } else {
            frequencyMessageElement.textContent = "성별 적정 음주 빈도입니다.";
          }

          // Update the height of the rectangle
          let height = drinkCount * 25;
          if (height > 100) {
            height = 100;
          }
          document.querySelector(
            ".drink-frequency-rectangle"
          ).style.height = `${height}px`;
        } else {
          console.error("Failed to fetch data from the API:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching data from the API:", error);
      });

    fetch("http://3.37.23.33:8080/api/v1/weekly-statistics/average", {
      method: "GET",
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.isSuccess && data.result) {
          const { sojuAverage, wineAverage, beerAverage, makgeolliAverage } =
            data.result;

          const totalAverageAmount =
            sojuAverage + wineAverage + beerAverage + makgeolliAverage;
          const averageAmountDifference =
            totalAverageAmount - recommendedAmount;

          const amountMessageElement =
            document.querySelector(".amount-comparison");
          if (averageAmountDifference > 0) {
            amountMessageElement.innerHTML = `성별 적정 음주량보다 일주일에 <span class="text-wrapper-15">${averageAmountDifference.toFixed(
              1
            )}잔</span> 더 마셔요 (${(
              averageAmountDifference * 50
            ).toLocaleString()}ml)`;
          } else if (averageAmountDifference < 0) {
            amountMessageElement.innerHTML = `성별 적정 음주량보다 일주일에 <span class="text-wrapper-17">${Math.abs(
              averageAmountDifference.toFixed(1)
            )}잔</span> 덜 마셔요 (${(
              Math.abs(averageAmountDifference) * 50
            ).toLocaleString()}ml)`;
          } else {
            amountMessageElement.textContent = "성별 적정 음주량입니다.";
          }

          // Update the height of the rectangles based on average amounts
          const sojuHeight = (sojuAverage / totalAverageAmount) * 100;
          const beerHeight = (beerAverage / totalAverageAmount) * 100;
          const wineHeight = (wineAverage / totalAverageAmount) * 100;
          const makgeolliHeight = (makgeolliAverage / totalAverageAmount) * 100;

          document.querySelector(
            ".rectangle-3"
          ).style.height = `${sojuHeight}px`;
          document.querySelector(
            ".rectangle-4"
          ).style.height = `${beerHeight}px`;
          document.querySelector(
            ".rectangle-5"
          ).style.height = `${wineHeight}px`;
          document.querySelector(
            ".rectangle-6"
          ).style.height = `${makgeolliHeight}px`;
        } else {
          console.error("Failed to fetch data from the API:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching data from the API:", error);
      });
  });
}

// Call the functions to update the statistics
updateDrinkStatistics();
updateDrinkDifferences();
updateAverageDrinkAmounts();
updateWeeklyDrinkFrequency();
updateGenderBasedStats();
