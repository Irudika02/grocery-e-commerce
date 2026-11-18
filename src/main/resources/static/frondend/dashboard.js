document.addEventListener("DOMContentLoaded", function() {
    loadProducts();
    loadCategories(); // Categories ටික Dropdown එකට load කරගැනීමට
    loadDashboardAnalytics();
    loadOrderHistory(); // Order History එක load කරගැනීමට
    loadMonthlyAnalytics();

// Handle Add Product Form
    const productForm = document.getElementById('productForm');
    productForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const productData = {
            name: document.getElementById('productName').value,
            weight: parseFloat(document.getElementById('productWeight').value),
            costPrice: parseFloat(document.getElementById('productCostPrice').value),
            sellingPrice: parseFloat(document.getElementById('productSellingPrice').value),
            stockQuantity: parseInt(document.getElementById('productStock').value),
            category: {
                id: parseInt(document.getElementById('productCategory').value)
            }
        };

        fetch('http://localhost:8081/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to add product');
                return response.json();
            })
            .then(data => {
                alert('Product added successfully!');
                productForm.reset();
                loadProducts();
                loadDashboardAnalytics();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error adding product.');
            });
    });

// Handle Edit Product Form
    document.getElementById('editProductForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const id = document.getElementById('editProductId').value;
        const updatedProduct = {
            name: document.getElementById('editProductName').value,
            weight: parseFloat(document.getElementById('editProductWeight').value),
            costPrice: parseFloat(document.getElementById('editProductCostPrice').value),
            sellingPrice: parseFloat(document.getElementById('editProductSellingPrice').value),
            stockQuantity: parseInt(document.getElementById('editProductStockQuantity').value),
            category: {
                id: parseInt(document.getElementById('editProductCategory').value)
            }
        };

        fetch(`http://localhost:8081/api/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProduct)
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to update product');
                return response.json();
            })
            .then(data => {
                alert("Product updated successfully!");
                const modalElement = document.getElementById('editProductModal');
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                modalInstance.hide();
                loadProducts();
                loadDashboardAnalytics();
            })
            .catch(error => {
                console.error('Error updating product:', error);
                alert("Failed to update product.");
            });
    });
});

// Load All Products
function loadProducts() {
    fetch('http://localhost:8081/api/products')
        .then(response => response.json())
        .then(products => {
            const productListDiv = document.getElementById('productList');
            productListDiv.innerHTML = '';

            if (products.length === 0) {
                productListDiv.innerHTML = '<p class="text-muted">No products available at the moment.</p>';
                return;
            }

            products.forEach(product => {
                let stockAlertClass = product.stockQuantity <= 5 ? 'border border-danger bg-danger bg-opacity-10' : '';
                let stockBadgeClass = product.stockQuantity <= 5 ? 'bg-danger' : 'bg-info text-dark';
                let categoryName = product.category ? product.category.name : 'Uncategorized';
                let categoryId = product.category ? product.category.id : '';

                const productCard = `
<div class="col-md-4 mb-4 product-card-item" data-category-id="${categoryId}">
<div class="card shadow-sm ${stockAlertClass} h-100 rounded-3">
<div class="card-body">
<h5 class="card-title text-primary fw-bold">${product.name}</h5>
<p class="card-text text-muted mb-1">Category: <span class="badge bg-secondary">${categoryName}</span></p>
<p class="card-text text-muted mb-1">Weight: ${product.weight}</p>
<p class="card-text text-danger mb-1 small">Cost: Rs. ${product.costPrice}</p>
<h6 class="text-success fw-bold mt-1">Selling: Rs. ${product.sellingPrice}</h6>
<span class="badge ${stockBadgeClass} mt-2">Stock: ${product.stockQuantity} ${product.stockQuantity <= 5 ? '(Low Stock!)' : ''}</span>

<div class="mt-3 d-flex gap-2">
<button class="btn btn-warning btn-sm fw-bold w-50" onclick="openEditModal(${product.id}, '${product.name}', ${product.weight}, ${product.costPrice}, ${product.sellingPrice}, ${product.stockQuantity}, ${categoryId})">Edit</button>
<button class="btn btn-danger btn-sm fw-bold w-50" onclick="deleteProduct(${product.id})">Delete</button>
</div>
<div class="mt-2">
<button class="btn btn-outline-success btn-sm w-100 fw-bold" onclick="quickAddStock(${product.id}, '${product.name}', ${product.weight}, ${product.costPrice}, ${product.sellingPrice}, ${product.stockQuantity})">➕ Quick Add Stock</button>
</div>
</div>
</div>
</div>
`;
                productListDiv.innerHTML += productCard;
            });
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
}

// Load Categories into Dropdowns
function loadCategories() {
    fetch('http://localhost:8081/api/categories')
        .then(response => response.json())
        .then(categories => {
            const categorySelect = document.getElementById('productCategory');
            const editCategorySelect = document.getElementById('editProductCategory');
            const filterCategorySelect = document.getElementById('filterCategorySelect');

            if (categorySelect && editCategorySelect && filterCategorySelect) {
                categorySelect.innerHTML = '<option value="">Select Category</option>';
                editCategorySelect.innerHTML = '<option value="">Select Category</option>';
                filterCategorySelect.innerHTML = '<option value="">All Categories (සියලුම වර්ග)</option>';

                categories.forEach(category => {
                    const option = `<option value="${category.id}">${category.name}</option>`;
                    categorySelect.innerHTML += option;
                    editCategorySelect.innerHTML += option;
                    filterCategorySelect.innerHTML += option;
                });
            }
        })
        .catch(error => console.error('Error loading categories:', error));
}

// Filter Products by Search Input & Category Dropdown
function filterProducts() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const selectedCategoryId = document.getElementById('filterCategorySelect').value;
    const productCards = document.querySelectorAll('.product-card-item');

    productCards.forEach(card => {
        const titleElement = card.querySelector('.card-title');
        const productName = titleElement ? titleElement.textContent.toLowerCase() : '';
        const cardCategoryId = card.getAttribute('data-category-id');

        const matchesSearch = productName.includes(searchInput);
        const matchesCategory = selectedCategoryId === "" || cardCategoryId === selectedCategoryId;

        if (matchesSearch && matchesCategory) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Open Edit Modal
function openEditModal(id, name, weight, costPrice, sellingPrice, stockQuantity, categoryId) {
    document.getElementById('editProductId').value = id;
    document.getElementById('editProductName').value = name;
    document.getElementById('editProductWeight').value = weight;
    document.getElementById('editProductCostPrice').value = costPrice;
    document.getElementById('editProductSellingPrice').value = sellingPrice;
    document.getElementById('editProductStockQuantity').value = stockQuantity;

    if (categoryId) {
        document.getElementById('editProductCategory').value = categoryId;
    }

    const editModal = new bootstrap.Modal(document.getElementById('editProductModal'));
    editModal.show();
}

// Delete Product
function deleteProduct(id) {
    if (confirm("Are you sure you want to delete this product?")) {
        fetch(`http://localhost:8081/api/products/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    alert("Product deleted successfully!");
                    loadProducts();
                    loadDashboardAnalytics();
                } else {
                    alert("Failed to delete product.");
                }
            })
            .catch(error => {
                console.error('Error deleting product:', error);
            });
    }
}

