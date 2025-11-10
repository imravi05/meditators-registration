document.addEventListener("DOMContentLoaded", () => {
    const meditatorList = document.getElementById("meditatorList");
    const refreshButton = document.getElementById("refreshButton");
    
    // Modal elements
    const modal = document.getElementById("editModal");
    const closeButton = document.querySelector(".close-button");
    const editForm = document.getElementById("editForm");

   // This URL must match your server's address and port
    const API_URL = 'http://localhost:3000/api/meditators';

    // === READ (Get All) ===
    const fetchMeditators = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const { data } = await response.json();
            
            meditatorList.innerHTML = ""; // Clear current list
            
            if (data.length === 0) {
                meditatorList.innerHTML = "<p>No meditators registered yet.</p>";
                return;
            }

            data.forEach(user => {
                const card = document.createElement("div");
                card.className = "user-card";
                
                // Get list of programs
                let programs = [];
                if (user.shambhavi) programs.push("Shambhavi");
                if (user.bhutta_shuddhi) programs.push("Bhutta Shuddhi");
                if (user.hatha_yoga) programs.push("Hatha Yoga");
                if (user.bhava_spandana) programs.push("Bhava Spandana");
                if (user.shoonya) programs.push("Shoonya");
                
                card.innerHTML = `
                    <h3>${user.name}</h3>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Phone:</strong> ${user.number || 'N/A'}</p>
                    <p><strong>Programs:</strong> ${programs.join(', ') || 'None'}</p>
                    <div class="card-actions">
                        <button class="edit-btn" data-id="${user.id}">Edit</button>
                        <button class="delete-btn" data-id="${user.id}">Delete</button>
                    </div>
                `;
                meditatorList.appendChild(card);
            });

        } catch (error) {
            console.error("Failed to fetch meditators:", error);
            meditatorList.innerHTML = "<p class='message error'>Failed to load data.</p>";
        }
    };

    // === DELETE ===
    const deleteMeditator = async (id) => {
        if (!confirm("Are you sure you want to delete this meditator?")) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete');
            
            alert("Meditator deleted successfully.");
            fetchMeditators(); // Refresh the list
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete meditator.");
        }
    };
    
    // === UPDATE (Part 1: Show Modal with Data) ===
    const openEditModal = async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            if (!response.ok) throw new Error('Failed to fetch user data');
            
            const { data } = await response.json();

            // Populate the form
            document.getElementById("edit-id").value = data.id;
            document.getElementById("edit-name").value = data.name;
            document.getElementById("edit-email").value = data.email;
            document.getElementById("edit-number").value = data.number;
            
            document.getElementById("edit-shambhavi").checked = data.shambhavi;
            document.getElementById("edit-bhutta_shuddhi").checked = data.bhutta_shuddhi;
            document.getElementById("edit-hatha_yoga").checked = data.hatha_yoga;
            document.getElementById("edit-bhava_spandana").checked = data.bhava_spandana;
            document.getElementById("edit-shoonya").checked = data.shoonya;

            modal.style.display = "block"; // Show the modal
        } catch (error) {
            console.error("Failed to get user data for editing:", error);
            alert("Could not load user data.");
        }
    };

    // === UPDATE (Part 2: Handle Form Submission) ===
    editForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const id = document.getElementById("edit-id").value;
        const button = document.getElementById("saveButton");
        button.disabled = true;
        button.textContent = "Saving...";

        const updatedData = {
            name: document.getElementById("edit-name").value,
            email: document.getElementById("edit-email").value,
            number: document.getElementById("edit-number").value,
            programs: {
                shambhavi: document.getElementById("edit-shambhavi").checked,
                bhutta_shuddhi: document.getElementById("edit-bhutta_shuddhi").checked,
                hatha_yoga: document.getElementById("edit-hatha_yoga").checked,
                bhava_spandana: document.getElementById("edit-bhava_spandana").checked,
                shoonya: document.getElementById("edit-shoonya").checked
            }
        };

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) throw new Error('Failed to save changes');

            alert("Changes saved successfully!");
            modal.style.display = "none";
            fetchMeditators(); // Refresh the main list

        } catch (error) {
            console.error("Update error:", error);
            alert("Failed to save changes.");
        } finally {
            button.disabled = false;
            button.textContent = "Save Changes";
        }
    });

    // --- Event Listeners ---

    // Load meditators on page load
    fetchMeditators();

    // Refresh button
    refreshButton.addEventListener("click", fetchMeditators);

    // Listen for clicks on the list (for Edit/Delete buttons)
    meditatorList.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        if (e.target.classList.contains("delete-btn")) {
            deleteMeditator(id);
        }
        if (e.target.classList.contains("edit-btn")) {
            openEditModal(id);
        }
    });

    // Modal close buttons
    closeButton.addEventListener("click", () => modal.style.display = "none");
    window.addEventListener("click", (e) => {
        if (e.target == modal) {
            modal.style.display = "none";
        }
    });
});