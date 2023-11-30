// Function to extract query parameters from URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Function to initiate conversation fetch based on query parameter
function initiateConversationFetch() {
    const otherUser = getQueryParam('user');
    if (otherUser) {
        document.getElementById('userNameInput').value = otherUser;
        fetchAndDisplayConversation(otherUser);

        // Set interval for refreshing the conversation
        if (window.conversationInterval) {
            clearInterval(window.conversationInterval);
        }
        window.conversationInterval = setInterval(() => {
            fetchAndDisplayConversation(otherUser);
        }, 1000);
    }
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', initiateConversationFetch);

document.getElementById('sendButton').addEventListener('click', function() {
    var recipient = document.getElementById('userNameInput').value;
    var messageContent = document.getElementById('textbox').value;

    var messageData = {
        recipient: recipient,
        content: messageContent
    };

    fetch('/send-message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
    })
    .then(response => response.json()) // Parse the JSON response
    .then(data => {
        console.log(data.message); // Use the 'message' property from the JSON response
    })
    .catch((error) => {
        console.error('Error:', error);
});
});

function fetchAndDisplayConversation(otherUser) {
    fetch(`/get-conversation/${otherUser}`)
        .then(response => response.json())
        .then(conversation => {
            const messageDiv = document.getElementById('messageDiv');
            messageDiv.innerHTML = ''; // Clear current messages
            conversation.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

            conversation.forEach(message => {
                const messageElement = document.createElement('div');
                messageElement.classList.add('message');
                const formattedDate = formatDate(message.timestamp);
                messageElement.innerHTML = `<p>${message.sender}: ${message.content} <span class="timestamp">${formattedDate}</span></p>`;
                messageDiv.appendChild(messageElement);
            });
        })
        .catch(error => console.error('Error:', error));
}

function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString(); 
}

document.getElementById('userNameInput').addEventListener('change', function() {
    var otherUser = this.value;
    if (window.conversationInterval) {
        clearInterval(window.conversationInterval);
    }

    // Set a new interval to refresh the conversation every second
    window.conversationInterval = setInterval(() => {
        fetchAndDisplayConversation(otherUser);
    }, 1000);
});
backButton.onclick = () => {window.location.href = 'http://localhost:80/dmMain.html'}