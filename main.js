// Function to get makeup products based on brand and categories
async function getMakeupProducts(brand, categories) {
    try {
        let apiUrl = `https://makeup-api.herokuapp.com/api/v1/products.json?brand=${brand}`;

        if (categories.includes("All")) {
            // If "All" is selected, don't specify a product_type in the API request
        } else {
            apiUrl += `&product_type=${categories.join(",")}`;
        }

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.length > 0) {
            const makeupDetailsContainer = document.getElementById("makeupDetailsContainer");
            makeupDetailsContainer.innerHTML = "";
            makeupDetailsContainer.style.display = "flex";
            makeupDetailsContainer.classList.remove("hidden");

            for (const product of data) {
                let div = document.createElement("div");
                div.classList.add("makeup-details");

                if (product.image_link) {
                    let img = document.createElement("img");
                    img.setAttribute("src", product.image_link);
                    img.setAttribute("loading", "lazy");
                    div.appendChild(img);
                }

                let productName = document.createElement("h2");
                productName.textContent = product.name;

                let productBrand = document.createElement("h4");
                productBrand.textContent = "Brand: " + product.brand;

                let productPrice = document.createElement("div");
                productPrice.textContent = "Price: $" + product.price;

                let productDescription = document.createElement("h5");
                productDescription.textContent = "Description: " + product.description;

                let productProductType = document.createElement("h3");
                productProductType.textContent = "Type: " + product.product_type;

                // Create the "Add Cart" button
                const addToCartButton = document.createElement("button");
                addToCartButton.textContent = "Add Cart";
                addToCartButton.classList.add("add-to-cart-button");
                addToCartButton.dataset.product = product.name;
                addToCartButton.dataset.price = product.price; // Include the price from the API

                // Add a click event listener to the "Add to Cart" button
                addToCartButton.addEventListener("click", (event) => {
                    const product = event.target.dataset.product;
                    const price = parseFloat(event.target.dataset.price);

                    // Call the modified addProductToCart function with both product and price
                    addProductToCart(product, price);
                });

                div.appendChild(productName);
                div.appendChild(productBrand);
                div.appendChild(productPrice);
                div.appendChild(productDescription);
                div.appendChild(productProductType);
                div.appendChild(addToCartButton);
                makeupDetailsContainer.appendChild(div);
            }
        } else {
            console.log("No products found for the selected brand and category.");
        }
    } catch (err) {
        console.error(err);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("searchForm");
    const makeupDetailsContainer = document.getElementById("makeupDetailsContainer");

    searchForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const searchDataInput = document.getElementById("makeup-brand-dropdown");
        const searchValue = searchDataInput.value;

        const categoryCheckboxes = document.querySelectorAll('input[name="category"]:checked');
        const categories = [...categoryCheckboxes].map((checkbox) => checkbox.value);

        if (searchValue !== "") {
            await getMakeupProducts(searchValue, categories);
        } else {
            console.log("You must select a makeup brand.");
        }
    });

    makeupDetailsContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("add-to-cart-button")) {
            const product = event.target.dataset.product;
            console.log("Adding product to cart: " + product); // Debug
            addProductToCart(product);
        }
    });
});

// Function to add a product to the cart
function addProductToCart(product, price) {
    // Retrieve the existing cart items from Local Storage
    const cartItems = getCartItems();

    // Check if the product is already in the cart
    const existingCartItem = cartItems.find((item) => item.name === product);

    if (existingCartItem) {
        // If the product is already in the cart, increment its quantity by 1
        existingCartItem.quantity += 1;
    } else {
        // If it's not in the cart, add it as a new item with quantity 1
        cartItems.push({ name: product, price: price, quantity: 1, id: generateItemId() });
    }

    // Save the updated cart items back to Local Storage
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    // Show an alert to notify the user
    alert(`${product} has been added to the cart.`);
}


// Function to generate a unique item ID
function generateItemId() {
    // Implement your logic to generate a unique ID
    return Math.random().toString(36).substr(2, 9);
}

// Function to retrieve the cart items from Local Storage
function getCartItems() {
    const cartItemsJSON = localStorage.getItem("cartItems");
    return cartItemsJSON ? JSON.parse(cartItemsJSON) : [];
}

