const socket = io();

let myLogin = "";
let opLogin = "";
let timer;
let myMana;
turn = false;

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
  turn = data.turn;
  myMana = data.firstMana;
  document.getElementById("game_board").style.display = "block";
  document.getElementById("loading-container").style.display = "none";
  document.getElementById("card-deck").setAttribute("title", data.deck_length + " cards left");

  data.firstHand.forEach((element) => {
    renderCard(element); //! Нужно пофиксить, игрок вне своего хода может кидать карту если хватает маны
  });

  data.secondHand.forEach(() => {
    renderCardBack();
  });

  document.getElementById("enemy-name").innerText = opLogin;
  document.getElementById("my-name").innerText = myLogin;

  document.getElementById("enemy-portrait").src = "/avatar/" + opLogin + ".jpg";
  document.getElementById("my-portrait").src = "/avatar/" + myLogin + ".jpg";

  document.getElementById("enemy-hp").innerText = data.enemyHp;
  document.getElementById("my-hp").innerText = data.myHp;
  document.getElementById("enemy-mana").innerText = data.secondMana + " Mana";
  document.getElementById("my-mana").innerText = data.firstMana + " Mana";
});

socket.on("timer", (data) => {
  document.getElementById("timer").innerText = data.timer;
});

socket.on("turn", (data) => {
  turn = data.turn;
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

socket.on("hp", (data) => {
  document.getElementById("my-hp").innerText = data.myHp;
  document.getElementById("enemy-hp").innerText = data.enemyHp;
});

socket.on("take_card", (data) => {
  document.getElementById("cards").innerHTML = "";
  document.getElementById("enemy-cards").innerHTML = "";
  document.getElementById("card-deck").setAttribute("title", data.deck_length + " cards left");
  data.myHand.forEach((element) => {
    renderCard(element);
  });
  data.enemyHand.forEach(() => {
    renderCardBack();
  });
})

function passOnClick() {
  socket.emit("next_turn");
}

const playCard = (card) => {
  socket.emit("play_card", card);
};

socket.on("play_card", (data) => {
  document.getElementById("enemy-cards").innerHTML = "";
  data.cards.forEach(() => {
    renderCardBack();
  });
});

const renderCard = (card) => {
  const image = document.createElement("img");
  image.src = card.src;
  image.classList.add('card');
  image.addEventListener("click", (event) => {
    if (myMana < card.cost || !turn) {
      return;
    } else {
      //! animation for playing card
      playCard(card);
      event.currentTarget.remove();
    }
  });
  document.getElementById("cards").appendChild(image);
};

const renderCardBack = () => {
  const image = document.createElement("img");
  image.src = "/images/card-back.png";
  document.getElementById("enemy-cards").appendChild(image);
};

socket.on("game_over", (data) => {
  document.getElementById("game_over").style.display = "block";

  document.getElementById("game_over").style.display = "block";

  document.querySelector("body").style.overflow = 'hidden'

  if (data.winner) {
    document.getElementById("game_over_message").innerText = "You win";
  } else {
    document.getElementById("game_over_message").innerText = "You lose";
  }
})