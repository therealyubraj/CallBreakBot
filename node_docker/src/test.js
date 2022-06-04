import {
    Player
} from './player.js';

import {
    bestMoveChooser
} from './search.js';

let cards = ["1S", "7S", "6S", "3S", "2S", "QH", "JH", "5H", "2C"];

let turnCards = [

];

let history = [

];

let a = new Player(cards);
a.addToHistory(history);
console.log(a.getBid());
console.log(bestMoveChooser(a, turnCards));