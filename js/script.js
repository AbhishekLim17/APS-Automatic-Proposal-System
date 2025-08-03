document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const errorMessage = document.getElementById("error-message");

  const errorMessages = {
    empty_email: "📭 Looks like you forgot the email - we're good, but we're not mind readers!",
    invalid_email: "🤔 That email looks a bit suspicious. Maybe a typo snuck in?",
    empty_password: "🔑 Psst... you might want to add a password. Just saying!",
    short_password: "🐁 That password is shorter than a mouse's tail! Need at least 6 characters.",
    invalid_credentials: "🎭 Hmm... either this isn't you, or you're having a memory moment.",
    server_error: "🛠️ Our hamsters powering the server need a break. Try again in a moment!",
    network_error: "📡 Looks like the internet is playing hide and seek. Found any WiFi lying around?"
};

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const errorElement = document.getElementById("error-message");

    // Reset error
    errorElement.textContent = "";

    // Validation
    if (!email) {
      errorElement.textContent = errorMessages.empty_email;
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errorElement.textContent = errorMessages.invalid_email;
      return;
    }

    if (!password) {
      errorElement.textContent = errorMessages.empty_password;
      return;
    }

    if (password.length < 6) {
      errorElement.textContent = errorMessages.short_password;
      return;
    }

    try {
      // Show loading state
      const buttonText = document.querySelector(".button-text");
      const loadingSpinner = document.querySelector(".loading-spinner");
      buttonText.classList.add("hidden");
      loadingSpinner.classList.remove("hidden");

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        errorElement.textContent = error.message;
      } else {
        // Redirect on success
        window.location.href = "/dashboard.html";
      }
    } catch (error) {
      errorElement.textContent =
        error.name === "NetworkError"
          ? errorMessages.network_error
          : errorMessages.server_error;
    } finally {
      // Reset button state
      buttonText.classList.remove("hidden");
      loadingSpinner.classList.add("hidden");
    }
  });
});
