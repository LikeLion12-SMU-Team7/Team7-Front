// vector 클래스를 클릭하면 register1.html로 이동
document.querySelector('.vector').addEventListener('click', function() {
  window.location.href = 'register3.html';
});

document
  .getElementById("decreaseButton")
  .addEventListener("click", function () {
    var input = document.getElementById("sojuAmount");
    var value = parseFloat(input.value);
    if (value > 0) {
      input.value = (value - 0.5).toFixed(1);
    }
  });

document
  .getElementById("increaseButton")
  .addEventListener("click", function () {
    var input = document.getElementById("sojuAmount");
    var value = parseFloat(input.value);
    input.value = (value + 0.5).toFixed(1);
  });

document.getElementById("nextButton").addEventListener("click", function () {
  const sojuAmount = document.getElementById("sojuAmount").value;
  localStorage.setItem("sojuAmount", sojuAmount);
  console.log("sojuAmount:", localStorage.getItem("sojuAmount"));
  window.location.href = "registerFinal.html";
});
