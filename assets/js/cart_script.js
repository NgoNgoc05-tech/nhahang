// Hàm thêm sản phẩm vào giỏ hàng
function addToCart(product) {
    if (!product) return;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

function buyNow(product) {
    if (!product) return;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.href = "cart.html";
}


// Gọi hàm cập nhật giỏ hàng khi trang được tải
document.addEventListener("DOMContentLoaded", function () {
    updateCartCount();

    document.querySelectorAll(".btn-add-cart").forEach(button => {
        button.addEventListener("click", function () {
            const productId = parseInt(this.getAttribute("data-id"));

            fetch(`http://localhost:3001/products/${productId}`)
                .then(response => response.json())
                .then(product => addToCart(product))
                .catch(error => console.error("Lỗi khi lấy sản phẩm:", error));
        });
    });
});

document.addEventListener("click", function (event) {
    if (event.target.classList.contains("btn-add-cart")) {
        const productId = event.target.getAttribute("data-id");
        const selectedProduct = allProducts.find(p => p.id.toString() === productId);
        if (selectedProduct) {
            addToCart(selectedProduct);
        }
    }
});

document.addEventListener("click", function (event) {
    if (event.target.classList.contains("btn-buy")) {
        const productId = event.target.getAttribute("data-id");
        const selectedProduct = allProducts.find(p => p.id.toString() === productId);
        if (selectedProduct) {
            buyNow(selectedProduct);
        }
    }
});


document.addEventListener("DOMContentLoaded", function () {
    renderCart();
});

// Hàm hiển thị giỏ hàng
function renderCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartBody = document.getElementById("cart-body");
    let totalPrice = 0;

    if (cart.length === 0) {
        cartBody.innerHTML = `<tr><td colspan="5" class="text-center">Giỏ hàng trống</td></tr>`;
        document.getElementById("total-price").innerText = "0đ";
        return;
    }

    let cartHTML = cart.map(product => {
        let productTotal = (product.discount || product.price) * product.quantity;
        totalPrice += productTotal;

        return `
            <tr>
                <td>${product.name}</td>
                <td>${formatPrice(product.discount || product.price)}</td>
                <td>
                    <button class="btn btn-sm btn-outline-danger" onclick="updateQuantity(${product.id}, -1)">-</button>
                    <span class="mx-2">${product.quantity}</span>
                    <button class="btn btn-sm btn-outline-success" onclick="updateQuantity(${product.id}, 1)">+</button>
                </td>
                <td>${formatPrice(productTotal)}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="removeFromCart(${product.id})">Xóa</button>
                </td>
            </tr>
        `;
    }).join("");

    cartBody.innerHTML = cartHTML;
    document.getElementById("total-price").innerText = formatPrice(totalPrice);
}

// Hàm cập nhật số lượng sản phẩm
function updateQuantity(productId, change) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    productId = productId.toString();
    let product = cart.find(item => item.id === productId);
    if (product) {
        product.quantity += change;
        if (product.quantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
        }
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateCartCount()
}

// Hàm xóa sản phẩm khỏi giỏ hàng
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    productId = productId.toString();
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateCartCount()
}

function formatPrice(price) {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
}

