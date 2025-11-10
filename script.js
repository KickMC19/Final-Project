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
