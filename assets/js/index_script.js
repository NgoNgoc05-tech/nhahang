let allProducts = [];
document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:3001/products")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Lỗi HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            allProducts = data;
            renderProducts(filterProductsByCategory("Thịt và hải sản"));
            renderFeaturedProducts(data);
            updateCartCount();
        })
        
        .catch(error => console.error("Lỗi tải sản phẩm:", error));

    fetch("http://localhost:3001/customer_feedbacks")
        .then(response => response.json())
        .then(customerFeedbacks => {
            const feedbackList = document.getElementById("feedback-list");
            feedbackList.innerHTML = "";

            customerFeedbacks.forEach(feedback => {
                const feedbackHTML = `
                <div class="feedback-item">
                    <img src="${feedback.avatar}" alt="${feedback.name}" class="feedback-avatar">
                    <h5 class="feedback-name ">${feedback.name}</h5>
                    <p class="feedback-occupation fst-italic">--${feedback.occupation}--</p>
                    <p class="feedback-content">${feedback.content}</p>
                </div>
            `;
                feedbackList.innerHTML += feedbackHTML;
            });
        })
        .catch(error => console.error("Lỗi khi lấy dữ liệu khách hàng:", error));

});

document.querySelectorAll(".btn-group button").forEach(button => {
    button.addEventListener("click", function () {
        const category = this.textContent.trim();
        renderProducts(filterProductsByCategory(category));
    });
});

function renderProducts(products) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";

    products.slice(0, 3).forEach(product => {
        const productHTML = `
                <div class="col-md-4">
                    <div class="product-card">
                        <img src="${product.image}" class="product-image" alt="${product.name}">
                        <div class="product-info">
                            <h5 class="product-title">${product.name}</h5>
                            <p class="product-price">
                                <span class="current-price">${formatPrice(product.discount || product.price)}</span>
                                ${product.discount ? `<span class="original-price">${formatPrice(product.price)}</span>` : ""}
                            </p>
                            <div class="product-buttons">
                                <button class="btn-buy" data-id="${product.id}">Mua hàng</button>
                                <button class="btn-add-cart" data-id="${product.id}">Thêm vào giỏ hàng</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        productList.innerHTML += productHTML;
    });
}

function formatPrice(price) {
    return price.toLocaleString("vi-VN") + "₫";
}

function filterProductsByCategory(category) {
    return allProducts.filter(product => product.category === category);
}

function renderFeaturedProducts(products) {
    const leftContainer = document.getElementById("left-products");
    const rightContainer = document.getElementById("right-products");

    const leftProducts = products.slice(0, 3);
    leftProducts.forEach(product => {
        const productHTML = `
        <div class="left-product">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h5 class="product-title">${product.name}</h5>
                <p class="product-price">
                    <span class="current-price">${formatPrice(product.discount || product.price)}</span>
                    ${product.discount ? `<span class="original-price">${formatPrice(product.price)}</span>` : ""}
                </p>
                <p class="product-material"><strong>Chất liệu:</strong> ${product.material}</p>
                <p class="product-size"><strong>Kích thước:</strong> ${product.size}</p>
                <div class="product-buttons">
                    <button class="btn-buy" data-id="${product.id}">Mua hàng</button>
                    <button class="btn-add-cart" data-id="${product.id}">Thêm vào giỏ hàng</button>
                </div>
            </div>
        </div>
    `;
        leftContainer.innerHTML += productHTML;
    });


    const rightProducts = products.slice(3, 7);
    rightProducts.forEach(product => {
        const productHTML = `
        <div class="right-product">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h5 class="product-title">${product.name}</h5>
            <p class="product-price">
                <span class="current-price">${formatPrice(product.discount || product.price)}</span>
                ${product.discount ? `<span class="original-price">${formatPrice(product.price)}</span>` : ""}
            </p>
            <div class="product-buttons">
                <button class="btn-buy" data-id="${product.id}">Mua hàng</button>
                <button class="btn-add-cart" data-id="${product.id}">Thêm vào giỏ hàng</button>
            </div>
        </div>
    `;
        rightContainer.innerHTML += productHTML;
    });
}

if (data && data.products) {
    data.products.forEach(product => {
        if (product.name && product.image) {
            // Render dữ liệu
        }
    });
}
