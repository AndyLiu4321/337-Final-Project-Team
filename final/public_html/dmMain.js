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
        })
        .catch(error => console.error('Error:', error));
});

homeButton.onclick = () => {
    window.location.href = 'http://localhost:80/home.html';
};
newMessage.onclick = () => {
    window.location.href = 'http://localhost:80/sendDM.html';
};