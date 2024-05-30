'use strict'
var socket = null;

function displayMessage(name, message) {
  const isAdmin = name == "chatgpt_admin";
  var messageList = document.getElementById('chatContainer');
  var newElement = isAdmin ? document.getElementById('exampleGPT').cloneNode(true) : document.getElementById('exampleYou').cloneNode(true);
  newElement.removeAttribute('hidden');
  messageList.appendChild(newElement);

  var messageLabel = newElement.querySelector('.itemMessage');
  messageLabel.innerText  = "";

  var nestedElement = document.getElementById("chatContainer");
  nestedElement.scrollTo(0, nestedElement.scrollHeight);

  if (isAdmin) {
    updatePartial(messageLabel, message);
  } else {
    messageLabel.innerText  = message;
  }
}

function setupSocket() {
  const urlParams = new URLSearchParams(window.location.search);
  const isAdmin = urlParams.get('admin');
  const teamName = urlParams.get('car');

  var serverUrl;
  var scheme = 'ws';
  var location = document.location;

  if (location.protocol === 'https:') {
    scheme += 's';
  }

  serverUrl = `${scheme}://${location.hostname}:${location.port}`;

  socket = new WebSocket(serverUrl, 'json');
  
  socket.onmessage = event => {
    const msg = JSON.parse(event.data);
    const teamName = urlParams.get('car');
    console.log(msg.team, teamName)
    if (msg.team === teamName) {
      displayMessage(msg.name, msg.message);
    }
  }
  socket.onclose = function(){
    socket = null;
    document.querySelector("#header-jury").innerText += "dc";
  };
}

function connect() {
  const urlParams = new URLSearchParams(window.location.search);
  const isAdmin = urlParams.get('admin');
  const teamName = urlParams.get('car');
  const validTeams = ["red", "black", "yellow", "blue"];
  if (!validTeams.includes(teamName)) {
    window.location.href = "/";
    return;
  }
  document.querySelector("#header-jury").innerText += " (" + teamName + ")";
  
  if (!isAdmin) {
    displayMessage("chatgpt_admin", "Hi! I'm JuryGPT, and I'll be your jury today. Based on my record, "+
      "we need to decide if you, the defendant for team " + teamName + ", are guilty or not guilty of the charges being brought against you. " + 
      "According to the reliable Doc Hudson, it seems like you have several charges being brought against you.\n\n"+
      "The first is vandalism, or large-scale destruction of public property via a slip-n-slide activity. The next is interference with public infrastructure, by damaging roads and preventing individual's access to their livelihoods. Finally, there is the destruction of cultural heritage, for destroying the sentimental momuments in Radiator Springs with water balloons.\n\n" + 
      "We begin with the arraignment. You must enter a plea of guilty or not guilty. What do you plea?")
  }

  $('#submitForm').submit(sendMessage);

  document.body.addEventListener('keydown', (event) => {
    if(event.key === "Enter") {
      sendMessage();
      event.preventDefault();
      return false;
    }
  });

  setupSocket();
}

function checkSocket() {
  if (!socket) {
    setupSocket();
  }
}

window.onfocus = checkSocket;

function updatePartial(element, s) {
  var portion = 5;
  var begin = s.substring(0, portion);
  var rest = s.substring(portion);
  element.innerText  += begin;
  var nestedElement = document.getElementById("chatContainer");
  nestedElement.scrollTo(0, nestedElement.scrollHeight);
  if (rest != "") {
    setTimeout(() => updatePartial(element, rest), 50);
  }
}

function sendMessage() {
  const urlParams = new URLSearchParams(window.location.search);
  const isAdmin = urlParams.get('admin');
  const teamName = urlParams.get('car');
  
  if (!$('#prompt-textarea').val()) {
    return false;
  }

  if (isAdmin !== "chatgpt_admin" && $('#prompt-textarea').val() === "secretpassword") {
    urlParams.set("admin", "chatgpt_admin");
    window.location.search = urlParams;
  }

  sendMessageHelper(isAdmin ? "chatgpt_admin" : "user", $('#prompt-textarea').val(), teamName);
  $('#prompt-textarea').val('');

  return false;
}

function sendMessageHelper(name, message, team) {
  const msg = { type: 'message', name: name, message: message, team: team };
  checkSocket();
  socket.send(JSON.stringify(msg));
}