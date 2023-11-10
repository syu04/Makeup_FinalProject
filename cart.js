// Function to retrieve the cart items from Local Storage
function getCartItems() {
    const cartItemsJSON = localStorage.getItem("cartItems");
    return cartItemsJSON ? JSON.parse(cartItemsJSON) : [];
}

// Function to create an HTML element for a cart item
function createCartItemElement(cartItem) {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("cart-item");

    // Display the price if it's available and defined
    const priceDisplay = cartItem.price ? `$${cartItem.price.toFixed(2)}` : '';

    cartItemElement.innerHTML = `
        <h2>${cartItem.name}</h2>
        <p>${priceDisplay}</p>
        <div class="quantity-container">
            <label for="quantity-${cartItem.id}">Quantity:</label>
            <input type="number" id="quantity-${cartItem.id}" value="${cartItem.quantity}" min="1">
        </div>
        <div class="button-container">
            <button class="update-button" data-id="${cartItem.id}">Update</button>
            <button class="delete-button" data-id="${cartItem.id}">Delete</button>
        </div>
    `;

    return cartItemElement;
}

// Function to display cart items in the cart page
function displayCartItems() {
    const cartItemsContainer = document.getElementById("cartItems");
    const cartItems = getCartItems();

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    } else {
        cartItemsContainer.innerHTML = "";

        cartItems.forEach((cartItem) => {
            const cartItemElement = createCartItemElement(cartItem);
            cartItemsContainer.appendChild(cartItemElement);
        });
    }
}

// Function to update the quantity of a cart item by itemId
function updateCartItemQuantity(itemId, newQuantity) {
    // Retrieve the existing cart items from Local Storage
    const cartItems = getCartItems();

    // Find the item with the matching itemId
    const itemIndex = cartItems.findIndex((item) => item.id === itemId);

    if (itemIndex !== -1) {
        const item = cartItems[itemIndex];

        if (newQuantity >= 1) {
            item.quantity = newQuantity;

            // Save the updated cart items back to Local Storage
            localStorage.setItem("cartItems", JSON.stringify(cartItems));

            // Re-display the cart items after updating
            displayCartItems();

            // Show a success message using an alert
            alert("Quantity updated successfully");
        } else {
            alert("Please enter a valid quantity.");
        }
    }
}

// Handle updating the quantity using event delegation
document.addEventListener("DOMContentLoaded", () => {
    displayCartItems();

    document.getElementById("cartItems").addEventListener("click", (event) => {
        if (event.target.classList.contains("delete-button")) {
            const itemId = event.target.dataset.id;
            deleteCartItem(itemId);
        } else if (event.target.classList.contains("update-button")) {
            const itemId = event.target.dataset.id;
            const inputElement = document.getElementById(`quantity-${itemId}`);
            const newQuantity = parseInt(inputElement.value, 10);
            updateCartItemQuantity(itemId, newQuantity);
        }
    });
});

function deleteCartItem(itemId) {
    // Retrieve the existing cart items from Local Storage
    const cartItems = getCartItems();

    // Find the item with the matching itemId
    const itemIndex = cartItems.findIndex((item) => item.id === itemId);

    if (itemIndex !== -1) {
        // Remove the item from the cart
        cartItems.splice(itemIndex, 1);

        // Save the updated cart items back to Local Storage
        localStorage.setItem("cartItems", JSON.stringify(cartItems));

        // Re-display the cart items after deletion
        displayCartItems();
    }
}


document.getElementById('btnCreate').addEventListener('click', () => {
    const fileName = document.getElementById('fileName').value;
    const folderName = "Files"; // Name of the folder
    const cartItems = getCartItems();

    if (!fileName || cartItems.length === 0) {
        alert('File name and cart items are required.');
        return;
    }

    // Convert the cart items to a JSON string
    const cartItemsJSON = JSON.stringify(cartItems, null, 2);

    // Create a new Blob
    const cartItemsBlob = new Blob([cartItemsJSON], { type: 'txt/json' });

    // Create a new File and specify the folder path
    const cartItemsFile = new File([cartItemsBlob], `${folderName}/${fileName}.txt`, {
        type: 'txt/json',
    });

    // Create a download link for the File
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(cartItemsFile);

    // Suggest a file location and name
    downloadLink.download = `${fileName}.txt`;

    // Trigger a click event to download the file
    downloadLink.click();
});


// Function to read and display cart items from a JSON file
function readCartFromFile(fileName) {
    // Load the JSON file based on the provided file name
    fetch(`Files/${fileName}.txt`) // Specify the folder in the URL
        .then((response) => response.text()) // Use response.text() to read as text
        .then((data) => {
            // Handle the content of the file, e.g., displaying it on the page
            const fileContent = document.getElementById('fileContent');
            fileContent.textContent = data; // Display the content on an element with the id 'fileContent'
        })
        .catch((error) => {
            alert(`Error reading the file: ${error}`);
        });
}


// Attach a click event listener to the "Read" button
document.getElementById('btnRead').addEventListener('click', () => {
    const fileName = document.getElementById('fileName').value;

    if (!fileName) {
        alert('Please enter a file name to read.');
        return;
    }

    readCartFromFile(fileName);
});
