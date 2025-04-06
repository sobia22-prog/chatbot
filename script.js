const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatBox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");


let userMessage;
const inputInitHeight = chatInput.scrollHeight;

const scrollToBottom = () => {
  chatBox.scrollTo({
    top: chatBox.scrollHeight + 100, // push beyond the height
    behavior: "smooth"
  });
};

const createChatLi = (message, className) => {
  // Create a chat <li> element with passed message and className
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi;
}

const generateResponse = () => {
  const API_KEY = "AIzaSyAhvwpRJWMC2KT3K4mDEhwVpzFmC_JpC9o";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${API_KEY}`;

  const messageElement = document.querySelector(".chatbox .incoming:last-child p");

  const requestBody = {
    contents: [
      {
        parts: [{ text: userMessage }]
      }
    ]
  };

  fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  })
    .then(res => res.json())
    .then(data => {
      messageElement.classList.remove("error"); // clear error class if it was previously added
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Oops! Something went wrong.";
      messageElement.textContent = reply;
    })
    .catch(err => {
      messageElement.classList.add("error");
      messageElement.textContent = "Error: " + err.message;
    });
};


const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;
  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;
  console.log(userMessage);

  // Append the user's message to chatbox
  chatBox.appendChild(createChatLi(userMessage, "outgoing"));
  scrollToBottom(); // 👈 auto-scroll after AI response or error

  setTimeout(() => {
    // Display thinking message while waiting for reply
    chatBox.appendChild(createChatLi("Thinking...", "incoming"));
    generateResponse();
    scrollToBottom();
  }, 600)
}

chatInput.addEventListener("input", () => {
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
})

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleChat();
  }
})

sendChatBtn.addEventListener("click", handleChat)
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"))
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"))