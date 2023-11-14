# Final-Project-Team
Overview:
The application will be a social media app that allows users to create a profile, post messages, images, and videos, direct message other users, make friends on the app, etc. The app will have a very easy to use and sleek interface. Users will be shown posts based on who their friends are and posts that are popular. Users will also be able to set themes for their app that will be the same whenever they log in. Users can set profile pictures, status updates, their interests, etc. There will be a section for notifications to show a user who has sent them a friend request, who has liked their post, etc.

Login will be fully secure, utilizing cookies, salting, and hashing. Users can also change their login information (username, password) once an account has been created. 

Frontend:
User interface outline:
Login page:
-Page that the users will be brought to if they are not logged in
-Will contain the logo for the application, text fields to log in, and to create an account

Home page:
-Page users will be taken to when they log in
-Will contain posts made by the user’s friends, link to direct messages, link to view their own profile, logos, etc.
-Other pages will have a button that can bring them back to the home page
-Will contain button to the help page

Help page:
-Contains information about how to use the application
-Will be accessible via a button on the home page
-Will also have a back button to take user back to the home page

All Direct Messages Page:
-Users can access this page via a button on the home page
-Will display all direct messages that a user has received, the date/ time of the message, user who sent the message, etc
-Users can click on a direct message and be taken to a page where they can view the message history and send messages to another user
-Will also have a section to create a new direct message

Send direct message page:
-Users will be taken to this page if they click on an existing direct message thread or if they create a new direct message
-Will be scrollable to contain the whole message thread
-Will have a text bar and send button to send messages

Profile page:
-Users can be taken to this page from a button on the home page
-Will contain the information and posts for the specific
-If it is the page for the user’s own account, there will be a button to be taken to a settings page

Settings page: 
-Users can be taken to this page from a button on the user’s profile page
-Page where users can change their account information, interests, and change themes
-Will have a back button to go back to the profile page

Create post page:
-Page where a user can create a post
-Will have an exit button if the user changes their mind
-Can add photos, videos, add text

Backend
Express and nodeJS for server framework
We will be using mongoose from mongoDB as our DBMS
Crypto module for hashing passwords
Cookies to keep a user logged in, not allow users to enter the app unless they are logged in

Routes:
/home/ - This will be the homepage with login and account creation
/home/profile - This will be the current users profile page
/home/messages - All messages will be stored here
/home/posts - All posts will be from the user and will be shown to people who are friends
/home/settings - Settings tailored to the user. example: Dark mode  or Light mode

Schemas:
Users:{userID, username, hash, salt, friends, messageThreadList, friendRequestsReceived, friendRequestsSent, postsList, theme, interests, bio}
posts:{postID, userID, content, media, likes}
messageThread:{chatID, user1, user2, messageList}
Message:{MessageID, user, messageContent}





Timeline:

Week 1 - Server and Database Setup, HTML & CSS
Project initialization, setting up repository and environment (5 hours).
Implementing user authentication and session management (15 hours).
Creating HTML and CSS files for the app (10 hours)

Week 2 - User Profiles and Messaging:
Profile setup, editing, and display functionalities (20 hours).
Direct messaging infrastructure and UI (10 hours).

Week 3 - Posts and Interactions:
Posting mechanism with multimedia support (15 hours).
Likes, comments, and sharing functionalities (15 hours).

Week 4 - Polish and Testing:
Theme customization and settings (10 hours).
Final testing, bug fixing, and deployment (20 hours).

Total Estimated Hours: 120 hours

The above timeline is an estimate and may be subject to adjustments as the project progresses.


