var username = document.getElementById('username')
var textPosts = document.getElementById('textPosts')
var helpButton = document.getElementById('help')
var likeButton = document.getElementById('likeButton')
var mediaPosts = document.getElementById('mediaPosts')
var postPFP = document.getElementsByClassName('postPFP')

if (document.cookie){
    n = decodeURIComponent(document.cookie).split('=j:')
    if (username != null){
    username.innerText = JSON.parse(n[1]).username}
}

function displayTextPosts(){
    console.log('displayTextPosts called')
    let url = 'http://localhost:80/home/get/posts/text/'
    fetch(url)
    .then((response) => {
        return response.text()    
    })
    .then((posts) =>{
        console.log(posts)
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
    }


helpButton.onclick = () => {window.location.href = 'http://localhost:80/help.html'}