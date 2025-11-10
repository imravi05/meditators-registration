document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registrationForm");
    const messageDiv = document.getElementById("message");
    const submitButton = document.getElementById("submitButton");

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Stop the form from submitting the traditional way
        
        // Show loading state
        submitButton.disabled = true;
        submitButton.textContent = "Registering...";
        messageDiv.className = "message"; // Reset message classes
        messageDiv.textContent = "";

        // 1. Get user details
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const number = document.getElementById("number").value;

        // 2. Get selected programs
        const programs = {
            shambhavi: document.getElementById("shambhavi").checked,
            bhutta_shuddhi: document.getElementById("bhutta_shuddhi").checked,
            hatha_yoga: document.getElementById("hatha_yoga").checked,
            bhava_spandana: document.getElementById("bhava_spandana").checked,
            shoonya: document.getElementById("shoonya").checked
        };

        // 3. Construct the data payload
        const formData = {
            name,
            email,
            number,
            programs
        };

        try {
            // 4. Send data to the backend API endpoint
            // This MUST match the route in meditatorRoutes.js
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) { // Status code 200-299
                messageDiv.className = "message success";
                messageDiv.textContent = result.message || "Registration successful!";
                form.reset(); // Clear the form
            } else {
                // Handle server-side errors (e.g., email already exists)
                messageDiv.className = "message error";
                messageDiv.textContent = result.error || "An unknown error occurred.";
            }

        } catch (error) {
            // Handle network errors
            console.error("Fetch error:", error);
            messageDiv.className = "message error";
            messageDiv.textContent = "Could not connect to the server. Please try again later.";
        } finally {
            // Re-enable the button
            submitButton.disabled = false;
            submitButton.textContent = "Register";
        }
    });
});