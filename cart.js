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

    const couponInput = document.getElementById('coupon-input');
    const applyCouponBtn = document.getElementById('apply-coupon-btn');
    const discountLine = document.getElementById('discount-line');
    const discountDisplay = document.getElementById('discount-display');

    const orderTypeInputs = document.querySelectorAll('input[name="orderType"]');
    
    const deliveryAddressContainer = document.getElementById('delivery-address-container');
    const deliveryStreetInput = document.getElementById('delivery-street');
    const deliveryCityStateInput = document.getElementById('delivery-city-state');
    
    const receiptItemsList = document.getElementById('receipt-items-list');
    const receiptSubtotal = document.getElementById('receipt-subtotal');
    const receiptTax = document.getElementById('receipt-tax');
    const receiptTip = document.getElementById('receipt-tip');
    const receiptGrandtotal = document.getElementById('receipt-grandtotal');
    const orderIdDisplay = document.getElementById('order-id');

    const receiptDiscountLine = document.getElementById('receipt-discount-line');
    const receiptDiscountDisplay = document.getElementById('receipt-discount-display');

    const receiptCustomerName = document.getElementById('receipt-customer-name');

    const TAX_RATE = 0.08; 
    let cart = JSON.parse(localStorage.getItem('restaurantCart')) || [];
    let selectedOrderType = localStorage.getItem('orderType') || 'pickup';
    let appliedCoupon = JSON.parse(localStorage.getItem('appliedCoupon'));
    const validCoupons = [
        { code: 'SAVE10', discount: 0.10, minPurchase: 20.00 },
        { code: 'FREEDELIVERY', discount: 1.00, minPurchase: 50.00 }
    ];

    function formatCurrency(amount) {
        return `$${amount.toFixed(2)}`;
    }

    function calculateTotals() {
        let subtotal = 0;
        cart.forEach(item => { subtotal += item.price * item.quantity; });

        let finalSubtotal = subtotal;
        let finalDiscountAmount = 0;

        if (appliedCoupon) {
            if (appliedCoupon.discount < 1) {
                finalDiscountAmount = finalSubtotal * appliedCoupon.discount;
                finalSubtotal = finalSubtotal - finalDiscountAmount;
            } else {
                finalDiscountAmount = appliedCoupon.discount;
                finalSubtotal = finalSubtotal - finalDiscountAmount;
                if (finalSubtotal < 0) finalSubtotal = 0;
            }
        }
        
        const taxAmount = finalSubtotal * TAX_RATE;
        
        let tipAmount = parseFloat(customTipInput.value) || 0;
        
        const grandTotal = finalSubtotal + taxAmount + tipAmount;

        subtotalDisplay.textContent = formatCurrency(subtotal);
        taxDisplay.textContent = formatCurrency(taxAmount);
        tipDisplay.textContent = formatCurrency(tipAmount);
        grandtotalDisplay.textContent = formatCurrency(grandTotal);

        if (finalDiscountAmount > 0) {
            discountLine.style.display = 'flex';
            discountDisplay.textContent = `-${formatCurrency(finalDiscountAmount)}`;
        } else {
            discountLine.style.display = 'none';
        }

        return { finalSubtotal, finalTaxAmount: taxAmount, finalTipAmount: tipAmount, finalGrandTotal: grandTotal, finalDiscountAmount, appliedCoupon };
    }

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelector('.cart-count').textContent = totalItems;
        itemCountDisplay.textContent = totalItems;
    }

    function renderCart() {
        cartList.innerHTML = '';
        if (cart.length === 0) {
            cartList.innerHTML = '<tr><td colspan="5" class="empty-cart-message">Your cart is empty.</td></tr>';
        } else {
            cart.forEach((item, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="item-name">${item.name}</td>
                    <td>${formatCurrency(item.price)}</td>
                    <td class="item-quantity">
                        <button class="qty-btn" data-action="decrease" data-index="${index}">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" data-action="increase" data-index="${index}">+</button>
                    </td>
                    <td>${formatCurrency(item.price * item.quantity)}</td>
                    <td><button class="remove-btn" data-index="${index}">Remove</button></td>
                `;
                cartList.appendChild(row);
            });
        }
        updateCartCount();
        calculateTotals();
    }

    function handleQuantityChange(event) {
        if (event.target.classList.contains('qty-btn')) {
            const action = event.target.dataset.action;
            const index = parseInt(event.target.dataset.index);

            if (action === 'increase') {
                cart[index].quantity++;
            } else if (action === 'decrease') {
                cart[index].quantity--;
                if (cart[index].quantity < 1) {
                    cart.splice(index, 1);
                }
            }
            localStorage.setItem('restaurantCart', JSON.stringify(cart));
            renderCart();
        }
    }

    if (loggedInUser && loggedInUser.name) {
            receiptCustomerName.textContent = loggedInUser.name;
        } else {
            
            receiptCustomerName.textContent = 'Guest'; 
        }

    function handleRemoveItem(event) {
        if (event.target.classList.contains('remove-btn')) {
            const index = parseInt(event.target.dataset.index);
            cart.splice(index, 1);
            localStorage.setItem('restaurantCart', JSON.stringify(cart));
            renderCart();
        }
    }

    function applyCoupon() {
        const code = couponInput.value.trim().toUpperCase();
        const couponMessage = document.getElementById('coupon-message');
        couponMessage.textContent = '';
        appliedCoupon = null;
        localStorage.removeItem('appliedCoupon');

        const coupon = validCoupons.find(c => c.code === code);
        
        if (!coupon) {
            couponMessage.textContent = 'Invalid coupon code.';
            couponMessage.style.color = 'red';
            calculateTotals();
            return;
        }

        let subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        if (subtotal < coupon.minPurchase) {
            couponMessage.textContent = `Cart total must be at least ${formatCurrency(coupon.minPurchase)} to use this coupon.`;
            couponMessage.style.color = 'orange';
            calculateTotals();
            return;
        }

        appliedCoupon = coupon;
        localStorage.setItem('appliedCoupon', JSON.stringify(appliedCoupon));
        couponMessage.textContent = `${coupon.code} applied!`;
        couponMessage.style.color = 'green';
        calculateTotals();
    }
    
    function initializeOrderType() {
        if (selectedOrderType) {
            document.querySelector(`input[value="${selectedOrderType}"]`).checked = true;
        }

        if (selectedOrderType === 'delivery') {
            deliveryAddressContainer.style.display = 'block';
        } else {
            deliveryAddressContainer.style.display = 'none';
        }

        orderTypeInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                selectedOrderType = e.target.value;
                localStorage.setItem('orderType', selectedOrderType);
                if (selectedOrderType === 'delivery') {
                    deliveryAddressContainer.style.display = 'block';
                } else {
                    deliveryAddressContainer.style.display = 'none';
                }
            });
        });
    }

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty. Please add items before checking out.');
            return;
        }

        let deliveryAddress = null;
        if (selectedOrderType === 'delivery') {
            const street = deliveryStreetInput.value.trim();
            const cityState = deliveryCityStateInput.value.trim();
            
            if (!street || !cityState) {
                alert('Please enter a valid delivery address.');
                return;
            }
            deliveryAddress = { street: street, cityState: cityState };
        }

        const { finalSubtotal, finalTaxAmount, finalTipAmount, finalGrandTotal, finalDiscountAmount, appliedCoupon } = calculateTotals();

        const orderId = Math.floor(Math.random() * 900000) + 100000;
        orderIdDisplay.textContent = orderId;
        receiptSubtotal.textContent = formatCurrency(finalSubtotal);
        receiptTax.textContent = formatCurrency(finalTaxAmount);
        receiptTip.textContent = formatCurrency(finalTipAmount);
        receiptGrandtotal.textContent = formatCurrency(finalGrandTotal);
        
        if (finalDiscountAmount > 0) {
            receiptDiscountLine.style.display = 'flex';
            receiptDiscountDisplay.textContent = `-${formatCurrency(finalDiscountAmount)}`;
        } else {
            receiptDiscountLine.style.display = 'none';
        }

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

        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        
        if (loggedInUser && loggedInUser.email) {
            const allUserOrders = JSON.parse(localStorage.getItem('allUserOrders')) || {};
            const userEmail = loggedInUser.email;
            if (!allUserOrders[userEmail]) allUserOrders[userEmail] = [];

            const newOrder = {
                id: `#${orderId}`,
                date: new Date().toLocaleString(),
                items: JSON.parse(JSON.stringify(cart)),
                subtotal: finalSubtotal,
                tax: finalTaxAmount,
                tip: finalTipAmount,
                total: finalGrandTotal,
                discount: finalDiscountAmount,
                couponCode: appliedCoupon ? appliedCoupon.code : null,
                orderType: selectedOrderType,
                deliveryAddress: deliveryAddress
            };
            
            allUserOrders[userEmail].unshift(newOrder); 
            localStorage.setItem('allUserOrders', JSON.stringify(allUserOrders));
        }

        cart = []; 
        localStorage.removeItem('restaurantCart'); 
        localStorage.removeItem('appliedCoupon');
        localStorage.removeItem('orderType'); 

        cartView.style.display = "none";
        receiptView.style.display = "block";

        document.querySelector('.cart-count').textContent = 0;
    });

    renderCart();

    initializeOrderType();

    cartList.addEventListener('click', handleQuantityChange);
    cartList.addEventListener('click', handleRemoveItem);

    document.querySelectorAll('.tip-buttons button').forEach(button => {
        button.addEventListener('click', (e) => {
            const percentage = parseFloat(e.target.dataset.tip);
            const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            let finalSubtotal = subtotal;
            if (appliedCoupon) {
                if (appliedCoupon.discount < 1) {
                    finalSubtotal = finalSubtotal * (1 - appliedCoupon.discount);
                } else {
                    finalSubtotal = finalSubtotal - appliedCoupon.discount;
                    if (finalSubtotal < 0) finalSubtotal = 0;
                }
            }
            customTipInput.value = (finalSubtotal * percentage).toFixed(2);
            calculateTotals();
        });
    });

    customTipInput.addEventListener('input', calculateTotals);
    
    applyCouponBtn.addEventListener('click', applyCoupon);
    
    calculateTotals();
});