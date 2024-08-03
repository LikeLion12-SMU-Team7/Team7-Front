// Function to get a cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
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
        const { drinkCount, totalAlcohol } = data.result;

        // Update the drink count
        const drinkCountElements = document.querySelectorAll(".drink-count");
        drinkCountElements.forEach((element) => {
          element.textContent = `${drinkCount}회`;
        });

        // Update the total alcohol
        const totalAlcoholElements =
          document.querySelectorAll(".total-alcohol");
        totalAlcoholElements.forEach((element) => {
          element.textContent = `${totalAlcohol.toFixed(1)}g`;
        });
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
          sojuDifference,
          wineDifference,
          beerDifference,
          makgeolliDifference,
        } = data.result;

        // Update soju difference
        const sojuElements = document.querySelectorAll(".soju-difference");
        sojuElements.forEach((element) => {
          element.textContent = `${sojuDifference}병`;
        });

        // Update wine difference
        const wineElements = document.querySelectorAll(".wine-difference");
        wineElements.forEach((element) => {
          element.textContent = `${wineDifference}병`;
        });

        // Update beer difference
        const beerElements = document.querySelectorAll(".beer-difference");
        beerElements.forEach((element) => {
          element.textContent = `${beerDifference}병`;
        });

        // Update makgeolli difference
        const makgeolliElements = document.querySelectorAll(
          ".makgeolli-difference"
        );
        makgeolliElements.forEach((element) => {
          element.textContent = `${makgeolliDifference}병`;
        });
      } else {
        console.error("Failed to fetch data from the API:", data.message);
      }
    })
    .catch((error) => {
      console.error("Error fetching data from the API:", error);
    });
}

// Call the function to update the statistics
updateDrinkStatistics();
