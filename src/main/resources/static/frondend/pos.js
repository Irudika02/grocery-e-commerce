let cart = [];
let availableProducts = [];

document.addEventListener("DOMContentLoaded", function() {
    loadPosProducts();
    loadPosCategories();
});

// Load products for POS grid
function loadPosProducts() {
    fetch('http://localhost:8081/api/products')
        .then(response => response.json())
        .then(products => {
            availableProducts = products;
            displayPosProducts(products);
        })
        .catch(error => console.error('Error loading products:', error));
}

// Display products as clickable cards
function displayPosProducts(products) {
    const gridDiv = document.getElementById('posProductGrid');
    gridDiv.innerHTML = '';

    if (products.length === 0) {
        gridDiv.innerHTML = '<p class="text-muted text-center py-4">No products found.</p>';
        return;
    }

    products.forEach(product => {
        let stockBadge = product.stockQuantity <= 5 ? 'bg-danger' : 'bg-success';

        const card = `
<div class="col-md-4 mb-3">
<div class="card h-100 shadow-sm product-item-card border" onclick="addToCart(${product.id})">
<div class="card-body p-3">
<h6 class="card-title text-primary fw-bold mb-1">${product.name}</h6>
<p class="card-text text-muted small mb-1">Weight: ${product.weight}</p>
<div class="d-flex justify-content-between align-items-center mt-2">
<span class="fw-bold text-success">Rs. ${product.sellingPrice}</span>
<span class="badge ${stockBadge}">Stock: ${product.stockQuantity}</span>
</div>
</div>
</div>
</div>
`;
        gridDiv.innerHTML += card;
    });
}

// Load categories for filter dropdown
function loadPosCategories() {
    fetch('http://localhost:8081/api/categories')
        .then(response => response.json())
        .then(categories => {
            const select = document.getElementById('posCategoryFilter');
            select.innerHTML = '<option value="">All Categories</option>';
            categories.forEach(cat => {
                select.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
            });
        })
        .catch(error => console.error('Error loading categories:', error));
}

// Filter POS products by name and category
function filterPosProducts() {
    const search = document.getElementById('posSearchInput').value.toLowerCase();
    const categoryId = document.getElementById('posCategoryFilter').value;

    const filtered = availableProducts.filter(product => {
        const matchesName = product.name.toLowerCase().includes(search);
        const matchesCat = categoryId === "" || (product.category && product.category.id == categoryId);
        return matchesName && matchesCat;
    });

    displayPosProducts(filtered);
}

// Add item to cart
function addToCart(productId) {
    const product = availableProducts.find(p => p.id === productId);
    if (!product) return;

    if (product.stockQuantity <= 0) {
        alert("Sorry, this product is out of stock!");
        return;
    }

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        if (existingItem.quantity < product.stockQuantity) {
            existingItem.quantity++;
        } else {
            alert("Reached maximum available stock quantity!");
        }
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            sellingPrice: product.sellingPrice,
            costPrice: product.costPrice,
            quantity: 1,
            maxStock: product.stockQuantity
        });
    }

    updateCartUI();
}

// Update Cart Table and Totals
function updateCartUI() {
    const tbody = document.getElementById('cartTableBody');
    tbody.innerHTML = '';

    if (cart.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-3">No items added to bill yet.</td></tr>';
        document.getElementById('billTotalItems').innerText = '0';
        document.getElementById('billGrandTotal').innerText = 'Rs. 0.00';
        return;
    }

    let totalItems = 0;
    let grandTotal = 0;

    cart.forEach((item, index) => {
        let itemTotal = item.sellingPrice * item.quantity;
        totalItems += item.quantity;
        grandTotal += itemTotal;

        tbody.innerHTML += `
<tr>
<td>${item.name}</td>
<td>
<input type="number" class="form-control form-control-sm text-center" value="${item.quantity}" min="1" max="${item.maxStock}" onchange="updateQuantity(${index}, this.value)">
</td>
<td>Rs. ${item.sellingPrice}</td>
<td>Rs. ${itemTotal.toFixed(2)}</td>
<td>
<button class="btn btn-sm btn-outline-danger p-0 px-1" onclick="removeFromCart(${index})">❌</button>
</td>
</tr>
`;
    });

    document.getElementById('billTotalItems').innerText = totalItems;
    document.getElementById('billGrandTotal').innerText = 'Rs. ' + grandTotal.toFixed(2);
    calculateBalance();
}

// Update item quantity from input
function updateQuantity(index, val) {
    let newQty = parseInt(val);
    if (isNaN(newQty) || newQty <= 0) newQty = 1;

    if (newQty > cart[index].maxStock) {
        alert("Exceeds available stock!");
        newQty = cart[index].maxStock;
    }

    cart[index].quantity = newQty;
    updateCartUI();
}

// Remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// Clear whole cart
function clearCart() {
    cart = [];
    updateCartUI();
    document.getElementById('cashGivenInput').value = '';
    document.getElementById('balanceOutput').value = 'Rs. 0.00';
}

