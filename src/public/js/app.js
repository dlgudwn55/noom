const socket = io();

const welcome = document.getElementById("welcome");
const form = document.getElementById("nickname-and-room-name")
const room = document.getElementById("room");
room.hidden = true;

let roomName;

function addMessage(message) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`You: ${value}`);
    });
    input.value = "";
}

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
    const msgForm = room.querySelector("#msg");
    msgForm.addEventListener("submit", handleMessageSubmit);
}

function handleNicknameAndRoomSubmit(event) {
    event.preventDefault();
    const submittedNickname = document.getElementById("nickname");
    const submittedRoomName = document.getElementById("room-name")
    socket.emit("nickname", submittedNickname.value);
    socket.emit("roomName", submittedRoomName.value);
    socket.emit("enter_room", submittedNickname.value, submittedRoomName.value, showRoom);
    roomName = submittedRoomName.value;
    // input.value = "";
}

form.addEventListener("submit", handleNicknameAndRoomSubmit);

socket.on("welcome", (user) => {
    addMessage(`${user} arrived`);
})

socket.on("bye", (left) => {
    addMessage(`${left} left`);
})

socket.on("new_message", addMessage);