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

