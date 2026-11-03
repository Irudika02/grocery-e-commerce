document.addEventListener("DOMContentLoaded", function() {
    loadProducts();
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
                product.price = undefined;
                const productCard = `
<div class="col-md-4 mb-4">
<div class="card shadow-sm border-0 h-100 rounded-3">
<div class="card-body">
<h5 class="card-title text-primary fw-bold">${product.name}</h5>
<p class="card-text text-muted mb-1">Weight: ${product.weight}</p>
<h6 class="text-success fw-bold mt-2">Rs. ${product.price}</h6>
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
