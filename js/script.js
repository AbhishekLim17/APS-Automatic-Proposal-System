document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const errorMessage = document.getElementById("error-message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        errorMessage.textContent = error.message;
      } else {
        window.location.href = "/dashboard.html";
      }
    } catch (err) {
      errorMessage.textContent = "Login failed. Try again.";
    }
  });
});
       