const socket = io();

let myLogin = "";
let opLogin = "";
let timer;
let myMana;

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
  myMana = data.firstMana;
  document.getElementById("game_board").style.display = "block";
  document.getElementById("loading-container").style.display = "none";

  data.firstHand.forEach((element) => {
    renderCard(element); //! Нужно пофиксить, игрок вне своего хода может кидать карту если хватает маны
  });

  data.secondHand.forEach(() => {
    renderCardBack();
  });

  document.getElementById("enemy-name").innerText = opLogin;
  document.getElementById("my-name").innerText = myLogin;

  document.getElementById("enemy-portrait").src = "/avatar/" + opLogin + ".jpg"
  document.getElementById("my-portrait").src = "/avatar/" + myLogin + ".jpg"

  document.getElementById("enemy-hp").innerText = data.enemyHp + " HP";
  document.getElementById("my-hp").innerText = data.myHp + " HP";
  document.getElementById("enemy-mana").innerText = data.secondMana + " Mana";
  document.getElementById("my-mana").innerText = data.firstMana + " Mana";
});

socket.on("timer", (data) => {
  document.getElementById("timer").innerText = data.timer;
});

socket.on("turn", (data) => {
  if (data.turn) {
    document.getElementById("turn_nickname").innerText = myLogin + " turn";
    document.getElementById("enemy-mana").innerText = data.secondMana + " Mana";
    document.getElementById("my-mana").innerText = data.firstMana + " Mana";
    
  } else {
    document.getElementById("turn_nickname").innerText = opLogin + " turn";
    document.getElementById("enemy-mana").innerText = data.secondMana + " Mana";
    document.getElementById("my-mana").innerText = data.firstMana + " Mana";
    
  }
});

socket.on("mana", (data) => {
  myMana = data.firstMana;
  document.getElementById("my-mana").innerText = data.firstMana + " Mana";
  document.getElementById("enemy-mana").innerText = data.secondMana + " Mana";
});

function passOnClick() {
  socket.emit("next_turn");
}

const playCard = (card) => {
  
  socket.emit("play_card", card);
  
}

socket.on("play_card", (data) => {
  document.getElementById("enemy-cards").innerHTML = "";
  data.forEach(() => {
    renderCardBack();
  });
});

const renderCard = (card) => {
  const image = document.createElement("img");
  console.log(card);
  image.src = card.src;
  image.addEventListener("click", (event) => {
    console.log(myMana + " " + card.cost)
    if (myMana < card.cost) {
      return;
    }
    else {  
      //! animation for playing card
      playCard(card);
      event.currentTarget.remove();
    }
  });
  document.getElementById("cards").appendChild(image);
}

const renderCardBack = () => {
  const image = document.createElement("img");
  image.src = "/images/card-back.png";
  document.getElementById("enemy-cards").appendChild(image);
}
