var username = document.getElementById('username')
var textPosts = document.getElementById('textPosts')
var helpButton = document.getElementById('help')
var likeButton = document.getElementById('likeButton')
var mediaPosts = document.getElementById('mediaPosts')
var postPFP = document.getElementsByClassName('postPFP')
var pfp = document.getElementById('pfp')
var logout = document.getElementById('logOut')
var sidebar = document.getElementById('sidebar')
var mediaPost = document.getElementsByClassName('mediaPost')
var textPost = document.getElementsByClassName('textPost')

function getPFP(){
    let url = 'http://localhost:80/profile/get/pfp/'
    fetch(url)
    .then((response) => {
        return response.text()   
    })
    .then((pfpstring) =>{
        if (pfpstring != 'blank-profile-picture-973460_960_720.webp'){
            pfp.src = `uploads/images/${pfpstring.replace(/^"(.*)"$/, '$1')}`}
    })
    .catch((error) => {
        alert('THERE WAS A PROBLEM');
        console.log(error);
    });
}

if (document.cookie){
    n = decodeURIComponent(document.cookie).split('=j:')
    if (username != null){
    username.innerText = JSON.parse(n[1]).username}
}

function displayTextPosts(){
    let url = 'http://localhost:80/home/get/posts/text/'
    fetch(url)
    .then((response) => {
        return response.text()    
    })
    .then((posts) =>{
        if (posts.length != 2){
            textPosts.innerHTML = JSON.parse(posts)
        }
        getTheme()
    })
    .catch((error) => {
        alert('THERE WAS A PROBLEM');
        console.log(error);
    });
}

function displayMediaPosts(){
    let url = 'http://localhost:80/home/get/posts/media/'
    fetch(url)
    .then((response) => {
        return response.text()    
    })
    .then((posts) =>{
        console.log(posts)
        if (posts.length != 2){
            mediaPosts.innerHTML = JSON.parse(posts)
        }
        getTheme()
    })
    .catch((error) => {
        alert('THERE WAS A PROBLEM');
        console.log(error);
    });
}

function like(id){
    info = {postID: id}
    let url = `http://localhost:80/home/like/`
    fetch((url), {
        method: 'POST',
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify(info)
        })
        .then((response) => {
            return response.json();
        })
        .then((information) => {
            let likeButton = document.getElementById('likeButton' + id)
            let likes = document.getElementById('likes' + id)
            if (information[0] == 'Liked'){
                likeButton.innerText = 'Unlike'
            }
            else{
                likeButton.innerText = 'Like'
            }
            likes.innerText = 'Likes: ' + information[1]
        })
        .catch((error) => {
            console.log('THERE WAS A PROBLEM');
            console.log(error);
        });
}

function logOut(){
    let url = 'http://localhost:80/home/logout/'
    fetch(url)
    .then((response) => {
        console.log(response.text())    
        window.location.href = 'http://localhost:80/index.html'
    })
    .catch((error) => {
        alert('THERE WAS A PROBLEM');
        console.log(error);
    });
}

function getTheme(){
    let url = 'http://localhost:80/get/theme/'
    fetch(url)
    .then((response) => {
        return response.text()   
    })
    .then((theme) =>{
        if (theme == 'dark'){
            document.body.classList.remove('light-mode'); 
            document.body.classList.add('dark-mode');
            sidebar.classList.add('dark-mode')
            sidebar.classList.remove('light-mode')
            for (i = 0; i < mediaPost.length; i++){
                mediaPost[i].classList.add('dark-mode')
                mediaPost[i].classList.remove('light-mode')
            }
            for (i = 0; i < textPost.length; i++){
                textPost[i].classList.add('dark-mode')
                textPost[i].classList.remove('light-mode')
            }
        }
        if (theme == 'light'){
            document.body.classList.remove('dark-mode'); 
            document.body.classList.add('light-mode');
            sidebar.classList.add('light-mode')
            sidebar.classList.remove('dark-mode')
        }
    })
    .catch((error) => {
        alert('THERE WAS A PROBLEM');
        console.log(error);
    });
}

window.onload = () => {
    displayTextPosts()
    displayMediaPosts()
    getPFP()
}

logout.onclick = () => {
    logOut()
}
helpButton.onclick = () => {window.location.href = 'http://localhost:80/help.html'}