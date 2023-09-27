const turnTime = 10;
const cardsData = async () => await getCards();
const array = async () => await [...(await cardsData()).cards, ...(await cardsData()).cards];

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function getCards() {
    try {
      const filePath = "http://localhost:3000/cards.json";
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const cardData = await response.json();
      return cardData;
    } catch (error) {
      console.error("Error fetching JSON:", error);
    }
  }


async function gameRoom(firstSocket, secondSocket) {

    let turn = true;
    let timer = turnTime;
    let firstHand = [];
    let secondHand = [];

    for (let i = 0; i < 6; i++) {
      const firstCard = await array();
      firstHand.push(firstCard[randomIntFromInterval(0, firstCard.length - 1)]);
      firstCard.splice(firstCard.indexOf(firstHand[i]), 1);
    
      const secondCard = await array();
      secondHand.push(secondCard[randomIntFromInterval(0, secondCard.length - 1)]);
      secondCard.splice(secondCard.indexOf(secondHand[i]), 1);
    }

    firstSocket.emit('game_start', {turn: turn, cards: array, firstHand: firstHand, secondHand: secondHand});
    secondSocket.emit('game_start', {turn: !turn, cards: array, firstHand: secondHand, secondHand: firstHand});

    firstSocket.emit('turn', {turn: turn});
    secondSocket.emit('turn', {turn: !turn});

    let timerI = setInterval(() => {
        firstSocket.emit('timer', {timer: timer});
        secondSocket.emit('timer', {timer: timer});
        if(timer === 0){
            turn = !turn;
            firstSocket.emit('turn', {turn: turn});
            secondSocket.emit('turn', {turn: !turn});
            timer = turnTime;
        }
        else{
            timer--;
        }
    }, 1000);
    secondSocket.request.session.data.timerI = timerI;
    function nextTurn() {
      firstSocket.emit('timer', {timer: timer});
      secondSocket.emit('timer', {timer: timer});

      turn = !turn;
      firstSocket.emit('turn', {turn: turn});
      secondSocket.emit('turn', {turn: !turn});
      timer = turnTime;
    }

    firstSocket.on('next_turn', () => {
        if (!turn) {
            return;
        }
        nextTurn();
    });

    secondSocket.on('next_turn', () => {
        if(turn){
            return;
        }
        nextTurn();
    });
}
module.exports = gameRoom;