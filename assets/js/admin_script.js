const API_URL = "http://localhost:3001/products";
const productForm = document.getElementById("productForm");
const productList = document.getElementById("productList");

// 1️⃣ Lấy danh sách sản phẩm
async function fetchProducts() {
    const res = await fetch(API_URL);
    const products = await res.json();
    renderProducts(products);
}

// 2️⃣ Hiển thị sản phẩm lên bảng
function renderProducts(products) {
    productList.innerHTML = "";
    products.forEach((product) => {
        productList.innerHTML += `
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.price.toLocaleString()}đ</td>
                <td>${product.discount.toLocaleString()}đ</td>
                <td><img src="${product.image}" width="50"></td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editProduct(${product.id})">Sửa</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">Xóa</button>
                </td>
            </tr>
        `;
    });
}

// 3️⃣ Thêm hoặc cập nhật sản phẩm
productForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("productId").value;
    const productData = {
        name: document.getElementById("name").value,
        price: +document.getElementById("price").value,
        discount: +document.getElementById("discount").value || 0,
        category: document.getElementById("category").value,
        type: document.getElementById("type").value,
        material: document.getElementById("material").value,
        image: document.getElementById("image").value,
        size: document.getElementById("size").value,
    };

    if (id) {
        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productData),
        });
    } else {
        const res = await fetch(API_URL);
        const products = await res.json();

        const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;
        productData.id = (maxId + 1).toString();

        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productData),
        });
    }

    productForm.reset();
    fetchProducts();
});

// 4️⃣ Sửa sản phẩm
async function editProduct(id) {
    const res = await fetch(`${API_URL}/${id}`);
    const product = await res.json();

    document.getElementById("productId").value = product.id;
    document.getElementById("name").value = product.name;
    document.getElementById("price").value = product.price;
    document.getElementById("discount").value = product.discount;
    document.getElementById("category").value = product.category;
    document.getElementById("type").value = product.type;
    document.getElementById("material").value = product.material;
    document.getElementById("image").value = product.image;
    document.getElementById("size").value = product.size;
}

// 5️⃣ Xóa sản phẩm
async function deleteProduct(id) {
    if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        fetchProducts();
    }
}

// Gọi hàm để load sản phẩm khi trang tải
fetchProducts();
