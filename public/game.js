const socket = io();

let myLogin = "";
let opLogin = "";
let timer;

socket.on("waiting_for_opponent", () => {
  document.getElementById("waiting_for_opponent").style.display = "block";
});

socket.on("opponent_connected", (data) => {
    opLogin = data.opLogin;
    myLogin = data.myLogin;
    document.getElementById("waiting_for_opponent").style.display = "none";
    document.getElementById("opponent_login").style.display = "block";
    document.getElementById("opponent").textContent = opLogin;
});

socket.on("opponent_disconnected", () => {
  console.log("opponent_disconnected");
  document.getElementById("game_board").style.display = "none";
  document.getElementById("opponent_disconnected").style.display = "block";
  document.getElementById("loading-container").style.display = "block";
});

socket.on("disconnect", () => {
  document.location.href = "/login";
});

socket.on("err_second_window", () => {
  console.log("err_second_window");
  document.getElementById("err_second_window").style.display = "block";
});

socket.on("err_not_enough_money", () => {
  console.log("err_not_enough_money");
  document.getElementById("err_not_enough_money").style.display = "block";
});

socket.on("game_start", (data) => {
  console.log(`game_start: ${data.turn}`);
  document.getElementById("game_board").style.display = "block";
  document.getElementById("loading-container").style.display = "none";

  data.firstHand.forEach((element) => {
    const image = document.createElement("img");
    console.log(element)
    image.src = element.src;
    document.getElementById("cards").appendChild(image);
  });

  data.secondHand.forEach((element) => {
    const image = document.createElement("img");
    image.src = element.src;
    document.getElementById("enemy-cards").appendChild(image);
  });
});

socket.on("timer", (data) => {
    document.getElementById("timer").innerText = data.timer;
});

socket.on("turn", (data) => {
    if (data.turn) {
        document.getElementById("turn_nickname").innerText = myLogin + " turn";
    } else {
        document.getElementById("turn_nickname").innerText = opLogin + " turn";
    }
});

function passOnClick() {
    socket.emit('next_turn');
}
