document.addEventListener("DOMContentLoaded", () => {
const navLogin = document.getElementById("nav-login");
if (navLogin) {
    const loggedIn = localStorage.getItem("loggedInUser") !== null;
    if (loggedIn) {
        navLogin.textContent = "ACCOUNT";
        navLogin.href = "/account/account.html";
    } else {
        navLogin.textContent = "LOGIN / SIGNUP";
        navLogin.href = "/Login-SignUp/login-signUp.html";
    }
}

    const form = document.getElementById("add-item-form");
    const preview = document.getElementById("manager-menu-preview")

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById(`item-name`).value;
        const price = document.getElementById(`item-price`).value;
        const image = document.getElementById(`item-img`).value;
        const description = document.getElementById(`item-desc`).value;

        const item = document.createElement(`div`);
        item.classList.add(`menu-item`)

        item.innerHTML = `
            <img src="${img}" class="menu-pic">
            <div class="item-details">
                <h3>${name}</h3>
                <span class="item-price">${price}</span>
                <p class="item-desc">${desc}</p>
            </div>
            <button class="delete-item">DELETE</button>
        `;

        preview.appendChild(item)

        item.querySelector(".delete-item").addEventListener(`click`, () => {
            item.remove()
        })
        form.reset()
    })
})

const addBtn = document.getElementById('add-item-btn')
const itemNameInput = document.getElementById('item-name')
const itemPriceInput = document.getElementById('item-price')
const itemDescInput = document.getElementById('item-desc')
const itemImageInput = document.getElementById('item-image')
const catagorySelect = document.getElementById('item-catagory')
const menuPreviewm = document.getElementById('menu-preview')

let menuItems = []

function renderMenu(){
    menuPreview.innerHTML = ""
    menuItems.forEach((item, index) => {
        const itemDiv = document.createElement('div')
        itemDiv.classList.add('menu-item')

        itemDiv.innerHTML = 
            `<img src="${item.image}" alt="${item.name}"
            class="menu-pic"> <div class="item-details">
            <h3>${item.name}</h3> <span class="item-price">$${item.price}</span>
            <p class="item-desc">${item.desc}</p> </div>
            <button class="delet-btn" data-index="${index}">delete</button>`;
        
        menuPreview.appendChild(itemDiv)
    })
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            const idx = e.target.dataset.index
            menuItems.splice(idx, 1)
            renderMenu();
        })
    })
}

addBtn.addEventListener('click', () => {
    const newItem = {
        name: itemNameInput.value,
        price: parseFloat(itemPriceInput.value).toFixed(2),
        desc: itemDescInput.value,
        image: itemImageInput.value,
        catagory: catagorySelect.value
    }
    menuItems.push(newItem)

    itemNameInput.value = "";
    itemPriceInput.value = "";
    itemDescInput.value = "";
    itemImageInput.value = "";

    renderMenu()
})

renderMenu()