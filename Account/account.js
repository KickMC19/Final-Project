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

function loadOrders() {
    const ordersList = document.getElementById("ordersList")
    ordersList.innerHTML = `<p class="empty-orders">You have no orders yet.</p>`
}