// Quick Stock Update Function
function quickAddStock(id, currentName, currentWeight, currentCost, currentSelling, currentStock) {
    const qtyToAdd = prompt(`Enter quantity to add to stock for "${currentName}":`, "10");
    if (qtyToAdd !== null && !isNaN(qtyToAdd) && qtyToAdd.trim() !== "") {
        const updatedStock = currentStock + parseInt(qtyToAdd);

        const updatedProduct = {
            name: currentName,
            weight: currentWeight,
            costPrice: currentCost,
            sellingPrice: currentSelling,
            stockQuantity: updatedStock
        };

        fetch(`http://localhost:8081/api/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProduct)
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to update stock');
                return response.json();
            })
            .then(data => {
                alert(`Stock updated successfully! New stock: ${updatedStock}`);
                loadProducts();
                loadDashboardAnalytics();
            })
            .catch(error => {
                console.error('Error updating stock:', error);
                alert("Failed to update stock.");
            });
    }
}

// Load Analytics Data
function loadDashboardAnalytics() {
    fetch('http://localhost:8081/api/orders')
        .then(response => response.json())
        .then(orders => {
            const totalOrders = orders.length;
            document.getElementById('totalOrdersCount').innerText = totalOrders;

            let revenue = 0;
            let profit = 0;

            orders.forEach(order => {
                revenue += order.totalPrice;
                profit += order.totalProfit;
            });

            document.getElementById('totalRevenueAmount').innerText = revenue.toFixed(2);
            document.getElementById('totalProfitAmount').innerText = profit.toFixed(2);
        })
        .catch(error => console.error('Error loading analytics:', error));
}

// Load Order History Table
function loadOrderHistory() {
    fetch('http://localhost:8081/api/orders')
        .then(response => response.json())
        .then(orders => {
            const orderTableBody = document.getElementById('orderTableBody');
            if (!orderTableBody) return;

            orderTableBody.innerHTML = '';

            if (orders.length === 0) {
                orderTableBody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No orders found.</td></tr>';
                return;
            }

            orders.forEach(order => {
                const orderRow = `
<tr>
<td>#${order.id}</td>
<td class="fw-bold text-success">Rs. ${order.totalPrice.toFixed(2)}</td>
<td class="fw-bold text-primary">Rs. ${order.totalProfit.toFixed(2)}</td>
<td><span class="badge bg-success">Completed</span></td>
</tr>
`;
                orderTableBody.innerHTML += orderRow;
            });
        })
        .catch(error => console.error('Error loading orders:', error));
}

// Load Monthly Analytics Data
function loadMonthlyAnalytics() {
    fetch('http://localhost:8081/api/orders')
        .then(response => response.json())
        .then(orders => {
            let monthlyRevenue = 0;
            let monthlyCost = 0;
            let monthlyProfit = 0;

// වර්තමාන මාසය සහ අවුරුද්ද ලබා ගැනීම (လက်ရှိ თვე/வருடம்)
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth(); // 0 - 11
            const currentYear = currentDate.getFullYear();

            orders.forEach(order => {
// order එකේ දිනය ඇතැයි ধরে ගනිමු (order.date හෝ order.createdAt වැනි field එකක් තිබේ නම්)
// දැනට සියලුම orders වර්තමාන මාසයට අදාළ යැයි සලකා හෝ date field එක පරීක්ෂා කර ගණනය කළ හැක.
// උදාහරණයක් ලෙස order එකේ date එක තිබේ නම්:
                /*
                if (order.date) {
                const orderDate = new Date(order.date);
                if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
                monthlyRevenue += order.totalPrice;
                monthlyProfit += order.totalProfit;
                monthlyCost += (order.totalPrice - order.totalProfit);
                }
                }
                */

// දැනට සියලුම ඇණවුම් එකතු කර පෙන්වීමට (Backend එකේ date field එකක් නැති නම් මෙලෙස පෙන්විය හැක):
                monthlyRevenue += order.totalPrice;
                monthlyProfit += order.totalProfit;
                monthlyCost += (order.totalPrice - order.totalProfit);
            });

            document.getElementById('monthlyRevenueAmount').innerText = 'Rs. ' + monthlyRevenue.toFixed(2);
            document.getElementById('monthlyCostAmount').innerText = 'Rs. ' + monthlyCost.toFixed(2);
            document.getElementById('monthlyProfitAmount').innerText = 'Rs. ' + monthlyProfit.toFixed(2);
        })
        .catch(error => console.error('Error loading monthly analytics:', error));
}

// Save New Category
function saveCategory() {
    const name = document.getElementById('newCategoryName').value.trim();
    if (!name) {
        alert("Please enter a category name!");
        return;
    }

    fetch('http://localhost:8081/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name })
    })
        .then(response => {
            if (!response.ok) throw new Error('Failed to save category');
            return response.json();
        })
        .then(() => {
            alert("Category added successfully!");
            document.getElementById('newCategoryName').value = '';
            loadCategories(); // Reload category dropdowns
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Failed to save category.");
        });
}




