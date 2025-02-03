function getToken() {
    const user = {
        "email": document.getElementById('email').value,
        "password": document.getElementById('password').value
    }
    const token = generateToken(user);
    document.getElementById('tokenResponse').innerHTML = `<h2>Mon token :</h2><p>${token}</p><button onclick="decryptToken('${token}')">Décrypter mon tokent</button>`
}

function generateToken(user) {
    const userString = JSON.stringify(user);
    const token = btoa(userString);
    console.log('token : ', token);
    return token;
}

function decryptToken(token) {
    const userInfo = atob(token);
    document.getElementById('userInfo').innerHTML = `<h2>Décryptage du token :</h2><pre>${userInfo}</pre>`
}