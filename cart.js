document.addEventListener('DOMContentLoaded', () => {
    
    
    const cartView = document.getElementById('cart-view');
    const receiptView = document.getElementById('receipt-view');
    const cartList = document.getElementById('cart-item-list');
    const subtotalDisplay = document.getElementById('subtotal-display');
    const taxDisplay = document.getElementById('tax-display');
    const tipDisplay = document.getElementById('tip-display');
    const grandtotalDisplay = document.getElementById('grandtotal-display');
    const itemCountDisplay = document.getElementById('item-count-display');
    const customTipInput = document.getElementById('custom-tip-input');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const receiptItemsList = document.getElementById('receipt-items-list');
    const receiptSubtotal = document.getElementById('receipt-subtotal');
    const receiptTax = document.getElementById('receipt-tax');
    const receiptTip = document.getElementById('receipt-tip');
    const receiptGrandtotal = document.getElementById('receipt-grandtotal');
    const orderIdDisplay = document.getElementById('order-id');

    const TAX_RATE = 0.08; 
    let cart = JSON.parse(localStorage.getItem('restaurantCart')) || [];


    
    function formatCurrency(amount) {
        return `$${amount.toFixed(2)}`;
    }

    function calculateTotals() {
        let subtotal = 0;
        cart.forEach(item => { subtotal += item.price * item.quantity; });

        const tipAmount = parseFloat(customTipInput.value) || 0;
        const taxAmount = subtotal * TAX_RATE;
        let grandTotal = subtotal + taxAmount + tipAmount;

        subtotalDisplay.textContent = formatCurrency(subtotal);
        taxDisplay.textContent = formatCurrency(taxAmount);
        tipDisplay.textContent = formatCurrency(tipAmount);
        grandtotalDisplay.textContent = formatCurrency(grandTotal);

        return { subtotal, taxAmount, tipAmount, grandTotal };
    }
    
    function saveCart() {
        localStorage.setItem('restaurantCart', JSON.stringify(cart));
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
             cartCountElement.textContent = totalItems;
        }
    }

    // RENDER FUNCTION 
    function renderCart() {
        cartList.innerHTML = ''; 
        
        if (cart.length === 0) {
            cartList.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 50px;">Your cart is empty! <a href="Menu.html">Go to the menu</a>.</td></tr>';
            itemCountDisplay.textContent = 0;
            saveCart();
            return;
        }

        cart.forEach((item, index) => {
            const row = document.createElement('tr');
            const itemTotal = item.price * item.quantity;

            row.innerHTML = `
                <td class="item-details-cell">
                    <div class="item-info">
                        <img src="${item.imageSrc || 'images/placeholder.jpg'}" alt="${item.name}" class="item-image"> 
                        <div class="item-text">
                            <p class="item-name">${item.name}</p>
                            <p class="item-options">Qty: ${item.quantity}</p> 
                        </div>
                    </div>
                </td>
                <td class="item-price-cell">${formatCurrency(item.price)}</td>
                <td class="item-quantity-cell">
                    <div class="quantity-controls">
                        <button class="quantity-btn decrease" data-index="${index}">-</button>
                        <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-index="${index}" readonly>
                        <button class="quantity-btn increase" data-index="${index}">+</button>
                    </div>
                </td>
                <td class="item-total-cell">${formatCurrency(itemTotal)} 
                    <span class="remove-item" data-index="${index}">×</span>
                </td>
            `;
            cartList.appendChild(row);
        });
        
        const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        itemCountDisplay.textContent = totalItemsCount;
        
        calculateTotals();
        saveCart(); 
    }

    function handleQuantityChange(event) {
        const target = event.target;
        
        if (target.classList.contains('quantity-btn')) {
            const index = parseInt(target.getAttribute('data-index'));

            if (target.classList.contains('increase')) {
                cart[index].quantity++;
            } else if (target.classList.contains('decrease') && cart[index].quantity > 1) {
                cart[index].quantity--;
            }
        } 
        else if (target.classList.contains('quantity-input')) {
            const index = parseInt(target.getAttribute('data-index'));
            const newQuantity = parseInt(target.value);
            if (!isNaN(newQuantity) && newQuantity >= 1) {
                 cart[index].quantity = newQuantity;
            }
        }
        renderCart();
    }
    
    function handleRemoveItem(event) {
        if (event.target.classList.contains('remove-item')) {
            const index = parseInt(event.target.getAttribute('data-index'));
            cart.splice(index, 1); 
            renderCart(); 
        }
    }


    
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert("Your cart is empty. Please add items before checking out.");
            return;
        }

       
        const { subtotal, taxAmount, tipAmount, grandTotal } = calculateTotals();
        
        
        const orderId = Math.floor(Math.random() * 900000) + 100000;
        orderIdDisplay.textContent = orderId;
        receiptSubtotal.textContent = formatCurrency(subtotal);
        receiptTax.textContent = formatCurrency(taxAmount);
        receiptTip.textContent = formatCurrency(tipAmount);
        receiptGrandtotal.textContent = formatCurrency(grandTotal);

        
        receiptItemsList.innerHTML = '';
        cart.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('receipt-item-line');
            
            itemDiv.innerHTML = `
                <span class="item-name-qty">${item.quantity}x ${item.name}</span>
                <span class="item-price-total">${formatCurrency(item.price * item.quantity)}</span>
            `;
            receiptItemsList.appendChild(itemDiv);
        });

        //Sending past orders to account
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        
        if (loggedInUser && loggedInUser.email) {
            
            const allUserOrders = JSON.parse(localStorage.getItem('allUserOrders')) || {};
            const userEmail = loggedInUser.email;
            
            if (!allUserOrders[userEmail]) {
                allUserOrders[userEmail] = [];
            }

            const newOrder = {
                id: `#${orderId}`,
                date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                items: JSON.parse(JSON.stringify(cart)), // Use cart BEFORE clearing
                subtotal: subtotal,
                tax: taxAmount,
                tip: tipAmount,
                total: grandTotal
            };
            
            allUserOrders[userEmail].unshift(newOrder); 
            localStorage.setItem('allUserOrders', JSON.stringify(allUserOrders));
        }
        

        
        cart = []; // Now safe to clear cart after saving order
        localStorage.removeItem('restaurantCart'); 
        
        
        cartView.style.display = "none";
        receiptView.style.display = "block";
        
       
        document.querySelector('.cart-count').textContent = 0;
    });

    
   
    
    renderCart();

    
    cartList.addEventListener('click', handleQuantityChange);
    cartList.addEventListener('click', handleRemoveItem);
    customTipInput.addEventListener('input', calculateTotals);
    
    calculateTotals();
});