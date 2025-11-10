let users = JSON.parse(localStorage.getItem("users")) || []
let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))

if(!loggedInUser){
    window.location.href = '/Login-SignUp/login-signUp.html'
} else{
    document.getElementById('accountName').textContent = loggedInUser.name
    document.getElementById('accountEmail').textContent = loggedInUser.email || ""
    if(loggedInUser.profilePic){
        document.getElementById('profileImage'.src = loggedInUser.profilePic)
    }
    loadOrders();
}

document.getElementById('signOutBtn').addEventListener('click', () => {
    localStorage.removeItem('loggedInUser')
    window.location.href = '/Login-SignUp/login-signUp.html'
})