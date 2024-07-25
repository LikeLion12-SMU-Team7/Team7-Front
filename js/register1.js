document
  .getElementById("signupForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var email = document.getElementById("email");
    var password = document.getElementById("password");
    var confirmPassword = document.getElementById("confirm-password");

    var emailValid = email.value === "test@example.com";
    var passwordValid =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password.value
      );
    var passwordsMatch = password.value === confirmPassword.value;

    if (!emailValid) {
      email.classList.add("is-invalid");
    } else {
      email.classList.remove("is-invalid");
    }

    if (!passwordValid) {
      password.classList.add("is-invalid");
    } else {
      password.classList.remove("is-invalid");
    }

    if (!passwordsMatch) {
      confirmPassword.classList.add("is-invalid");
    } else {
      confirmPassword.classList.remove("is-invalid");
    }

    if (emailValid && passwordValid && passwordsMatch) {
      alert("Form submitted successfully!");
    }
  });
