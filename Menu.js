document.addEventListener('DOMContentLoaded', () => {
    

    const cartCountElement = document.querySelector('.cart-count');
    let cart = JSON.parse(localStorage.getItem('restaurantCart')) || [];
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }
    updateCartCount();

    
    function renderDynamicAdditions() {
        
        const menuData = JSON.parse(localStorage.getItem('menuData'));

        if (!menuData) {
            
            attachAddToCartListeners(); 
            return;
        }


        for (const catId in menuData) {
            const section = document.getElementById(catId);
            if (!section) continue;

            
            const existingNames = Array.from(section.querySelectorAll('.menu-item h3')).map(h3 => h3.textContent.trim());

            
            menuData[catId].forEach(item => {
                
                if (existingNames.includes(item.name)) return; 
                
               
                const menuItemDiv = document.createElement('div');
                menuItemDiv.classList.add('menu-item');
                menuItemDiv.innerHTML = `
                    <img src="${item.img}" alt="${item.name}" class="menu-pic">
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <span class="item-price">$${parseFloat(item.price).toFixed(2)}</span>
                        <p class="item-desc">${item.desc}</p>
                        <button class="add-to-cart-btn">ADD TO CART</button>
                    </div>
                `;
                section.appendChild(menuItemDiv);
            });
        }
       
        attachAddToCartListeners();
    }


    function attachAddToCartListeners() {
        
        const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
        addToCartButtons.forEach(button => {
            button.removeEventListener('click', addToCart); 
            button.addEventListener('click', addToCart);
        });
    }

    function addToCart(event) {
       
        const menuItem = event.target.closest('.menu-item');
        
        const itemName = menuItem.querySelector('.item-details h3').textContent;
        const itemPriceText = menuItem.querySelector('.item-price').textContent.replace('$', '');
        const itemPrice = parseFloat(itemPriceText);
        const itemImageSrc = menuItem.querySelector('.menu-pic').getAttribute('src');

        const existingItem = cart.find(item => item.name === itemName);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            const item = {
                name: itemName,
                price: itemPrice,
                quantity: 1,
                imageSrc: itemImageSrc 
            };
            cart.push(item);
        }

        localStorage.setItem('restaurantCart', JSON.stringify(cart));
        updateCartCount();

        event.target.textContent = 'ADDED!';
        setTimeout(() => event.target.textContent = 'ADD TO CART', 500);
    }

   
    
    const categoryLinks = document.querySelectorAll('.category-link');
    const menuSections = document.querySelectorAll('.menu-section');

    function switchCategory(event) {
        event.preventDefault();
        categoryLinks.forEach(link => link.classList.remove('active'));
        event.currentTarget.classList.add('active');

        const targetId = event.currentTarget.dataset.target;
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

    categoryLinks.forEach(link => link.addEventListener('click', switchCategory));

    
    
    renderDynamicAdditions(); 

    
});