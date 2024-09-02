const handleLogin = async (e) => {
  console.log("Form submission detected!");
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  console.log("Email:", email);
  console.log("Password:", password);

  try {
    const response = await fetch("http://localhost:3001/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("Data:", data);

    if (response.ok) {
      localStorage.setItem("current_user", JSON.stringify(data));

      window.location.href = "dashboard.html";
    } else {
      document.getElementById("error-message").textContent = data.message;
    }
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("error-message").textContent =
      "Login failed. Please try again.";
  }
};

document.getElementById("login-form").addEventListener("submit", handleLogin);
