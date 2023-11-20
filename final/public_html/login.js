var loginUsername = document.getElementById('loginUsername')
var loginPassword = document.getElementById('loginPassword')
var createAccUsername = document.getElementById('createAccUsername')
var createAccPassword = document.getElementById('createAccPassword')
var confirmPassword = document.getElementById('confirmPassword')
var loginButton = document.getElementById('loginButton')
var createAccButton = document.getElementById('createAccButton')
var errorLogin = document.getElementById('errorLogin')
var errorCreateAcc = document.getElementById('errorCreateAcc')

function login(){
    info = {username: loginUsername.value, password: loginPassword.value}
    let url = 'http://localhost/home/login/'
    fetch((url), {
        method: 'POST',
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify(info)
    })
    .then((response) => {
        return (response.text())
    })
    .then((text) => {
        if (text == 'Success'){
            window.location.href = 'http://localhost:80/home.html'
        }
        else{
            errorLogin.innerText = 'Username or password is incorrect'
        }
    })
    .catch((error) => {
        console.log('THERE WAS A PROBLEM');
        console.log(error);
    });
}

function addUser(){
    errorCreateAcc.innerText = ''
    var specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
    info = {username: createAccUsername.value, password: createAccPassword.value}
    if (createAccPassword.value.length < 8){
        errorCreateAcc.innerText += 'Password must be 8 characters\n'
    }
    if (specialCharacters.test(createAccPassword.value) == false){
        errorCreateAcc.innerText += 'Password must contain a special character\n'
    }
    if (createAccPassword.value == createAccPassword.value.toLowerCase()){
        errorCreateAcc.innerText += 'Password must contain an uppercase letter\n'
    }
    if (createAccPassword.value != confirmPassword.value){
        errorCreateAcc.innerText += 'Passwords do not match\n'
    }
    else{
        let url = 'http://localhost:80/home/adduser/'
        fetch((url), {
            method: 'POST',
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(info)
            })
            .then((response) => {
                return response.text();
            })
            .then((information) => {
                if (information == 'Username taken'){
                    alert('Username taken')
                }
                else{
                    alert('User Created!')
                }
            })
            .catch((error) => {
                console.log('THERE WAS A PROBLEM');
                console.log(error);
            });
    }
}

loginButton.onclick = login
createAccButton.onclick = addUser