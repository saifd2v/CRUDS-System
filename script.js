const title = document.getElementById("title");
const price = document.getElementById("price");
const tax = document.getElementById("tax");
const discount = document.getElementById("discount");
const total = document.getElementById("total");
const count = document.getElementById("count");
const category = document.getElementById("category");
const totalIcon = document.querySelector(".fa-hand-holding-dollar");
const requiredInputs = document.querySelectorAll(".req");
const createBtn = document.getElementById("createBtn");
let mode = "create";
let temp;

function calcPrice() {
    if (price.value !== "") {
        const result = (Number(price.value) + Number(tax.value)) - Number(discount.value);
        total.textContent = result + "$";
        total.classList.add("text-green-600");
        totalIcon.classList.add("text-green-600");
    } else {
        total.textContent = 0 + "$";
        total.classList.remove("text-green-600");
        totalIcon.classList.remove("text-green-600");
        total.classList.add("text-red-600");
        totalIcon.classList.add("text-red-600");
    }
}

// Check Products
let products;
if (localStorage.product != null) {
    products = JSON.parse(localStorage.product);
} else {
    products = [];
}

// Check Inputs
requiredInputs.forEach(input => {
    input.addEventListener("input", () => {
        if (input.value !== "") {
            input.classList.remove("required");
        }
    });
});

function checkInputs() {
    let isValid = true;
    requiredInputs.forEach(input => {
        if (input.value === "") {
            input.classList.add("required");
            isValid = false;
        } else {
            input.classList.remove("required");
        }
    });
    return isValid;
}

// Save Product
function addProduct() {
    let isValid = checkInputs();
    if (!isValid) return;

    const newProduct = {
        title: title.value,
        price: price.value,
        tax: tax.value,
        discount: discount.value,
        total: total.textContent,
        count: count.value,
        category: category.value,
    }

    if (mode === "create") {
        if (newProduct.count > 1) {
            for (let i = 0; i < newProduct.count; i++) {
                products.push(newProduct);
            }
        } else {
            products.push(newProduct);
        }
    } else {
        products[temp] = newProduct;
        createBtn.textContent = "Create";
        count.style.display = "Block";
        mode = "create";
    }

    localStorage.setItem("product", JSON.stringify(products));

    clearInputs();
    showProduct();
}

// Show Product
function showProduct() {
    const container = document.querySelector(".display-products");
    const titles = container.querySelector(".titles").outerHTML;

    let displayProducts = "";
    for (let i = 0; i < products.length; i++) {
        displayProducts += `
                        <div class="product-row">
                            <span>${i + 1}</span>
                            <span>${products[i].title}</span>
                            <span>${products[i].price}</span>
                            <span>${products[i].tax || 0}</span>
                            <span>${products[i].discount || 0}</span>
                            <span>${products[i].total}</span>
                            <span>${products[i].category}</span>
                            <button onclick="updateProduct(${i})"><i class="fa-solid fa-pen-to-square bg-green-500 p-2 rounded-[10px]"></i></button>
                            <button onclick="deleteProduct(${i})"><i class="fa-solid fa-trash-can bg-red-500 p-2 rounded-[10px]"></i></button>
                        </div>
                    `
    }
    container.innerHTML = titles + displayProducts;
}
showProduct();

// Delete Product
function deleteProduct(id) {
    products.splice(id, 1);
    localStorage.product = JSON.stringify(products);
    showProduct();
}

// Search Product
function searchProduct(value) {
    const container = document.querySelector(".display-products");
    const titles = container.querySelector(".titles").outerHTML;

    let displayProducts = "";
    for (let i = 0; i < products.length; i++) {
        if (products[i].title.toLowerCase().includes(value.toLowerCase())) {
            displayProducts += `
                        <div class="product-row">
                            <span>${i + 1}</span>
                            <span>${products[i].title}</span>
                            <span>${products[i].price}</span>
                            <span>${products[i].tax || 0}</span>
                            <span>${products[i].discount || 0}</span>
                            <span>${products[i].total}</span>
                            <span>${products[i].category}</span>
                            <button onclick="updateProduct(${i})"><i class="fa-solid fa-pen-to-square bg-green-500 p-2 rounded-[10px]"></i></button>
                            <button onclick="deleteProduct(${i})"><i class="fa-solid fa-trash-can bg-red-500 p-2 rounded-[10px]"></i></button>
                        </div>
                    `
        }
    }
    container.innerHTML = titles + displayProducts;
}

// Clear Inputs
function clearInputs() {
    title.value = "";
    price.value = "";
    tax.value = "";
    discount.value = "";
    count.value = "";
    category.value = "";
    calcPrice()
}

// Update Product
function updateProduct(i) {
    title.value = products[i].title;
    price.value = products[i].price;
    tax.value = products[i].tax;
    discount.value = products[i].discount;
    calcPrice();
    total.textContent = products[i].total;
    category.value = products[i].category;
    count.style.display = "none";
    mode = "update";
    createBtn.textContent = "Update";
    temp = i;
}