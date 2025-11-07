const signUpButton = document.getElementById(`signUp`)
const signInButton = document.getElementById(`signIn`)
const container = document.getElementById(`container`)
const signUpForm = document.getElementById('signupForm')
const loginForm = document.getElementById('loginForm')

const users = []

window.addEventListener('load', () => {
    container.classList.add('right-panel-active')
})

signUpButton.addEventListener(`click`, () => {
    container.classList.add(`right-panel-active`)
})

signInButton.addEventListener(`click`, () => {
    container.classList.remove(`right-panel-active`)
})

const messageBox = document.createElement('div')
messageBox.id = 'message'
document.body.appendChild(messageBox)

function showMessage(text, duration = 1000){
    messageBox.textContent = text
    messageBox.classList.add('show')
    messageBox.classList.remove('hide')
    setTimeout(() => {
        messageBox.classList.remove('show')
        messageBox.classList.add('hide')
    }, duration)
}

signUpForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const name = signUpForm.querySelector('input[placeholder="Name"]').value.trim()
    const email = signUpForm.querySelector('input[placeholder="Email"]').value.trim()
    const password = signUpForm.querySelector('input[placeholder="Password"]').value.trim()
    if(users.find(u => u.email === email)){
        showMessage('This email is already registered', 1000)
        return;
    }
    users.push({ name, email, password })
    signUpForm.reset()
    showMessage('Account created successfully.', 1000)
    setTimeout(() => {
        container.classList.remove('right-panel-active')
    }, 1000)
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const email = loginForm.querySelector('input[placeholder="Email"]').value.trim()
    const password = loginForm.querySelector('input[placeholder="Password"]').value.trim()
    const user = users.find(u => u.email === email && u.password === password)
    if(user){
        showMessage(`Welcome back, ${user.name}.`, 1000)
        loginForm.reset()
    }else{
        showMessage('Invalid email or password. Please try again.', 1000)
    }
});