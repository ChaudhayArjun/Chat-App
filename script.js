const username = prompt("Enter your username:") || "Anonymous";
const socket = new WebSocket("ws://localhost:3000");
const chatWindow = document.getElementById("chatWindow");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const emojiBtn = document.getElementById("emojiBtn");
const emojiPicker = document.getElementById("emojiPicker");

// Join chat
socket.onopen = () => {
  socket.send(JSON.stringify({ type: "join", username }));
};

// Handle incoming messages
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === "message") {
    addMessage(
      data.username,
      data.message,
      data.username === username ? "sent" : "received"
    );
  }
};

// Send a message
sendButton.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});

// Emoji picker functionality
emojiBtn.addEventListener("click", () => {
  if (emojiPicker.style.display === "none") {
    emojiPicker.style.display = "block";
  } else {
    emojiPicker.style.display = "none";
  }
});

emojiPicker.addEventListener("click", (event) => {
  if (event.target.classList.contains("emoji")) {
    messageInput.value += event.target.textContent;
    emojiPicker.classList.add("hidden");
  }
});

// Send message function
function sendMessage() {
  const message = messageInput.value.trim();
  if (message) {
    socket.send(JSON.stringify({ type: "message", username, message }));
    messageInput.value = "";
  }
}

// Add message to chat window
function addMessage(username, message, type) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${type}`;
  messageDiv.innerHTML = `<strong>${username}:</strong> ${message}`;
  chatWindow.appendChild(messageDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}
