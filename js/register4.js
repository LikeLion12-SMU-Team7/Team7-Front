document
  .getElementById("decreaseButton")
  .addEventListener("click", function () {
    var input = document.getElementById("bottleInput");
    var value = parseFloat(input.value);
    if (value > 0) {
      input.value = (value - 0.5).toFixed(1);
    }
  });

document
  .getElementById("increaseButton")
  .addEventListener("click", function () {
    var input = document.getElementById("bottleInput");
    var value = parseFloat(input.value);
    input.value = (value + 0.5).toFixed(1);
  });

document.getElementById("nextButton").addEventListener("click", function () {
  window.location.href = "registerFinal.html";
});
