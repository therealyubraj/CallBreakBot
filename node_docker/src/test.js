import {
    Player
} from './player.js';

import {
    bestMoveChooser
} from './search.js';

let cards = ["1S", "7S", "6S", "3S", "2S", "1H", "JH", "5H", "JC", "TC", "2C"];

let turnCards = [

];

let history = [

];

let a = new Player(cards);
a.calledBid = 4;
a.wonHands = 2;
a.addToHistory(history);
console.log(a.getBid());
console.log(bestMoveChooser(a, turnCards));