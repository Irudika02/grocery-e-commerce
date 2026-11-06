document.addEventListener("DOMContentLoaded", function() {
    loadProducts();
    loadDashboardAnalytics();

// Handle Add Product Form
    const productForm = document.getElementById('productForm');
    productForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const productData = {
            name: document.getElementById('productName').value,
            weight: parseFloat(document.getElementById('productWeight').value),
            costPrice: parseFloat(document.getElementById('productCostPrice').value),
            sellingPrice: parseFloat(document.getElementById('productSellingPrice').value),
            stockQuantity: parseInt(document.getElementById('productStock').value)
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
            stockQuantity: parseInt(document.getElementById('editProductStockQuantity').value)
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

                const productCard = `
<div class="col-md-4 mb-4">
<div class="card shadow-sm ${stockAlertClass} h-100 rounded-3">
<div class="card-body">
<h5 class="card-title text-primary fw-bold">${product.name}</h5>
<p class="card-text text-muted mb-1">Weight: ${product.weight}</p>
<p class="card-text text-danger mb-1 small">Cost: Rs. ${product.costPrice}</p>
<h6 class="text-success fw-bold mt-1">Selling: Rs. ${product.sellingPrice}</h6>
<span class="badge ${stockBadgeClass} mt-2">Stock: ${product.stockQuantity} ${product.stockQuantity <= 5 ? '(Low Stock!)' : ''}</span>

<div class="mt-3 d-flex gap-2">
<button class="btn btn-warning btn-sm fw-bold w-50" onclick="openEditModal(${product.id}, '${product.name}', ${product.weight}, ${product.costPrice}, ${product.sellingPrice}, ${product.stockQuantity})">Edit</button>
<button class="btn btn-danger btn-sm fw-bold w-50" onclick="deleteProduct(${product.id})">Delete</button>
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

// Open Edit Modal
function openEditModal(id, name, weight, costPrice, sellingPrice, stockQuantity) {
    document.getElementById('editProductId').value = id;
    document.getElementById('editProductName').value = name;
    document.getElementById('editProductWeight').value = weight;
    document.getElementById('editProductCostPrice').value = costPrice;
    document.getElementById('editProductSellingPrice').value = sellingPrice;
    document.getElementById('editProductStockQuantity').value = stockQuantity;

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
