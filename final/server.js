const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser')
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const app = express();
const port = 80;

const db  = mongoose.connection;
const mongoDBURL = 'mongodb://localhost:27017/final';
mongoose.connect(mongoDBURL, { useNewUrlParser: true });
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyparser.json())
app.use(cookieParser());

let sessions = {};

function addSession(username) {
    /*
    Function: addSession
    The purpose of this function is to create a session with a random id and the time that
    the user logged in. This information is stored in a dictionary 'sessions'. Returns the session
    id. Function is called when a user logs in.
    */  
    let sid = Math.floor(Math.random() * 1000000000);
    let now = Date.now();
    sessions[username] = {id: sid, time: now};
    return sid;
}

function removeSessions() {
    /*
    Function: removeSession
    The purpose of this function is to remove a session from the sessions dictionary after a
    certain amount of time has passed since it was created. In this function, a session will be
    removed if it is 2000 seconds old. The sessions are printed, and the function is called every
    2 seconds
    */  
  let now = Date.now();
  let usernames = Object.keys(sessions);
  for (let i = 0; i < usernames.length; i++) {
    let last = sessions[usernames[i]].time;
    if (last + 2000000 < now) {
      delete sessions[usernames[i]];
    }
  }
  console.log(sessions);
}

setInterval(removeSessions, 2000);

function authenticate(req, res, next) {
    /*
    Function: authenticate
    The purpose of this function is to check if a user has an active session, and decide whether
    or not to let them view a certain page. If the user has an active session, they are able to 
    access the other pages, and if not they are redirected to index.html
    */ 
    let c = req.cookies.login;
    console.log('auth request:');
    console.log(req.cookies);
    if (c != undefined) {
      if (sessions[c.username] != undefined && 
        sessions[c.username].id == c.sessionID) {
        next();
      } else {
        res.redirect('/index.html');
      }
    }  else {
      res.redirect('/index.html');
    }
  }
  
app.use('/create_post.html', authenticate);
app.use('/home.html', authenticate);
app.use('/dmMain.html', authenticate);
app.use('/profile.html', authenticate);
app.use('/sendDM.html', authenticate);
app.use('/settings.html', authenticate);
app.use('/help.html', authenticate);


app.use(express.static('public_html'))
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: String,
    hash: String,
    salt: Number,
    friends: Array,
    messageThread: Array,
    likes: Number,
    posts: Array,
    friendRequestsRecieved: Array,
    friendRequestsSent: Array,
    theme: String,
    interests: Array,
    bio: String,
    pfp: String
})
var User = mongoose.model('User', userSchema );

var postSchema = new Schema({
    user: String,
    media: String,
    text: String,
    likes: Number
})
var Post = mongoose.model('Post', postSchema)

var messageThreadSchema = new Schema({
    user1: String,
    user2: String,
    messageList: Array
})
var MessageThread = mongoose.model('MessageThread', messageThreadSchema)

var messageSchema = new Schema({
    user: String,
    media: String,
    text: String
})
var Message = mongoose.model('Message', messageSchema)

app.post('/home/login/', (req, res) =>{
    let p = User.findOne({username: req.body.username}).exec()
    p.then((user) =>{
        if (user == null ){
            res.send('No User')
        }
        if (user.hash != crypto
            .createHash('sha256')
            .update(req.body.password + user.salt)
            .digest('hex')){
                res.send('No User')
        }
        else{
            let sid = addSession(req.body.username);  
            res.cookie("login", 
            {username: req.body.username, sessionID: sid}, 
            {maxAge: 60000 * 2 });
            res.send('Success')
        }
    })
    .catch((error) => {res.send('error')})
});

app.post('/home/adduser/', (req, res) => {
    let p = User.find({username: req.body.username}).exec();
    p.then((user) => {
        if (user.length > 0){
            res.send('Username taken')
        }
        else {
            let salt = Math.floor(Math.random() * 1000000000);
            let hash = crypto
            .createHash('sha256')
            .update(req.body.password + salt)
            .digest('hex')
            var user = new User({
            username: req.body.username,
            hash: hash,
            salt: salt,
            friends: [],
            messageThread: [],
            likes: 0,
            posts: [],
            friendRequestsRecieved: [],
            friendRequestsSent: [],
            theme: '',
            interests: [],
            bio: '',
            pfp: 'blank-profile-picture-973460_960_720.webp'
        });
        user.save()
        .then(() => {res.send('OK')})
    }
    })
    .catch((error) => {res.send("error")})
});

app.post('/home/posts/create/', (req, res) => {
    console.log(req.body)
    let p = User.find({username: req.body.user}).exec();
    p.then((user) => {
        if (user.length <= 0){
            res.send('No User')
        }
        if (req.body.text.length <= 0){
            res.send('No Text')
        }
        else {
            var post = new Post({
                user: req.body.user,
                media: req.body.media,
                text: req.body.text,
                likes: req.body.likes
        });
        post.save()
        .then(() => {res.send('OK')})
    }
    })
    .catch((error) => {res.send("error")})
});

app.get('/home/get/posts/', (req, res) => {
    textPosts = ''
    let p = Post.find({user: req.cookies.login.username}).exec();
    p.then((posts) => {
        for (i = 0; i < posts.length; i++){
            if (posts[i].media == ''){
                textPosts += `<div class="textPost">
                <img src="imgs/blank-profile-picture-973460_960_720.webp" 
                alt="pfp" class="postPFP">
                <h3>${posts[i].user}</h3>
                <hr>
                <p>${posts[i].text}</p>
                <p>Likes: ${posts[i].likes}</p>
                </div>`
        }}
        res.send(JSON.stringify(textPosts))
    })
    .catch((error) => {res.send("error")})
});


app.listen(port, () =>
    console.log(`listening at http://localhost:${port}`));