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

// Default nickname value (user must change this before sending a message)
let userNickname = "Anonymous";
let userColor = null; // will hold the unique color for this user

// Helper to generate a random, non-dark HSL color
function generateRandomColor() {
    let hue = Math.floor(Math.random() * 360);
    // Use 70% saturation and 60% lightness for a bright color
    return "hsl(" + hue + ", 70%, 60%)";
}

// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function() {
    // Get references to the chat modal elements
    const chatBtn = document.getElementById("chat-btn");
    const chatModal = document.getElementById("chat-modal");
    const closeChat = document.getElementById("close-chat");
    const sendButton = document.getElementById("send-button");
    const chatInput = document.getElementById("chat-input");
    const chatMessages = document.getElementById("chat-messages");
    const nicknameInput = document.getElementById("nickname-input");
    const setNicknameButton = document.getElementById("set-nickname");
    const chatDecrease = document.getElementById("chat-decrease");
    const chatIncrease = document.getElementById("chat-increase");

    // Toggle chat modal on chat button click
    chatBtn.addEventListener("click", function() {
        chatModal.style.display = (chatModal.style.display === "block") ? "none" : "block";
    });

    // Close chat modal when clicking the close icon
    closeChat.addEventListener("click", function() {
        chatModal.style.display = "none";
    });

    // Set nickname event: update userNickname and assign a unique random color
    setNicknameButton.addEventListener("click", function() {
        const newNickname = nicknameInput.value.trim();
        if (newNickname !== "") {
            userNickname = newNickname;
            userColor = generateRandomColor();
            // Provide visual feedback that the nickname is set
            setNicknameButton.textContent = "Nickname Set";
            setTimeout(function() {
                setNicknameButton.textContent = "Set";
            }, 1500);
        } else {
            alert("Please enter a valid nickname.");
        }
    });

    // Chat scaling functionality using transform
    let chatScale = 1;
    function updateChatScale() {
        chatModal.style.transform = "scale(" + chatScale + ")";
        chatModal.style.transformOrigin = "top left";
    }
    chatDecrease.addEventListener("click", function(){
        // Changed lower limit from 0.8 to 0.4 so you can scale down more
        chatScale = Math.max(0.4, chatScale - 0.1);
        updateChatScale();
    });
    chatIncrease.addEventListener("click", function(){
        chatScale = chatScale + 0.1;
        updateChatScale();
    });
    updateChatScale();

    // Function to display a message in the chat modal
    function displayMessage(messageData) {
        const messageElem = document.createElement("div");
        const sender = messageData.nickname && messageData.nickname.trim() !== "" ? messageData.nickname : "Anonymous";
        // Apply the sender's color if available
        const colorStyle = messageData.color ? ` style="color: ${messageData.color};"` : "";
        messageElem.innerHTML = `<strong${colorStyle}>${sender}:</strong> ${messageData.text}`;
        chatMessages.appendChild(messageElem);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Listen for new messages added to Firebase and display them in real time
    messagesRef.on("child_added", function(snapshot) {
        const messageData = snapshot.val();
        displayMessage(messageData);
    });

    // Send a message when the send button is clicked
    sendButton.addEventListener("click", function() {
        if(userNickname === "Anonymous" || !userColor) {
            alert("Please set your nickname before sending messages.");
            return;
        }
        const message = chatInput.value.trim();
        if (message !== "") {
            messagesRef.push({
                nickname: userNickname,
                color: userColor,
                text: message,
                timestamp: Date.now()
            });
            chatInput.value = "";
        }
    });

    // Allow pressing Enter to send a message
    chatInput.addEventListener("keyup", function(e) {
        if (e.key === "Enter") {
            sendButton.click();
        }
    });
});