document.addEventListener("DOMContentLoaded", function () {
  // Get the access token from the cookies
  function getCookie(name) {
    let cookieArr = document.cookie.split(";");
    for (let i = 0; i < cookieArr.length; i++) {
      let cookiePair = cookieArr[i].split("=");
      if (name == cookiePair[0].trim()) {
        return decodeURIComponent(cookiePair[1]);
      }
    }
    return null;
  }

  const accessToken = getCookie("accessToken");
  function fetchUserInfo() {
    const apiUrl = "/api/v1/user";
    const accessToken = getCookie("accessToken");
    console.log("accessToken:", accessToken); // 토큰 확인
    fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.isSuccess) {
          // 사용자 닉네임을 HTML 요소에 업데이트
          document.getElementById("nickname").innerText =
            data.result.nickname + "님의";
          console.log("사용자 정보:", data.result);
        } else {
          console.error("사용자 정보 요청 실패:", data.message);
        }
      })
      .catch((error) => {
        console.error("Fetch 에러:", error);
      });
  }
  // Function to fetch the recent report
  function fetchRecentReport() {
    fetch("/api/v1/report/recent", {
      method: "GET",
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.isSuccess && data.result && data.result.content) {
          document.getElementById("reportContent").innerText =
            data.result.content;
          document.getElementById("purchaseBtn").style.display = "none";
          document.getElementById("frame3").style.opacity = 1;
          document.getElementById("p").style.opacity = 1;
        } else {
          document.getElementById("purchaseBtn").style.display = "block";
        }
      })
      .catch((error) => {
        console.error("Error fetching report:", error);
      });
  }

  // Function to purchase the report
  function purchaseReport() {
    fetch("/api/v1/gpt/", {
      method: "POST",
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${accessToken}`,
      },
      body: "",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.isSuccess && data.result && data.result.report) {
          document.getElementById("reportContent").innerText =
            data.result.report;
          document.getElementById("purchaseBtn").style.display = "none";
          document.getElementById("frame3").style.opacity = 1;
          document.getElementById("p").style.opacity = 1;
        } else {
          alert("리포트 생성에 실패했습니다. 다시 시도해주세요.");
        }
      })
      .catch((error) => {
        console.error("Error purchasing report:", error);
      });
  }

  // Add event listener to purchase button
  document
    .getElementById("purchaseBtn")
    .addEventListener("click", purchaseReport);
  fetchUserInfo();

  // Fetch the recent report on page load
  fetchRecentReport();
});
