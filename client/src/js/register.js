document
  .getElementById("register-form")
  .addEventListener("submit", async function (e) {
    console.log("Form submission detected!");
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const image_url = document.getElementById("image_url").value;

    const user = { name, email, password, image_url };

    try {
      const response = await fetch("http://localhost:3001/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = "login.html";
      } else {
        document.getElementById("error-message").textContent = data.message;
      }
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("error-message").textContent =
        "Registration failed. Please try again.";
    }
  });
