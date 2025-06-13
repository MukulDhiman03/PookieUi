const chatMessages = document.getElementById("chatMessages");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendMessageButton");

sendButton.addEventListener("click", handleSendMessage);
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSendMessage();
});

function appendMessage(content, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);
  messageDiv.textContent = content;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function handleSendMessage() {
  const userMessage = messageInput.value.trim();
  if (!userMessage) return;

  appendMessage(userMessage, "user");
  messageInput.value = "";

  // Show loading indicator
  const loading = document.createElement("div");
  loading.className = "message ai loading-indicator";
  loading.textContent = "Likh rhi hu babu...";
  chatMessages.appendChild(loading);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    const res = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await res.json();
    loading.remove(); // Remove loading indicator

    if (res.ok) {
      appendMessage(data.response, "ai");
    } else {
      appendMessage("Error: " + (data.error || "Something went wrong"), "ai");
    }
  } catch (err) {
    loading.remove();
    appendMessage("Error: Could not connect to server", "ai");
    console.error(err);
  }
}
