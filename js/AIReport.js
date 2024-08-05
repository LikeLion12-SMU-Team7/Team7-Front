document.addEventListener("DOMContentLoaded", function () {
  // 쿠키에서 값을 가져오는 함수
  function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  // accessToken을 쿠키에서 가져옴
  const accessToken = getCookie("accessToken");

  // 현재 월을 가져오는 함수
  function getCurrentMonth() {
    const date = new Date();
    return date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줍니다.
  }
  function fetchUserInfo() {
    const apiUrl = "http://3.37.23.33:8080/api/v1/user";
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

  // 서버에서 보고서 상태를 가져오는 함수
  function fetchReportStatus() {
    fetch("http://3.37.23.33:8080/api/v1/gpt/", {
      method: "POST",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${accessToken}`,
      },
      body: "",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.isSuccess && data.result) {
          if (data.result.status === "new") {
            fetchUserPoints(data.result);
          } else {
            updateDOM(data.result, null);
          }
        } else {
          console.error("Error fetching report status:", data.message);
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }

  // 사용자 포인트를 가져오는 함수
  function fetchUserPoints(result) {
    const currentMonth = getCurrentMonth();
    fetch(`http://3.37.23.33:8080/api/v1/home?month=${currentMonth}`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.isSuccess && data.result) {
          const points = data.result.info.point;
          updateDOM(result, points);
          return points;
        } else {
          console.error("Error fetching user points:", data.message);
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }

  // 쿠키 설정 함수
  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }

  // DOM을 업데이트하는 함수
  function updateDOM(result, points) {
    const purchaseBtn = document.getElementById("purchaseBtn");
    const reportContent = document.getElementById("reportContent");

    if (result.status === "new") {
      purchaseBtn.style.display = "block";
      console.log(result.report);
      console.log(result.status);
      document.getElementById("p").style.opacity = 1;
      document.getElementById("frame3").style.opacity = 1;
      const purchaseStatus = getCookie("purchaseStatus");
      if (purchaseStatus !== "purchased") {
        purchaseBtn.disabled = false;
      } else {
        purchaseBtn.style.display = "none";
      }
      reportContent.innerText = result.report;
    } else if (result.status === "previous") {
      purchaseBtn.style.display = "none";
      reportContent.innerText = result.report;
      document.getElementById("p").style.opacity = 1;
      document.getElementById("frame3").style.opacity = 1;
      console.log(result.report);
      console.log(result.status);
    }
  }

  // function btnClick() {
  //   // 현재 포인트를 다시 확인
  //   fetchUserPoints({ status: "new" }).then((points) => {
  //     const purchaseBtn = document.getElementById("purchaseBtn");
  //     if (points >= 10) {
  //       // 구매 로직을 처리하고, 성공 시 쿠키를 설정
  //       setCookie("purchaseStatus", "purchased", 7);
  //       purchaseBtn.style.display = "none";
  //       alert("AI 분석 보고서를 구매했습니다.");
  //     } else {
  //       alert("포인트가 부족하여 구매할 수 없습니다.");
  //     }
  //   });
  // }

  function btnClick() {
    fetchUserPoints();
  }

  // 구매 버튼 클릭 이벤트 리스너
  document.getElementById("purchaseBtn").addEventListener("click", btnClick);

  // 페이지 로드 시 보고서 상태 가져오기
  fetchReportStatus();
  fetchUserInfo();
});
