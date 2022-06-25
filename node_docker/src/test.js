let time = {};
import {
    performance
} from 'perf_hooks';

import {
    Board
} from './board.js';
import {
    Card
} from './card.js';
import {
    Player
} from './player.js';

import {
    monteCarlo
} from './search.js';

let playerCard = ['KS', 'QS', '9C', '2S', '1C', '2C', '5C', '6C', '1H', '2H', '3H', '5H', '6H'];
playerCard = playerCard.map(c => new Card(c));

let mainBoard = new Board();
let playerOrder = ['P0', 'Bot 2', 'Bot 3', 'Bot 4'];
let ourPlayer = playerOrder[0];

mainBoard.setPlayersOrder(playerOrder);
mainBoard.setPlayerCards(ourPlayer, playerCard);

mainBoard.handStarter = playerOrder[3];

let turnCards = ['JD'];
turnCards = turnCards.map(c => new Card(c));

mainBoard.setThrownCards(turnCards, ourPlayer);

mainBoard.readyChildren();
// console.log(mainBoard.children[0]);
let move = monteCarlo(mainBoard, 100, ourPlayer);
console.log(move);