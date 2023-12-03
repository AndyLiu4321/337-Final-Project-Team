document.addEventListener('DOMContentLoaded', function() {
    fetch('/get-last-messages')
        .then(response => response.json())
        .then(conversations => {
            const messagesDiv = document.getElementById('messages');
            conversations.forEach(convo => {
                const button = document.createElement('button');
                button.className = 'DM';
                button.innerHTML = `
                    ${convo.otherUser}: ${convo.lastMessage.content}
                `;
                button.addEventListener('click', () => {
                    window.location.href = `sendDM.html?user=${convo.otherUser}`;
                });
                messagesDiv.appendChild(button);
            });
            if (messagesDiv.innerText == ''){
                messagesDiv.innerText = 'You have not received any messages'
            }
        })
        .catch(error => console.error('Error:', error));
});

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
        }
        if (theme == 'light'){
            document.body.classList.remove('dark-mode'); 
            document.body.classList.add('light-mode');
        }
    })
    .catch((error) => {
        alert('THERE WAS A PROBLEM');
        console.log(error);
    });
}

homeButton.onclick = () => {
    window.location.href = 'http://localhost:80/home.html';
};
newMessage.onclick = () => {
    window.location.href = 'http://localhost:80/sendDM.html';
};

window.onload = getTheme()