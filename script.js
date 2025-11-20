document.addEventListener("DOMContentLoaded", () => {
    const loggedIn = localStorage.getItem("loggedInUser") !== null;
    const navLogin = document.getElementById("nav-login");
    if (navLogin) {
        if (loggedIn) {
            navLogin.textContent = "ACCOUNT";
            navLogin.href = "/account/account.html";
        } else {
            navLogin.textContent = "LOGIN / SIGNUP";
            navLogin.href = "/Login-SignUp/login-signUp.html";
        }
    }
    const isLoginPage = window.location.pathname.includes("login-signUp.html");
    if (loggedIn && isLoginPage) {
        window.location.href = "/account/account.html";
    }
});

const managerAccount = {
    email: "manager@lonestar.com",
    password: "manager123",
    name: "manager"
}

document.addEventListener("DOMContentLoaded", () => {
    let navLogin = document.getElementById("nav-login")
    let navManager = document.querySelector("a[href='/Manager/manager.html']")
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"))
    if(navLogin){
        if(loggedInUser){
            navLogin.textContent = "ACCOUNT"
            navLogin.href = "/account/account.html"
        }else{
            navLogin.textContent = "LOGIN / SIGNUP"
            navLogin.href = "Login-SignUp/login-signUp.html"
        }
    }
    if(navManager){
        if(!loggedInUser || loggedInUser.email !== managerAccount.email){
            navManager.style.display = "none"
        }else{
            navManager.style.display = "block"
        }
    }
})