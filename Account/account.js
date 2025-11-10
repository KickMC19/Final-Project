const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

if(!loggedInUser){
    window.location.href = '/Login-SignUp/login-signUp.html';
} else {
    document.getElementById('accountName').textContent = loggedInUser.name;
}

const signOutBtn = document.getElementById('signOutBtn');

function signOut() {
    localStorage.removeItem('loggedInUser');
    window.location.href = '/Login-SignUp/login-signUp.html';
}

signOutBtn.addEventListener('click', signOut);