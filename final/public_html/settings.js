var backButton = document.getElementById('backButton')
var changeUsernameButton = document.getElementById('changeUsername')
var changePasswordButton = document.getElementById('changePassword')
var changeTheme = document.getElementById('changeTheme')
var changepfpButton = document.getElementById('changepfp')
var editBioButton = document.getElementById('editBioButton')
var backButton = document.getElementById('backButton')
var settingsDiv = document.getElementById('settingsDiv')
var changeUsernameInnerButton = document.getElementById('changeUsernameInnerButton')
var changePasswordInnerButton = document.getElementById('changePasswordInnerButton')


changeUsernameButton.onclick = () =>{
    settingsDiv.innerHTML = `<h2>Change Username</h2>
    <h3 class="innerSetting">Enter new Username:</h3>
    <input type="text" class="innerSetting" id="changeUsernameInput">
    <button class="innerSetting" id="changeUsernameInnerButton">Change Username</button>`
}

changePasswordButton.onclick = () =>{
    settingsDiv.innerHTML = `<h2>Change password</h2>
    <h3 class="innerSetting">Enter new Password:</h3>
    <input type="password" class="innerSetting" id="changePasswordInput">
    <h3 class="innerSetting">Confirm new Password:</h3>
    <input type="password" class="innerSetting" id="changePasswordInputConfirm">
    <button class="innerSetting" id="changePasswordInnerButton">Change Password</button>
    <div id="errorChangePassword"></div>`
}

changeTheme.onclick = () =>{
    settingsDiv.innerHTML = `<h2>Change Theme</h2>
    <h3 class="innerSetting">Choose Theme:</h3>
    <input type="radio" id="lightTheme" name="theme" value="light">
    <label for="lightTheme">Light</label>
    <input type="radio" id="darkTheme" name="theme" value="dark">
    <label for="darkTheme">Dark</label>`
}

changepfp.onclick = () =>{
    settingsDiv.innerHTML = `<h2>Change Profile Picture</h2>
    <h3 class="innerSetting">Upload image:</h3>
    <form enctype="multipart/form-data" id="changePfpForm">
        <input type="file" accept="image/*" id="imageInput" name="photo">
        <button id="changePfpInnerButton">Confirm</button>
    </form>`
}

editBio.onclick = () =>{
    settingsDiv.innerHTML = `<h2>Edit Bio</h2>
    <h3 class="innerSetting">Bio:</h3>
    <textarea name="text" id="bio" cols="30" rows="10"></textarea>
    <button id="editBioInnerButton">Confirm</button>
    `
}

document.addEventListener('click', (event) => {
    if (event.target.id === 'changePfpInnerButton') {
        // Check if changeUsernameInput exists
        const image = document.getElementById('imageInput');
        if (image) {
            alert('Here')
            // Your logic here, for example, calling the changeUsername function
            changePFP(event);
        } else {
            console.error('image not found');
        }
    }
});

function changePFP(event){
    event.preventDefault()
    var changePfpForm = document.getElementById('changePfpForm')
    n = decodeURIComponent(document.cookie).split('=j:')
    username =  JSON.parse(n[1]).username
    const formData = new FormData(changePfpForm)
    formData.append('user', username)
    console.log(formData)
    let url = `http://localhost:80/settings/change/pfp/`
    fetch((url), {
        method: 'POST',
        body: formData
        })
        .then((response) => {
            return response.text();
        })
        .then((information) => {
            if (information == 'no image'){
                alert('No image')
            }
            if (information == 'pfp updated'){
                alert('Profile Picture Updated')
            }
            else{
            console.log(information)
            }
        })
        .catch((error) => {
            alert('THERE WAS A PROBLEM');
            console.log(error);
});}

document.addEventListener('click', (event) => {
    if (event.target.id === 'editBioInnerButton') {
        // Check if changeUsernameInput exists
        const bio = document.getElementById('bio');
        if (bio) {
            // Your logic here, for example, calling the changeUsername function
            changeBio();
        } else {
            console.error('bio not found');
        }
    }
});

function changeBio(){
    info = {bio: bio.value}
    let url = 'http://localhost:80/settings/change/bio/'
        fetch((url), {
            method: 'POST',
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(info)
            })
            .then((response) => {
                return response.text()
            })
            .then((message) => {
                console.log(message)
                alert('Bio changed!')
            })
            .catch((error) => {
                console.log('THERE WAS A PROBLEM');
                console.log(error);
            });
}


function changePassword(){
    info = {password: changePasswordInput.value}
    let url = 'http://localhost:80/settings/change/password/'
        fetch((url), {
            method: 'POST',
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(info)
            })
            .then((response) => {
                return response.text()
            })
            .then((message) => {
                if (message == 'passwords are the same'){
                    alert('Password must be different than current password')
                }
                if (message == 'password changed'){
                    alert('Password changed successfully!')
                }

            })
            .catch((error) => {
                console.log('THERE WAS A PROBLEM');
                console.log(error);
            });
}

document.addEventListener('click', (event) => {
    if (event.target.id === 'changePasswordInnerButton') {
        // Check if changeUsernameInput exists
        const changePasswordInput = document.getElementById('changePasswordInput');
        const changePasswordInputConfirm = document.getElementById('changePasswordInputConfirm')
        const errorChangePassword = document.getElementById('errorChangePassword')
        errorChangePassword.innerText = ''
        var specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
        if (changePasswordInput && changePasswordInputConfirm) {
            if (changePasswordInput.value != changePasswordInputConfirm.value){
                errorChangePassword.innerText += 'Passwords do not match\n'
            }
            else if (changePasswordInput.value.length < 8){
                errorChangePassword.innerText += 'Password must be 8 characters\n'
            }
            else if (specialCharacters.test(changePasswordInput.value) == false){
                errorChangePassword.innerText += 'Password must contain a special character\n'
            }
            else if (changePasswordInput.value == changePasswordInput.value.toLowerCase()){
                errorChangePassword.innerText += 'Password must contain an uppercase letter\n'
            }
            else {
            changePassword()
            }
    }
}});

backButton.onclick = () => {window.location.href = 'http://localhost:80/profile.html'}

/*function changeUsername(){
    info = {username: changeUsernameInput.value}
    let url = 'http://localhost:80/settings/change/username/'
        fetch((url), {
            method: 'POST',
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(info)
            })
            .then((response) => {
                return response.text()
            })
            .then((message) => {
                console.log(message)
            })
            .catch((error) => {
                console.log('THERE WAS A PROBLEM');
                console.log(error);
            });
}
document.addEventListener('click', (event) => {
    if (event.target.id === 'changeUsernameInnerButton') {
        // Check if changeUsernameInput exists
        const changeUsernameInput = document.getElementById('changeUsernameInput');

        if (changeUsernameInput) {
            // Your logic here, for example, calling the changeUsername function
            changeUsername();
        } else {
            console.error('changeUsernameInput not found');
        }
    }
});*/