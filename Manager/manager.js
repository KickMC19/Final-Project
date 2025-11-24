const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"))
if (!loggedInUser || loggedInUser.email.toLowerCase() !== "manager@lonestar.com") {
    alert("You do not have permission to access this page.")
    window.location.href = "/Login-SignUp/login-signUp.html"
}

document.addEventListener("DOMContentLoaded", () => {
    const navLogin = document.getElementById("nav-login")
    if (navLogin) {
        if (loggedInUser) {
            navLogin.textContent = "ACCOUNT"
            navLogin.href = "/account/account.html"
        } else {
            navLogin.textContent = "LOGIN / SIGNUP"
            navLogin.href = "/Login-SignUp/login-signUp.html"
        }
    }

    const addBtn = document.getElementById('add-item-btn')
    const itemNameInput = document.getElementById('item-name')
    const itemPriceInput = document.getElementById('item-price')
    const itemDescInput = document.getElementById('item-desc')
    const itemImageInput = document.getElementById('item-image')
    const catagorySelect = document.getElementById('item-catagory')
    const menuPreview = document.getElementById('menu-preview')

    let menuItems = [];

    function renderMenu() {
        menuPreview.innerHTML = "";
        menuItems.forEach((item, index) => {
            const itemDiv = document.createElement('div')
            itemDiv.classList.add('menu-item')
            itemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="menu-pic">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <span class="item-price">$${item.price}</span>
                    <p class="item-desc">${item.desc}</p>
                </div>
                <button class="delete-btn" data-index="${index}">DELETE</button>
            `;
            menuPreview.appendChild(itemDiv)
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                const idx = e.target.dataset.index
                menuItems.splice(idx, 1)
                renderMenu()
            })
        })
    }

    addBtn.addEventListener('click', () => {
        if (!itemNameInput.value || !itemPriceInput.value || !itemDescInput.value || !itemImageInput.value) {
            alert("Please fill in all fields before adding an item.")
            return;
        }

        const newItem = {
            name: itemNameInput.value.trim(),
            price: parseFloat(itemPriceInput.value).toFixed(2),
            desc: itemDescInput.value.trim(),
            image: itemImageInput.value.trim(),
            catagory: catagorySelect.value
        };

        menuItems.push(newItem)

        itemNameInput.value = ""
        itemPriceInput.value = ""
        itemDescInput.value = ""
        itemImageInput.value = ""

        renderMenu();
    })

    renderMenu();
})