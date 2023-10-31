const socket = io();
const textForm = document.querySelector("form");
const text = document.querySelector("input");
const button = document.querySelector("button");
const locationButton = document.getElementById("send-location");
const $messages = document.querySelector("#messages");

const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

textForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const textValue = e.target.elements.message.value;
  button.setAttribute("disabled", "disabled");
  socket.emit("sendMessage", textValue, () => {
    button.removeAttribute("disabled");
    text.value = "";
    text.focus();
    console.log("sent");
  });
});

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoscroll = () => {
  //New message element
  const $newMessage = $messages.lastElementChild;

  //Height of the last message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin=parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight+newMessageMargin;

const visibleHeight=$messages.offsetHeight;

//height of messages container
const containerHeight =$messages.scrollHeight;

//how far have I scrolled?
const scrollOffset=$messages.scrollTop +visibleHeight;
if(containerHeight-newMessageHeight<=scrollOffset){
$messages.scrollTop=$messages.scrollHeight
}
  console.log(newMessageStyles);
};

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });
  document.querySelector("#sidebar").innerHTML = html;
});

socket.on("message", (msg) => {
  // console.log(`Message received: ${msg.text}`);
  const html = Mustache.render(messageTemplate, {
    userName: msg.userName,
    message: msg.text,
    createdAt: moment(msg.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("locationMessage", (msg) => {
  console.log(msg);
  const html = Mustache.render(locationTemplate, {
    userName: msg.userName,
    url: msg.url,
    createdAt: moment(msg.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

document.getElementById("send-location").addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      () => {
        locationButton.removeAttribute("disabled");
        console.log("sent location");
      }
    );
    locationButton.setAttribute("disabled", "disabled");
  });
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
