document.addEventListener("DOMContentLoaded", function () {
    function loadComponent(selector, file) {
        return fetch(`./components/${file}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Lỗi HTTP: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                const element = document.getElementById(selector);
                if (element) {
                    element.innerHTML = data;

                   
                    requestAnimationFrame(() => {
                        updateCartCount();
                        renderUserMenu();
                        if (selector === "header-placeholder") {
                            initSearchInput(); 
                        }
                    });

                } else {
                    console.error(`Không tìm thấy phần tử có id: ${selector}`);
                }
            })
            .catch(error => console.error(`Lỗi khi tải ${file}:`, error));
    }

    Promise.all([
        loadComponent("header-placeholder", "header.html"),
        loadComponent("footer-placeholder", "footer.html")
    ]).then(() => {
        console.log("Header và Footer đã tải xong.");

        setTimeout(() => {
            initScrollMenu();
        }, 50);
    });

});


function initScrollMenu() {
    const navigationMenu = document.getElementById("navigation-menu");
    const searchBar = document.querySelector(".search-container");

    if (!navigationMenu || !searchBar) {
        console.error("Không tìm thấy navigation menu hoặc search bar");
        return;
    }

    window.addEventListener("scroll", function () {
        const searchBottom = searchBar.getBoundingClientRect().bottom;

        if (searchBottom <= 0) {
            navigationMenu.classList.add("fixed-nav");
        } else {
            navigationMenu.classList.remove("fixed-nav");
        }
    });

    console.log("Hàm scroll menu đã khởi chạy.");
}

function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById("cart-count");

    if (cartCountElement) {
        cartCountElement.innerText = cartCount;
    }
}

function renderUserMenu() {
    const userMenu = document.getElementById("user-menu");
    if (!userMenu) return;

    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
       
        const adminButton = user.role === "admin"
            ? `<li class="nav-item">
                    <a class="btn btn-primary text-white px-2 mx-2" href="admin.html">Quản lý sản phẩm</a>
               </li>`
            : "";

       
        userMenu.innerHTML = `
            ${adminButton} 
            <li class="nav-item">
                <span class="nav-link px-2">Xin chào, ${user.username}</span>
            </li>
            
            <li class="nav-item">
                <button class="btn btn-link nav-link px-2 text-danger" onclick="logout()">Đăng xuất</button>
            </li>
        `;
    } else {
        
        userMenu.innerHTML = `
            <li class="nav-item">
                <a class="nav-link px-2" href="login.html">Đăng nhập</a>
            </li>
            <li class="nav-item d-flex align-items-center">
                <span class="text-muted">|</span>
            </li>
            <li class="nav-item">
                <a class="nav-link px-2" href="register.html">Đăng ký</a>
            </li>
        `;
    }
}


function logout() {
    localStorage.removeItem("user");
    window.location.reload();
}

function initSearchInput() {
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");

    if (!searchInput || !searchResults) return;

    searchInput.addEventListener("input", async function () {
        const query = searchInput.value.trim().toLowerCase();

        if (query.length === 0) {
            searchResults.style.display = "none";
            return;
        }

        try {
            const products = await fetchProducts();
            const filteredProducts = products.filter(p =>
                p.name.toLowerCase().includes(query)
            );

            renderSearchResults(filteredProducts);
        } catch (error) {
            console.error("Lỗi tải dữ liệu sản phẩm:", error);
        }
    });

    
    document.addEventListener("click", function (event) {
        if (!searchInput.contains(event.target) && !searchResults.contains(event.target)) {
            searchResults.style.display = "none";
        }
    });
}


async function fetchProducts() {
    try {
        const response = await fetch("http://localhost:3001/products");
        return await response.json();
    } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
        return [];
    }
}


function renderSearchResults(products) {
    const searchResults = document.getElementById("searchResults");
    if (!searchResults) return;

    if (products.length === 0) {
        searchResults.innerHTML = `<div class="dropdown-item text-muted">Không tìm thấy sản phẩm</div>`;
    } else {
        searchResults.innerHTML = products.map(product => `
                <a href="product.html?id=${product.id}" class="dropdown-item">
                    <img src="${product.image}" alt="${product.name}" width="40" height="40" class="me-2">
                    ${product.name} - ${formatPrice(product.price)}
                </a>
            `).join("");
    }

    searchResults.style.display = "block";
}


