const turnTime = 30;
const hp = 20;
const cardsData = async () => await getCards();

const array = async () =>
  await [...(await cardsData()).cards, ...(await cardsData()).cards];

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function getCards() {
  try {
    const filePath = "http://localhost:3000/cards.json";
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const cardData = await response.json();
    return cardData;
  } catch (error) {
    //console.error("Error fetching JSON:", error);
  }
}

function coinToss() {
  return Math.random() < 0.5;
}

async function gameRoom(firstSocket, secondSocket) {
  let turn = coinToss();
  let timer = turnTime;
  let firstHand = [];
  let secondHand = [];
  let firstMana = 1;
  let secondMana = 1;
  let enemyHp = hp;
  let myHp = hp;
  let firstManaLimit = 1;
  let secondManaLimit = 1;
  const cardArray = await array();

  for (let i = 0; i < 6; i++) {
    firstHand.push(cardArray[randomIntFromInterval(0, cardArray.length - 1)]);
    cardArray.splice(cardArray.indexOf(firstHand[i]), 1);

    secondHand.push(cardArray[randomIntFromInterval(0, cardArray.length - 1)]);
    cardArray.splice(cardArray.indexOf(secondHand[i]), 1);
  }

  firstSocket.emit("game_start", {
    turn: turn,
    cards: array,
    firstHand: firstHand,
    secondHand: secondHand,
    myHp: myHp,
    enemyHp: enemyHp,
    firstMana: firstMana,
    secondMana: secondMana,
    deck_length: cardArray.length,
  });
  secondSocket.emit("game_start", {
    turn: !turn,
    cards: array,
    firstHand: secondHand,
    secondHand: firstHand,
    myHp: enemyHp,
    enemyHp: myHp,
    firstMana: secondMana,
    secondMana: firstMana,
    deck_length: cardArray.length,
  });

  firstSocket.emit("turn", {
    turn: turn,
    firstMana: firstMana,
    secondMana: secondMana,
  });
  secondSocket.emit("turn", {
    turn: !turn,
    firstMana: secondMana,
    secondMana: firstMana,
  });

  let timerI = setInterval(() => {
    firstSocket.emit("timer", { timer: timer });
    secondSocket.emit("timer", { timer: timer });
    if (timer === 0) {
      nextTurn();
    } else {
      timer--;
    }
  }, 1000);

  secondSocket.request.session.data.timerI = timerI;

  function nextTurn() {
    firstSocket.emit("timer", { timer: timer });
    secondSocket.emit("timer", { timer: timer });

    if (firstManaLimit < 10) {
      if (turn) {
        secondManaLimit++;
        secondMana = secondManaLimit;
      } else {
        firstManaLimit++;
        firstMana = firstManaLimit;
      }
    }

    if (turn && secondHand.length < 10) {
      secondHand.push(
        cardArray[randomIntFromInterval(0, cardArray.length - 1)]
      );
      cardArray.splice(cardArray.indexOf(secondHand[secondHand.length]), 1);
    } else if (!turn && firstHand.length < 10) {
      firstHand.push(cardArray[randomIntFromInterval(0, cardArray.length - 1)]);
      cardArray.splice(cardArray.indexOf(firstHand[firstHand.length]), 1);
    }

    firstSocket.emit("mana", { firstMana: firstMana, secondMana: secondMana });
    secondSocket.emit("mana", { firstMana: secondMana, secondMana: firstMana });
    firstSocket.emit("take_card", { myHand:  firstHand, enemyHand: secondHand, deck_length: cardArray.length });
    secondSocket.emit("take_card", { myHand: secondHand, enemyHand: firstHand, deck_length: cardArray.length });

    turn = !turn;
    firstSocket.emit("turn", {
      turn: turn,
      firstMana: firstMana,
      secondMana: secondMana,
    });
    secondSocket.emit("turn", {
      turn: !turn,
      firstMana: secondMana,
      secondMana: firstMana,
    });
    timer = turnTime;
  }

  firstSocket.on("next_turn", () => {
    if (!turn) {
      return;
    }
    //console.log(firstMana);
    nextTurn();
  });

  secondSocket.on("next_turn", () => {
    if (turn) {
      return;
    }
    //console.log(secondMana);
    nextTurn();
  });

  firstSocket.on("play_card", (data) => {
    if (!turn) {
      return;
    }
    if (firstMana < data.cost) {
      return;
    }
    firstMana -= data.cost; 
    //attack logic
    if (data.attack < 0) {
      myHp + Math.abs(data.attack) >= 25
        ? (myHp = 25)
        : (myHp += Math.abs(data.attack));
    } else {
      enemyHp -= data.attack;
    }

    //console.log(enemyHp);

    if (enemyHp <= 0) {
      clearInterval(firstSocket.request.session.data.timerI);
      clearInterval(secondSocket.request.session.data.timerI);

      firstSocket.emit("game_over", { winner: true });
      secondSocket.emit("game_over", { winner: false });
    }

    firstSocket.emit("mana", { firstMana: firstMana, secondMana: secondMana });
    secondSocket.emit("mana", { firstMana: secondMana, secondMana: firstMana });
    firstSocket.emit("hp", { myHp: myHp, enemyHp: enemyHp });
    secondSocket.emit("hp", { myHp: enemyHp, enemyHp: myHp });
    firstHand.splice(firstHand.indexOf(data), 1);
    secondSocket.emit("play_card", {
      cards: firstHand,
      myHp: myHp,
      enemyHp: enemyHp,
    });
  });

  secondSocket.on("play_card", (data) => {
    if (turn) {
      return;
    }
    if (secondMana < data.cost) {
      return;
    }
    //attack logic
    if (data.attack < 0) {
      enemyHp + Math.abs(data.attack) >= 25
        ? (enemyHp = 25)
        : (enemyHp += Math.abs(data.attack));
    } else {
      myHp -= data.attack;
    }

    if (myHp <= 0) {
      clearInterval(firstSocket.request.session.data.timerI);
      clearInterval(secondSocket.request.session.data.timerI);

      firstSocket.emit("game_over", { winner: false });
      secondSocket.emit("game_over", { winner: true });
    }

    secondMana -= data.cost;
    firstSocket.emit("mana", { firstMana: firstMana, secondMana: secondMana });
    secondSocket.emit("mana", { firstMana: secondMana, secondMana: firstMana });
    firstSocket.emit("hp", { myHp: myHp, enemyHp: enemyHp });
    secondSocket.emit("hp", { myHp: enemyHp, enemyHp: myHp });
    secondHand.splice(secondHand.indexOf(data), 1);
    firstSocket.emit("play_card", {
      cards: secondHand,
      myHp: enemyHp,
      enemyHp: myHp,
    });
  });
}
module.exports = gameRoom;
