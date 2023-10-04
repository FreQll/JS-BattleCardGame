<h1>Marvel Card Masters</h1>
To install the game and run it at your place, first you need to install the necessary packages with the command:

```npm i``` and then you can run it with the command: ```node index.js```

And then you can see our game by address ```localhost:3000```

<i>Before start you probably need to run this line of code so it will correctly work with Database: </i> ```mysql -p dbname -u > db.sql```

<h1>Gameplay</h1>

![gameplay](https://github.com/FreQll/Card-game/assets/62791316/2e5dc0a1-4ce0-4dce-8157-38d2d233bb27)

<h1>Game Rules</h1>

<h3>Objective:</h3>
<p>
  The objective of the game is to reduce your opponent's base HP to
  zero while protecting your own base.
</p>


<h3>Setup:</h3>
<p>
Each player starts with 6 cards in their hand. Each card has three
values: mana cost (MC), card name, and attack (ATK). The mana cost
represents the amount of mana required to play the card, and the
attack value represents the amount of HP the card deals to the
opponent's base (<i
>or gains for your own base if it's a negative value</i
>). Both players start with a base HP value, typically set to a
certain number, e.g., 20 HP.
</p>


<h3>Gameplay:</h3>
<p>
The game is played in turns, with each player taking one turn at a
time. At the beginning of your turn, increase your maximum mana by
1, which will be used to play cards. During your turn, you can do
the following actions:
</p>
<ul>
<li>
Play cards from your hand by paying their mana cost from your
current mana pool.
<i
>You can play as many cards as you can afford with your
available mana</i
>.
</li>
<li>
You can also choose not to attack and save your cards for later
turns.
</li>
</ul>
<p>
After taking your actions, end your turn with button <b>PASS</b>.
</p>
