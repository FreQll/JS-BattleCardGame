let array = [
    {
      id: 1,
      name: "Absorbing Man",
      src: "./images/absorbing-man.webp",
      cost: 4,
      attack: 4
    },
    {
      id: 2,
      name: "Black Panther",
      src: "./images/black-panther.webp",
      cost: 5,
      attack: 4
    },
    {
      id: 3,
      name: "Blue Marvel",
      src: "./images/blue-marvel.webp",
      cost: 5,
      attack: 3
    },
    {
      id: 4,
      name: "Brood",
      src: "./images/brood.webp",
      cost: 3,
      attack: 2
    },
    {
      id: 5,
      name: "Captain Marvel",
      src: "./images/captain-marvel.webp",
      cost: 4,
      attack: 4
    },
    {
      id: 6,
      name: "Deadpool",
      src: "./images/deadpool.webp",
      cost: 1,
      attack: 1
    }];
const turnTime = 10;

function gameRoom(firstSocket, secondSocket, {timerID}) {

    let turn = true;
    let timer = turnTime;
    firstSocket.emit('game_start', {turn: turn, cards: array});
    secondSocket.emit('game_start', {turn: !turn, cards: array});
    timerID = setInterval(() => {
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
    firstSocket.on('next_turn', () => {
        if(!turn){
            return;
        }
        turn = !turn;
        firstSocket.emit('turn', {turn: turn});
        secondSocket.emit('turn', {turn: !turn});
        timer = turnTime;
    });
    secondSocket.on('next_turn', () => {
        if(turn){
            return;
        }
        turn = !turn;
        firstSocket.emit('turn', {turn: turn});
        secondSocket.emit('turn', {turn: !turn});
        timer = turnTime;
    });
}
module.exports = gameRoom;