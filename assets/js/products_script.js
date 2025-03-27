document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");

    if (!category) {
        document.getElementById("product-container").innerHTML = "<p class='text-center'>Vui lòng chọn danh mục sản phẩm.</p>";
        return;
    }

    // Cập nhật tiêu đề trang
    document.getElementById("category-title").innerText = category;

    fetch("http://localhost:3001/products")
        .then(response => response.json())
        .then(products => {
            // Lọc sản phẩm theo danh mục
            const filteredProducts = products.filter(p => p.category === category);

            if (filteredProducts.length === 0) {
                document.getElementById("product-container").innerHTML = "<p class='text-center'>Không có sản phẩm nào trong danh mục này.</p>";
                return;
            }

            // Nhóm sản phẩm theo type
            const productsByType = {};
            filteredProducts.forEach(product => {
                if (!productsByType[product.type]) {
                    productsByType[product.type] = [];
                }
                productsByType[product.type].push(product);
            });

            // Hiển thị danh sách sản phẩm theo type
            let productHTML = "";
            for (const type in productsByType) {
                productHTML += `
                    <h3 class="product-type">${type}</h3>
                    <div class="row">
                `;
                productsByType[type].forEach(product => {
                    productHTML += `
                        <div class="col-md-4">
                            <div class="product-card">
                                <img src="${product.image}" class="product-image" alt="${product.name}">
                                <div class="product-info">
                                    <h5 class="product-title">${product.name}</h5>
                                    <p class="product-price">
                                        <span class="current-price">${formatPrice(product.discount || product.price)}</span>
                                        ${product.discount ? `<span class="original-price">${formatPrice(product.price)}</span>` : ""}
                                    </p>
                                    <p><strong>Chất liệu:</strong> ${product.material}</p>
                                    <div class="product-buttons">
                                        <button class="btn btn-buy-now" data-id="${product.id}">Mua hàng</button>
                                        <button class="btn btn-add-cart" data-id="${product.id}">Thêm vào giỏ hàng</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                });
                productHTML += `</div>`; // Đóng thẻ div row
            }

            document.getElementById("product-container").innerHTML = productHTML;

            // Gán sự kiện cho nút "Thêm vào giỏ hàng"
            document.querySelectorAll(".btn-add-cart").forEach(button => {
                button.addEventListener("click", function () {
                    const productId = this.getAttribute("data-id");
                    const product = filteredProducts.find(p => p.id == productId);
                    if (product) addToCart(product);
                });
            });

            // Gán sự kiện cho nút "Mua hàng"
            document.querySelectorAll(".btn-buy-now").forEach(button => {
                button.addEventListener("click", function () {
                    const productId = this.getAttribute("data-id");
                    const product = filteredProducts.find(p => p.id == productId);
                    if (product) buyNow(product);
                });
            });
        })
        .catch(error => console.error("Lỗi tải sản phẩm:", error));
});

function formatPrice(price) {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
}

