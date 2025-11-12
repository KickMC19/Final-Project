
// Switching Categories
document.addEventListener('DOMContentLoaded', () => {
    // Select all category links and menu sections
    const categoryLinks = document.querySelectorAll('.category-link');
    const menuSections = document.querySelectorAll('.menu-section');

   
    function switchCategory(event) {
        event.preventDefault();

        categoryLinks.forEach(link => link.classList.remove('active'));
        event.currentTarget.classList.add('active');

        const targetId = event.currentTarget.dataset.target;

        menuSections.forEach(section => section.classList.add('hidden-section'));

        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.remove('hidden-section');
        }
    }

    categoryLinks.forEach(link => link.addEventListener('click', switchCategory));
});


// Adding Item to Cart
document.addEventListener('DOMContentLoaded', () => {
    
    const cartCountElement = document.querySelector('.cart-count');
    let cart = JSON.parse(localStorage.getItem('restaurantCart')) || [];

    function updateCartCount() {
        cartCountElement.textContent = cart.length;
    }
    
    updateCartCount();


    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    function addToCart(event) {
       
        const menuItem = event.target.closest('.menu-item');
        
        const itemNameElement = menuItem.querySelector('.item-details h3');
        const itemPriceElement = menuItem.querySelector('.item-price');
        
        let name = itemNameElement.textContent.replace(itemPriceElement.textContent, '').trim();
        
        let price = parseFloat(itemPriceElement.textContent.replace('$', ''));
    
        const item = {
            name: name,
            price: price,
            quantity: 1
        };

        
        cart.push(item);
        
        localStorage.setItem('restaurantCart', JSON.stringify(cart));
        
        updateCartCount();
         
        event.target.textContent = 'ADDED!';
        setTimeout(() => {
            event.target.textContent = 'ADD TO CART';
        }, 500);
    }

    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

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