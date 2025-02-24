// =============================================================
//                   CHAT MODAL FUNCTIONALITY WITH FIREBASE
// =============================================================

// Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyA-3p-7WAjny-QDRk0dHNCZk4CTUjuRrEE",
    authDomain: "fantasy-radio.firebaseapp.com",
    databaseURL: "https://fantasy-radio-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "fantasy-radio",
    storageBucket: "fantasy-radio.firebasestorage.app",
    messagingSenderId: "503598738982",
    appId: "1:503598738982:web:bc38ed01578a309a6540e7",
    measurementId: "G-MC0XMZZ1WM"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Get a reference to the Firebase Realtime Database
const database = firebase.database();
// Reference to the 'messages' collection/node in the database
const messagesRef = database.ref("messages");

// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function() {
    // Get references to the chat modal elements
    const chatBtn = document.getElementById("chat-btn");
    const chatModal = document.getElementById("chat-modal");
    const closeChat = document.getElementById("close-chat");
    const sendButton = document.getElementById("send-button");
    const chatInput = document.getElementById("chat-input");
    const chatMessages = document.getElementById("chat-messages");

    // Function to open the chat modal
    function openChat() {
        chatModal.style.display = "block";
    }

    // Function to close the chat modal
    function closeChatModal() {
        chatModal.style.display = "none";
    }

    // Toggle chat modal on chat button click
    chatBtn.addEventListener("click", function() {
        if (chatModal.style.display === "block") {
            closeChatModal();
        } else {
            openChat();
        }
    });

    // Event listener for the close button in the chat modal
    closeChat.addEventListener("click", closeChatModal);

    // Function to display a message in the chat modal
    function displayMessage(messageData) {
        const messageElem = document.createElement("div");
        messageElem.textContent = messageData.text;
        // You can add more styling or data (like timestamp) here if needed
        chatMessages.appendChild(messageElem);
        // Scroll to the bottom of the chat messages
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Listen for new messages added to Firebase and display them in real time
    messagesRef.on("child_added", function(snapshot) {
        const messageData = snapshot.val();
        displayMessage(messageData);
    });

    // Event listener for the send button to send a message
    sendButton.addEventListener("click", function() {
        const message = chatInput.value.trim();
        if (message !== "") {
            // Push the new message to Firebase with a timestamp
            messagesRef.push({
                text: message,
                timestamp: Date.now()
            });
            chatInput.value = "";
        }
    });

    // (Optional) Allow pressing Enter to send a message
    chatInput.addEventListener("keyup", function(e) {
        if (e.key === "Enter") {
            sendButton.click();
        }
    });
});