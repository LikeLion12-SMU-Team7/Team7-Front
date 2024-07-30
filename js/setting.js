document
  .getElementById("logout-link")
  .addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = "/logout";
  });

function calCount(action, element) {
  const inputField = element.parentElement.querySelector(
    'input[name="pop_out"]'
  );
  let currentValue = parseFloat(inputField.value);
  if (isNaN(currentValue)) {
    currentValue = 0;
  }
  if (action === "p") {
    currentValue += 0.5;
  } else if (action === "m" && currentValue > 0) {
    currentValue -= 0.5;
  }
  inputField.value = currentValue + "병";
}
function enableEdit() {
  document.querySelector(".fix-submit").style.display = "none";
  document.querySelector(".setting-submit").style.display = "inline-block";

  document
    .querySelectorAll("input")
    .forEach((input) => input.removeAttribute("readonly"));
  document
    .querySelectorAll('input[type="radio"]')
    .forEach((input) => (input.disabled = false));
  document
    .querySelectorAll(".plus, .minus")
    .forEach((button) => (button.disabled = false));
}

function saveChanges() {
  document.querySelector(".setting-submit").style.display = "none";
  document.querySelector(".fix-submit").style.display = "inline-block";

  document
    .querySelectorAll("input")
    .forEach((input) => input.setAttribute("readonly", "readonly"));
  document
    .querySelectorAll('input[type="radio"]')
    .forEach((input) => (input.disabled = true));
  document
    .querySelectorAll(".plus, .minus")
    .forEach((button) => (button.disabled = true));
}
