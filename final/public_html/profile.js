var textPosts = document.getElementById('textPosts')
var mediaPosts = document.getElementById('mediaPosts')
var helpButton = document.getElementById('help')
var homeButton = document.getElementById('homeButton')
var username = document.getElementById('username')
var posts = document.getElementById('posts')
var settings = document.getElementById('settings')
var likes = document.getElementById('likes')
var pfp = document.getElementById('pfp')
var postPFP = document.getElementsByClassName('postPFP')

if (document.cookie){
    n = decodeURIComponent(document.cookie).split('=j:')
    if (username != null){
    username.innerText = JSON.parse(n[1]).username}
}

function getPFP(){
    let url = 'http://localhost:80/profile/get/pfp/'
    fetch(url)
    .then((response) => {
        return response.text()   
    })
    .then((pfpstring) =>{
        console.log(postPFP)
        if (pfpstring != 'blank-profile-picture-973460_960_720.webp'){
            pfp.src = `uploads/images/${pfpstring.replace(/^"(.*)"$/, '$1')}`
            for (i = 0; i < postPFP.length; i++){
                postPFP[i].src = `uploads/images/${pfpstring.replace(/^"(.*)"$/, '$1')}`
            }
        }
    })
    .catch((error) => {
        alert('THERE WAS A PROBLEM');
        console.log(error);
    });
}

function getLikes(){
    let url = 'http://localhost:80/profile/get/likes/'
    fetch(url)
    .then((response) => {
        return response.text()   
    })
    .then((number) =>{
        likes.innerText = `Likes: ${number.toString()}`
    })
    .catch((error) => {
        alert('THERE WAS A PROBLEM');
        console.log(error);
    });
}

function numOfPosts(){
    let url = 'http://localhost:80/profile/get/posts/number/'
    fetch(url)
    .then((response) => {
        return response.text()   
    })
    .then((number) =>{
        posts.innerText = `Posts: ${number.toString()}`
        
    })
    .catch((error) => {
        alert('THERE WAS A PROBLEM');
        console.log(error);
    });
}

function getBio(){
    let url = 'http://localhost:80/profile/get/bio/'
    fetch(url)
    .then((response) => {
        return response.text()   
    })
    .then((biotext) =>{
        if (biotext.length > 2){
            bio.innerText = `${JSON.parse(biotext)}`
        }
        else{
            bio.innerText = 'Edit your bio in settings!'
        }
        
    })
    .catch((error) => {
        alert('THERE WAS A PROBLEM');
        console.log(error);
    });
}

function displayTextPosts(){
    let url = 'http://localhost:80/profile/get/posts/text/'
    fetch(url)
    .then((response) => {
        return response.text()    
    })
    .then((posts) =>{
        if (posts.length != 2){
            textPosts.innerHTML = JSON.parse(posts)
        }
    })
    .catch((error) => {
        alert('THERE WAS A PROBLEM');
        console.log(error);
    });
}

function displayMediaPosts(){
    let url = 'http://localhost:80/profile/get/posts/media/'
    fetch(url)
    .then((response) => {
        return response.text()    
    })
    .then((posts) =>{
        if (posts.length != 2){
            mediaPosts.innerHTML = JSON.parse(posts)
        }
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

window.onload = () => {
    displayTextPosts()
    displayMediaPosts()
    numOfPosts()
    getLikes()
    getBio()
    getPFP()
}

helpButton.onclick = () => {window.location.href = 'http://localhost:80/help.html'}
homeButton.onclick = () => {window.location.href = 'http://localhost:80/home.html'}
settings.onclick = () => {window.location.href = 'http://localhost:80/settings.html'}