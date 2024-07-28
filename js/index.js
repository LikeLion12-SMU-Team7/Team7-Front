function validateForm(event) {
  event.preventDefault();
  const id = document.getElementById("id").value;
  const password = document.getElementById("password").value;
  const caution = document.querySelector(".caution");

  if (id.length < 4 || password.length < 4) {
    caution.style.visibility = "visible";
    return false;
  }

  caution.style.visibility = "hidden";
  // Navigate to home.html if validation passes
  window.location.href = "home.html";
  return true;
}