// Calculate Balance
function calculateBalance() {
    const grandTotalStr = document.getElementById('billGrandTotal').innerText.replace('Rs. ', '');
    const grandTotal = parseFloat(grandTotalStr) || 0;
    const cashGiven = parseFloat(document.getElementById('cashGivenInput').value) || 0;

    const balance = cashGiven - grandTotal;
    const balanceField = document.getElementById('balanceOutput');

    if (balance >= 0) {
        balanceField.value = 'Rs. ' + balance.toFixed(2);
        balanceField.classList.remove('text-danger');
        balanceField.classList.add('text-primary');
    } else {
        balanceField.value = 'Insufficient (මුදල් මදි)';
        balanceField.classList.remove('text-primary');
        balanceField.classList.add('text-danger');
    }
}

// Process Checkout & Save Order to Database
function processCheckout() {
    if (cart.length === 0) {
        alert("Cart is empty! Please add products to bill.");
        return;
    }

    let totalPrice = 0;
    let totalCost = 0;

    cart.forEach(item => {
        totalPrice += item.sellingPrice * item.quantity;
        totalCost += item.costPrice * item.quantity;
    });

    const customerName = document.getElementById('customerNameInput').value.trim() || "Walk-in Customer";

    const orderData = {
        customerName: customerName,
        totalPrice: totalPrice,
        totalCost: totalCost,
        totalProfit: totalPrice - totalCost
    };

// 1. Save Order to Backend
    fetch('http://localhost:8081/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    })
        .then(response => {
            if (!response.ok) throw new Error('Failed to complete order');
            return response.json();
        })
        .then(savedOrder => {
// 2. Reduce Stock for each item in cart
            let stockUpdatePromises = cart.map(item => {
                const product = availableProducts.find(p => p.id === item.id);
                const newStock = product.stockQuantity - item.quantity;

                const updatedProduct = {
                    name: product.name,
                    weight: product.weight,
                    costPrice: product.costPrice,
                    sellingPrice: product.sellingPrice,
                    stockQuantity: newStock,
                    category: product.category ? { id: product.category.id } : null
                };

                return fetch(`http://localhost:8081/api/products/${product.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedProduct)
                });
            });

            return Promise.all(stockUpdatePromises);
        })
        .then(() => {
            alert("Bill completed successfully! Stock updated.");
            clearCart();
            loadPosProducts(); // Refresh stock in POS view
        })
        .catch(error => {
            console.error('Checkout error:', error);
            alert("Failed to complete checkout.");
        });
}
// Print Thermal Receipt Function
function printReceiptOnly() {
    if (cart.length === 0) {
        alert("Cart is empty! Nothing to print.");
        return;
    }
    prepareReceiptData();
    window.print();
}

// Prepare Data inside Thermal Receipt Template
function prepareReceiptData() {
    const tbody = document.getElementById('recTableBody');
    tbody.innerHTML = '';

    let grandTotal = 0;
    cart.forEach(item => {
        let itemTotal = item.sellingPrice * item.quantity;
        grandTotal += itemTotal;
        tbody.innerHTML += `
<tr>
<td style="text-align: left;">${item.name}</td>
<td style="text-align: center;">${item.quantity}</td>
<td style="text-align: right;">${itemTotal.toFixed(2)}</td>
</tr>
`;
    });

    const cashGiven = parseFloat(document.getElementById('cashGivenInput').value) || 0;
    const balance = cashGiven - grandTotal;

    document.getElementById('recReceiptNo').innerText = 'Inv: #' + Math.floor(1000 + Math.random() * 9000);
    document.getElementById('recDate').innerText = 'Date: ' + new Date().toLocaleString();
    document.getElementById('recCustomer').innerText = 'Customer: ' + (document.getElementById('customerNameInput').value || 'Walk-in Customer');
    document.getElementById('recGrandTotal').innerText = 'Rs. ' + grandTotal.toFixed(2);
    document.getElementById('recCashGiven').innerText = 'Rs. ' + cashGiven.toFixed(2);
    document.getElementById('recBalance').innerText = 'Rs. ' + balance.toFixed(2);
}

// Share Bill via WhatsApp
function shareOnWhatsApp() {
    if (cart.length === 0) {
        alert("Cart is empty! No bill to share.");
        return;
    }

    let customerName = document.getElementById('customerNameInput').value || "Walk-in Customer";
    let grandTotal = 0;

    let message = `🛒 *WIJENAYAKE STORES - BILL* 🛒\n`;
    message += `👤 Customer: ${customerName}\n`;
    message += `📅 Date: ${new Date().toLocaleString()}\n`;
    message += `--------------------------------\n`;

    cart.forEach((item, index) => {
        let itemTotal = item.sellingPrice * item.quantity;
        grandTotal += itemTotal;
        message += `${index + 1}. ${item.name} x ${item.quantity} = Rs. ${itemTotal.toFixed(2)}\n`;
    });

    message += `--------------------------------\n`;
    message += `💰 *Grand Total: Rs. ${grandTotal.toFixed(2)}*\n`;
    message += `🙏 Thank you for shopping with us!\n`;

    const encodedMessage = encodeURIComponent(message);
// Opens WhatsApp Web or App with pre-filled message
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
}
