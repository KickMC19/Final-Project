document.addEventListener('DOMContentLoaded', () => {
    // --- PART 1: Cart Initialization & Count Update (UNCHANGED) ---
    
    const cartCountElement = document.querySelector('.cart-count');
    let cart = JSON.parse(localStorage.getItem('restaurantCart')) || []; 

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }

    updateCartCount();


    // --- PART 2: Add to Cart Logic (UPDATED) ---

    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    function addToCart(event) {
        const menuItem = event.target.closest('.menu-item');
        
        // Find item details
        const nameElement = menuItem.querySelector('.item-details h3');
        const priceElement = menuItem.querySelector('.item-price');
        const imageElement = menuItem.querySelector('.menu-pic'); // <--- NEW: Select the image

        // 1. Get Name
        let name = nameElement.textContent.replace(priceElement.textContent, '').trim();
        
        // 2. Get Price
        let price = parseFloat(priceElement.textContent.replace('$', ''));
        
        // 3. Get Image Source
        let imageSrc = imageElement ? imageElement.getAttribute('src') : 'images/placeholder.jpg'; // <--- NEW: Get the src path
        
        // 4. CHECK FOR DUPLICATES
        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity += 1; 
        } else {
            // Add new item to the cart array, including imageSrc
            cart.push({
                name: name,
                price: price,
                quantity: 1,
                imageSrc: imageSrc // <--- NEW: Save the image source
            });
        }
        
        localStorage.setItem('restaurantCart', JSON.stringify(cart));
        
        updateCartCount();
        
        // Visual feedback
        event.target.textContent = 'ADDED!';
        setTimeout(() => {
            event.target.textContent = 'ADD TO CART';
        }, 500);
    }

    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });


    // --- PART 3: Category Switching Logic (UNCHANGED) ---

    const categoryLinks = document.querySelectorAll('.category-link');
    const menuSections = document.querySelectorAll('.menu-section');

    function switchCategory(event) {
        event.preventDefault();

        categoryLinks.forEach(link => {
            link.classList.remove('active');
        });
        event.currentTarget.classList.add('active');

        const targetId = event.currentTarget.getAttribute('data-target');
        
        menuSections.forEach(section => {
            section.classList.add('hidden-section');
            section.classList.remove('active-section'); 
        });
        
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.remove('hidden-section');
            targetSection.classList.add('active-section');
        }
    }

    categoryLinks.forEach(link => {
        link.addEventListener('click', switchCategory);
    });
});