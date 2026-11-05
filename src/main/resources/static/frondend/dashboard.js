document.addEventListener("DOMContentLoaded", function() {
    loadProducts();

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
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Failed to add product');
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
});

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
                const productCard = `
<div class="col-md-4 mb-4">
<div class="card shadow-sm border-0 h-100 rounded-3">
<div class="card-body">
<h5 class="card-title text-primary fw-bold">${product.name}</h5>
<p class="card-text text-muted mb-1">Weight: ${product.weight}</p>
<p class="card-text text-danger mb-1 small">Cost: Rs. ${product.costPrice}</p>
<h6 class="text-success fw-bold mt-1">Selling: Rs. ${product.sellingPrice}</h6>
<span class="badge bg-info text-dark mt-2">Stock: ${product.stockQuantity}</span>

<div class="mt-3">
<button class="btn btn-danger btn-sm fw-bold w-100" onclick="deleteProduct(${product.id})">Delete</button>
</div>
<div class="mt-3 d-flex gap-2">
<button class="btn btn-warning btn-sm fw-bold w-50" onclick="openEditModal(${product.id}, '${product.name}', ${product.weight}, ${product.costPrice}, ${product.sellingPrice}, ${product.stockQuantity})">Edit</button>

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

// Product එක Delete කරන Function එක
function deleteProduct(id) {
    if (confirm("Are you sure you want to delete this product?")) {
        fetch(`http://localhost:8081/api/products/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    alert("Product deleted successfully!");
                    loadProducts(); // List එක Refresh කිරීම
                } else {
                    alert("Failed to delete product.");
                }
            })
            .catch(error => {
                console.error('Error deleting product:', error);
            });
    }
    // Modal එක ඕපන් කරලා පරණ Data ටික Form එකට පිරවීම
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


}
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



