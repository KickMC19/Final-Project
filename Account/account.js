let users = JSON.parse(localStorage.getItem("users")) || []
let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))

if(!loggedInUser){
    window.location.href = '/Login-SignUp/login-signUp.html'
} else{
    document.getElementById('accountName').textContent = loggedInUser.name
    document.getElementById('accountEmail').textContent = loggedInUser.email || ""
    if(loggedInUser.profilePic){
        document.getElementById('profileImage').src = loggedInUser.profilePic
    }
    loadOrders(); 
}

document.getElementById('signOutBtn').addEventListener('click', () => {
    localStorage.removeItem('loggedInUser')
    window.location.href = '/Login-SignUp/login-signUp.html'
})

let uploadBtn = document.getElementById('uploadPicBtn')
let fileInput = document.getElementById('profilePicInput')
let profileImage = document.getElementById('profileImage')

uploadBtn.addEventListener('click', () => fileInput.click())
fileInput.addEventListener('change', function () {
    const file = this.files[0]
    if (!file) return
    const reader = new FileReader();
    reader.onload = () => {
        profileImage.src = reader.result
        loggedInUser.profilePic = reader.result
        updateUserInStorage();
    }
    reader.readAsDataURL(file)
})

document.getElementById('editInfoBtn').addEventListener('click', () => {
    const newName = prompt("Enter your new name:", loggedInUser.name)
    if(!newName) return
    const newEmail = prompt("Enter your new email", loggedInUser.email)
    if(!newEmail) return
    loggedInUser.name = newName
    loggedInUser.email = newEmail
    document.getElementById('accountName').textContent = newName
    document.getElementById('accountEmail').textContent = newEmail
    updateUserInStorage();
})

document.getElementById('deleteAccBtn').addEventListener('click', () => {
    if(confirm("Are you sure you want to delete your account?")){
        users = users.filter(u => u.email !== loggedInUser.email)
        localStorage.setItem("users", JSON.stringify(users))
        localStorage.removeItem('loggedInUser')
        alert("Your account has been deleted.")
        window.location.href = '/Login-SignUp/login-signUp.html'
    }
})

function updateUserInStorage() {
    users = users.map(u => u.email === loggedInUser.email ? loggedInUser : u)
    localStorage.setItem("users", JSON.stringify(users))
    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser))
}


//Seeing Past Orders
function formatCurrency(amount) {
    return `$${(amount).toFixed(2)}`;
}

function loadOrders() {
    const ordersList = document.getElementById("ordersList")
    const allUserOrders = JSON.parse(localStorage.getItem('allUserOrders')) || {};
    
    
    if (!loggedInUser || !loggedInUser.email) {
        ordersList.innerHTML = `<p class="empty-orders">Please log in to view your orders.</p>`;
        return;
    }

    
    const userOrders = allUserOrders[loggedInUser.email] || [];

    if (userOrders.length === 0) {
        ordersList.innerHTML = `<p class="empty-orders">You have no orders yet.</p>`;
        return;
    }

    
    ordersList.innerHTML = ''; 

    userOrders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.classList.add('order-card');
        
        
        let itemListHTML = order.items.map(item => 
            `<p class="order-item">${item.quantity}x ${item.name} (${formatCurrency(item.price * item.quantity)})</p>`
        ).join('');
        
        
        orderCard.innerHTML = `
            <div class="order-header">
                <span class="order-id-display">Order ${order.id}</span>
                <span class="order-date">${order.date}</span>
            </div>
            
            <div class="order-details">
                <p class="order-total-line"><strong>Total:</strong> ${formatCurrency(order.total)}</p>
                <div class="order-items-list">
                    <h4>Items Ordered:</h4>
                    ${itemListHTML}
                </div>
            </div>
            <button class="view-details-btn">Re-Order</button>
            <hr>
        `;

        ordersList.appendChild(orderCard);
    });
}