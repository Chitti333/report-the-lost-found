const itemsKey = "lostAndFoundItems";
let items = JSON.parse(localStorage.getItem(itemsKey)) || [];

function addItem() {
    const category = document.getElementById("category").value;
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const contact = document.getElementById("contact").value;
    const status = document.getElementById("status").value;
    const image = document.getElementById("image").files[0];

    if (!description || !contact || !title) {
        alert("Please fill in all the details.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const newItem = {
            id: Date.now(),
            category,
            title,
            description,
            contact,
            status,
            image: e.target.result,
        };

        items.push(newItem);
        localStorage.setItem(itemsKey, JSON.stringify(items));

        // Clear the search filters
        resetFilters();

        // Display updated items
        displayItems();

        // Reset the form fields
        document.getElementById("lostFoundForm").reset();
        showSuccessMessage("Item added successfully!");
    };

    if (image) {
        reader.readAsDataURL(image);
    } else {
        const newItem = {
            id: Date.now(),
            category,
            title,
            description,
            contact,
            status,
            image: "",
        };
        items.push(newItem);
        localStorage.setItem(itemsKey, JSON.stringify(items));
        
        // Clear the search filters
        resetFilters();
        
        // Display updated items
        displayItems();

        // Reset the form fields
        document.getElementById("lostFoundForm").reset();
        showSuccessMessage("Item added successfully!");
    }
}

function displayItems() {
    const itemsContainer = document.getElementById("items-container");
    itemsContainer.innerHTML = "";
    items.forEach((item, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "item";

        itemDiv.innerHTML = `
            <h3>${item.title}</h3>
            <p><strong>Description:</strong> ${item.description}</p>
            <p><i class="fas fa-phone-alt"></i> ${item.contact}</p>
            <p><strong>Category:</strong> ${item.category}</p>
            <p><strong>Status:</strong> ${item.status}</p>
            ${item.image ? `<img src="${item.image}" alt="Item image"/>` : ''}
            <button onclick="deleteItem(${index})">Delete</button>
        `;

        itemsContainer.appendChild(itemDiv);
    });
}

function deleteItem(index) {
    const confirmed = confirm("Are you sure you want to delete this item?");
    if (confirmed) {
        items.splice(index, 1);
        localStorage.setItem(itemsKey, JSON.stringify(items));
        displayItems();
    }
}

function filterItems() {
    const filterCategory = document.getElementById("filterCategory").value;
    const filterStatus = document.getElementById("filterStatus").value;
    const searchQuery = document.getElementById("search").value.toLowerCase();

    const filteredItems = items.filter(item => {
        const categoryMatch = filterCategory === "all" || item.category === filterCategory;
        const statusMatch = filterStatus === "all" || item.status === filterStatus;
        const titleMatch = item.title.toLowerCase().includes(searchQuery);
        return categoryMatch && statusMatch && titleMatch;
    });

    const itemsContainer = document.getElementById("items-container");
    itemsContainer.innerHTML = "";

    filteredItems.forEach((item, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "item";

        itemDiv.innerHTML = `
            <h3>${item.title}</h3>
            <p><strong>Description:</strong> ${item.description}</p>
            <p><i class="fas fa-phone-alt"></i> ${item.contact}</p>
            <p><strong>Category:</strong> ${item.category}</p>
            <p><strong>Status:</strong> ${item.status}</p>
            ${item.image ? `<img src="${item.image}" alt="Item image"/>` : ''}
            <button onclick="deleteItem(${index})">Delete</button>
        `;

        itemsContainer.appendChild(itemDiv);
    });
}

function resetFilters() {
    document.getElementById("filterCategory").value = "all";
    document.getElementById("filterStatus").value = "all";
    document.getElementById("search").value = "";
}

function showSuccessMessage(message) {
    const successMessage = document.createElement('div');
    successMessage.textContent = message;
    successMessage.classList.add('success-message');
    document.body.insertBefore(successMessage, document.body.firstChild);

    setTimeout(() => {
        successMessage.remove();
    }, 3000);
}

window.onload = () => {
    displayItems();
};
