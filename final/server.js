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

const multer = require('multer');
var storage = multer.diskStorage(
    {
        destination: './public_html/uploads/images/',
        filename: function ( req, file, cb ) {
            cb( null, file.originalname);
        }
    }
);

var upload = multer( { storage: storage } );

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
    if (last + (60000 * 10) < now) {
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
    if (!c) {
        // new
        return res.redirect('/index.html');
    }
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
    likes: Array
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
        else if (user.hash != crypto
            .createHash('sha256')
            .update(req.body.password + user.salt)
            .digest('hex')){
                res.send('No User')
        }
        else{
            let sid = addSession(req.body.username);  
            res.cookie("login", 
            {username: req.body.username, sessionID: sid}, 
            {maxAge: 60000 * 10});
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

app.post('/home/posts/create/', upload.single('photo'), (req, res) => {
    let p = User.find({username: req.body.user}).exec();
    p.then((user) => {
        if (user.length <= 0){
            res.send('No User')
        }
        if (req.body.text.length <= 0){
            res.send('No Text')
        }
        else {
            if (!req.file) {
                var post = new Post({
                    user: req.body.user,
                    media: '',
                    text: req.body.text,
                    likes: req.body.likes});
            }
            else{
                var post = new Post({
                    user: req.body.user,
                    media: req.file.originalname,
                    text: req.body.text,
                    likes: req.body.likes});
            }
        post.save()
        .then(() => {res.send('OK')})
    }})
    .catch((error) => {console.log(error)})
});

app.get('/home/get/posts/text/', (req, res) => {
    let textPosts = '';
    const p = Post.find({}).exec();
    p.then((posts) => {
        const promises = posts.map((post) => {
            if (post.media === '') {
                let stat = 'Like';
                if (post.likes.includes(req.cookies.login.username)) {
                    stat = 'Unlike';
                }
                return User.findOne({ username: post.user }).exec()
                    .then((user) => {
                        let pfp = 'imgs/blank-profile-picture-973460_960_720.webp';
                        if (user && user.pfp !== 'blank-profile-picture-973460_960_720.webp') {
                            pfp = `uploads/images/${user.pfp}`;
                        }
                        return `<div class="textPost">
                            <img src="${pfp}" alt="pfp" class="postPFP">
                            <h3>${post.user}</h3>
                            <hr>
                            <p><b>${post.user || ''}: </b>${post.text}</p>
                            <p id='likes${post._id}'>Likes: ${post.likes.length}</p>
                            <button id='likeButton${post._id}' onclick="like('${post._id}')">${stat}</button>
                        </div>`;
                    });
            }
            return Promise.resolve(null);
        });
        Promise.all(promises)
            .then((results) => {
                textPosts = results.filter((result) => result !== null).join('');
                res.send(JSON.stringify(textPosts));
            })
            .catch((error) => {
                console.log(error);
                res.send('error');
            });
    })
    .catch((error) => {
        console.log(error);
        res.send('error');
    });
});

app.get('/home/get/posts/media/', (req, res) => {
    mediaPosts = ''
    const p = Post.find({}).exec();
    p.then((posts) => {
        const promises = posts.map((post) => {
            if (post.media != '') {
                let stat = 'Like';
                if (post.likes.includes(req.cookies.login.username)) {
                    stat = 'Unlike';
                }
                return User.findOne({ username: post.user }).exec()
                    .then((user) => {
                        let pfp = 'imgs/blank-profile-picture-973460_960_720.webp';
                        if (user && user.pfp !== 'blank-profile-picture-973460_960_720.webp') {
                            pfp = `uploads/images/${user.pfp}`;
                        }
                        return `<div class="textPost">
                            <img src="${pfp}" alt="pfp" class="postPFP">
                            <h3>${post.user}</h3>
                            <hr>
                            <img src="uploads/images/${post.media}" alt="Image Preview" class='postMedia'></img>
                            <p><b>${post.user || ''}: </b>${post.text}</p>
                            <p id='likes${post._id}'>Likes: ${post.likes.length}</p>
                            <button id='likeButton${post._id}' onclick="like('${post._id}')">${stat}</button>
                        </div>`;
                    });
            }
            return Promise.resolve(null);
        });
        Promise.all(promises)
            .then((results) => {
                textPosts = results.filter((result) => result !== null).join('');
                res.send(JSON.stringify(textPosts));
            })
            .catch((error) => {
                console.log(error);
                res.send('error');
            });
    })
    .catch((error) => {
        console.log(error);
        res.send('error');
    });
});

app.get('/profile/get/posts/text/', (req, res) => {
    textPosts = ''
    let p = Post.find({user: req.cookies.login.username}).exec();
    p.then((posts) => {
        for (i = 0; i < posts.length; i++){
            console.log(posts[i].likes.length)
            if (posts[i].media == ''){
                stat = 'Like'
                if(posts[i].likes.includes(req.cookies.login.username)){
                    stat = 'Unlike'
                }
                textPosts += `<div class="textPost">
                <img src="imgs/blank-profile-picture-973460_960_720.webp" 
                alt="pfp" class="postPFP">
                <h3>${posts[i].user}</h3>
                <hr>
                <p><b>${posts[i].user}: </b>${posts[i].text}</p>
                <p id='likes${posts[i]._id}'>Likes: ${posts[i].likes.length}</p>
                <button id='likeButton${posts[i]._id}' onclick = "like('${posts[i]._id}')">${stat}</button>
                </div>`
        }}
        res.send(JSON.stringify(textPosts))
    })
    .catch((error) => {res.send("error")})
});

app.get('/profile/get/posts/media/', (req, res) => {
    mediaPosts = ''
    let p = Post.find({user: req.cookies.login.username}).exec();
    p.then((posts) => {
        for (i = 0; i < posts.length; i++){
            if (posts[i].media != ''){
                stat = 'Like'
                if(posts[i].likes.includes(req.cookies.login.username)){
                    stat = 'Unlike'
                }
                mediaPosts += `<div class="mediaPost">
                <img src="imgs/blank-profile-picture-973460_960_720.webp" 
                alt="pfp" class="postPFP">
                <h3>${posts[i].user}</h3>
                <hr>
                <img src="uploads/images/${posts[i].media}" alt="Image Preview" class='postMedia'>
                <p><b>${posts[i].user}: </b>${posts[i].text}</p>
                <p id='likes${posts[i]._id}'>Likes: ${posts[i].likes.length}</p>
                <button id='likeButton${posts[i]._id}' onclick = "like('${posts[i]._id}')">${stat}</button>
                </div>`
                console.log(posts[i])
        }}
        res.send(JSON.stringify(mediaPosts))
    })
    .catch((error) => {res.send("error")})
});

app.get('/profile/get/posts/number/', (req, res) => {
    let p = Post.find({user: req.cookies.login.username}).exec();
    p.then((posts) => {
        res.send(JSON.stringify(posts.length))
    })
    .catch((error) => {res.send("error")})
});

app.get('/profile/get/bio/', (req, res) => {
    let p = User.findOne({username: req.cookies.login.username}).exec();
    p.then((user) => {
        res.send(JSON.stringify(user.bio))
    })
    .catch((error) => {res.send("error")})
});

app.get('/profile/get/likes/', (req, res) => {
    let p = Post.find({user: req.cookies.login.username}).exec();
    p.then((posts) => {
        likes = 0
        for (i = 0; i < posts.length; i++){
            likes += posts[i].likes.length
        }
        res.send(JSON.stringify(likes))
    })
    .catch((error) => {res.send("error")})
});

app.post('/home/like/', (req, res) => {
    let p = Post.findOne({_id: req.body.postID}).exec();
    p.then((post) => {
        if (post.likes.includes(req.cookies.login.username)){
            post.likes.pop(req.cookies.login.username)
            console.log(post)
            post.save()
            res.json(['Already Liked', post.likes.length.toString()])
        }
        else{
            post.likes.push(req.cookies.login.username)
            console.log(post)
            post.save()
            res.json(['Liked', post.likes.length.toString()])
        }
    })
    .catch((error) => {
        console.log(error)
        res.send("error")
    })
});

app.post('/settings/change/password/', (req, res) => {
    let p = User.findOne({username: req.cookies.login.username}).exec();
    p.then((user) => {
        let salt = user.salt;
        let hash = crypto
        .createHash('sha256')
        .update(req.body.password + salt)
        .digest('hex')
        if (hash == user.hash){
            res.send('passwords are the same')
        }
        else{
            user.hash = hash
            user.save()
            res.send('password changed')
        }
        })
    .catch((error) => {
        console.log(error)
        res.send("error")
    })
})

app.post('/settings/change/bio/', (req, res) => {
    let p = User.findOne({username: req.cookies.login.username}).exec();
    p.then((user) => {
        user.bio = req.body.bio
        user.save()
        res.send('bio changed')
        })
    .catch((error) => {
        console.log(error)
        res.send("error")
    })
})

app.post('/settings/change/pfp/', upload.single('photo'), async (req, res) => {
    let p = User.findOne({username: req.body.user}).exec();
    p.then(async (user) => {
        console.log(req.file)
        if (!req.file) {
            res.send('no image')
        }
        else{
            user.pfp = req.file.originalname
            res.send('pfp updated')
        }
        await user.save()
    })
    .catch((error) => {console.log(error)})
});

app.get('/profile/get/pfp/', (req, res) => {
    let p = User.findOne({username: req.cookies.login.username}).exec();
    p.then((user) => {
        res.send(JSON.stringify(user.pfp))
    })
    .catch((error) => {res.send("error")})
});

app.get('/home/logout/', (req, res) => {
    delete sessions[req.cookies.login.username]
    res.clearCookie('login', {username: req.cookies.login.username})
    res.send('logged out')
});

app.post('/settings/change/theme/', (req, res) => {
    let p = User.findOne({username: req.cookies.login.username}).exec();
    p.then((user) => {
        if (user.theme == req.body.theme){
            res.send('Same theme')
        }
        else{
            user.theme = req.body.theme
        }
        user.save()
        res.send('theme changed')
        })
    .catch((error) => {
        console.log(error)
        res.send("error")
    })
})

app.get('/get/theme/', (req, res) => {
    let p = User.findOne({username: req.cookies.login.username}).exec();
    p.then((user) => {
        if (user.theme == 'dark'){
            res.send('dark')
        }
        else if (user.theme == 'light' || user.theme == ''){
            res.send('light')
        }})
    .catch((error) => {
        console.log(error)
        res.send("error")
    })
})

app.post('/settings/add/interest/', (req, res) => {
    let p = User.findOne({username: req.cookies.login.username}).exec();
    p.then((user) => {
        user.interests.push(req.body.interest)
        user.save()
        res.send('added')
        })
    .catch((error) => {
        console.log(error)
        res.send("error")
    })
});

app.post('/settings/remove/interest/', (req, res) => {
    let p = User.findOne({username: req.cookies.login.username}).exec();
    p.then((user) => {
        if (user.interests.includes(req.body.interest)){
            user.interests.pop(req.body.interest)
        user.save()
        res.send('removed')
        }
        else{
            res.send('No interest found')
        }
        })
    .catch((error) => {
        console.log(error)
        res.send("error")
    })
});

app.get('/profile/get/interests/', (req, res) => {
    let p = User.findOne({username: req.cookies.login.username}).exec();
    p.then((user) => {
        res.json(user.interests)
    })
    .catch((error) => {res.send("error")})
});

app.get('/get-last-messages', (req, res) => {
    const currentUser = req.cookies.login.username;
    
    User.findOne({ username: currentUser }, 'messageThread')
        .then(user => {
            if (!user) {
                return res.status(404).send('User not found');
            }

            let conversations = {};
            user.messageThread.forEach(msg => {
                if (msg.sender !== currentUser) {
                    if (!conversations[msg.sender] || new Date(conversations[msg.sender].timestamp) < new Date(msg.timestamp)) {
                        conversations[msg.sender] = msg;
                    }
                }
            });

            let result = [];
            for (let otherUser in conversations) {
                result.push({ otherUser: otherUser, lastMessage: conversations[otherUser] });
            }

            res.json(result);
        })
        .catch(err => res.status(500).send('Error fetching messages'));
});


app.post('/send-message', (req, res) => {
    const sender = req.cookies.login.username;
    const { recipient, content } = req.body;

    if (!recipient || !content) {
        return res.status(400).send('Recipient and content are required');
    }
    //containing message objects
    const message = {
        sender: sender,
        content: content,
        timestamp: new Date()
    };

    // Add the message
    User.updateOne({ username: sender }, { $push: { messageThread: message }})
        .then(() => User.updateOne({ username: recipient }, { $push: { messageThread: message }}))
        .then(() => res.json({ message: 'Message sent' }))
        .catch(err => res.status(500).send('Error sending message'));
});

app.get('/get-conversation/:otherUser', (req, res) => {
    const currentUser = req.cookies.login.username; 
    const otherUser = req.params.otherUser;
    if (currentUser === otherUser) {
        return res.status(400).send('Cannot search for conversations with yourself');
    }
    const currentUserMessages = User.findOne({ username: currentUser }, 'messageThread').exec();
    const otherUserMessages = User.findOne({ username: otherUser }, 'messageThread').exec();

    Promise.all([currentUserMessages, otherUserMessages])
        .then(([currentUserData, otherUserData]) => {
            if (!currentUserData || !otherUserData) {
                return res.status(404).send('One or both users not found');
            }
            // Filter messages from current user's data
            const currentUserConversation = currentUserData.messageThread.filter(msg => 
                msg.sender === otherUser || msg.recipient === otherUser);
            // Filter messages from other user's data
            const otherUserConversation = otherUserData.messageThread.filter(msg => 
                msg.sender === currentUser || msg.recipient === currentUser);
            // Combine and sort the conversations
            const combinedConversation = currentUserConversation.concat(otherUserConversation);
            combinedConversation.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

            res.json(combinedConversation);
        })
        .catch(err => res.status(500).send(console.error(err)));
});


app.listen(port, () =>
    console.log(`listening at http://localhost:${port}`));