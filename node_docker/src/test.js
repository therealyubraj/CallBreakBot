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

let playerCard = ['5D', '6D', 'QD', '1D'];

let otherCard = ['TD', '2D', '3D'];

let unplayedCards = ['KD', '3C', '4C'];

let mainBoard = new Board();
let playerOrder = ['Bot 1', 'Bot 2', 'Bot 3', 'Bot 4'];

mainBoard.setPlayersOrder(playerOrder);
mainBoard.setPlayerCards(playerOrder[1], playerCard);
mainBoard.setPlayerCards(playerOrder[2], otherCard);

mainBoard.unplayedCards = unplayedCards;
mainBoard.handStarter = playerOrder[0];
mainBoard.addToHistory(['2C', '2S', '5S', '3C']);
let turnCards = ['JD'];
mainBoard.setThrownCards(turnCards, playerOrder[0]);
mainBoard.readyChildren();
// console.log(mainBoard.children[0]);
let move = monteCarlo(mainBoard, 100, playerOrder[1]);
console.log(move);