document.addEventListener("DOMContentLoaded", () => {
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