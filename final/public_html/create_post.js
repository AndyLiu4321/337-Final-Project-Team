var imageInput = document.getElementById('imageInput')
var postTextbox = document.getElementById('postTextbox')
var cancel = document.getElementById('cancel')
var post = document.getElementById('postButton')
var postForm = document.getElementById('postForm')



function createPost(event){
    event.preventDefault()
    n = decodeURIComponent(document.cookie).split('=j:')
    username =  JSON.parse(n[1]).username
    const formData = new FormData(postForm)
    formData.append('user', username)
    let url = `http://localhost:80/home/posts/create/`
    fetch((url), {
        method: 'POST',
        body: formData
        })
        .then((response) => {
            return response.text();
        })
        .then((information) => {
            if (information == 'No User'){
                alert('Not logged in')
            }
            if (information == 'No Text'){
                alert('Post must contain text')
            }
            else{
            console.log(information)
            window.location.href = 'home.html'
            }
        })
        .catch((error) => {
            alert('THERE WAS A PROBLEM');
            console.log(error);
});}

cancel.onclick = () => {window.location.href = 'http://localhost:80/home.html'}
post.onclick = createPost