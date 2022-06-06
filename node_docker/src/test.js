let time = {};
import {
    performance
} from 'perf_hooks';

import {
    Board
} from './board.js';

import {
    monteCarlo
} from './search.js';

// "actions": [{
//     "started": 2,
//     "cards": ["4S", "TS", "1S", "2S"],
//     "ended": 0
// }, {
//     "started": 0,
//     "cards": ["2C", "1C", "7C", "TC"],
//     "ended": 1
// }, {
//     "started": 1,
//     "cards": ["8H", "9H", "3H", "1H"],
//     "ended": 0
// }, {
//     "started": 0,
//     "cards": ["8C", "JC", "KC", "4C"],
//     "ended": 2
// }, {
//     "started": 2,
//     "cards": ["KS", "9S", "6S", "7S"],
//     "ended": 2
// }, {
//     "started": 2,
//     "cards": ["3S", "5S", "8S", "QS"],
//     "ended": 1
// }, {
//     "started": 1,
//     "cards": ["7H", "KH", "2H", "4H"],
//     "ended": 2
// }, {
//     "started": 2,
//     "cards": ["2D", "QD", "9D", "KD"],
//     "ended": 1
// }, {
//     "started": 1,
//     "cards": ["JH", "6H", "5C", "QH"],
//     "ended": 0
// }, {
//     "started": 0,
//     "cards": ["5H", "TH", "6C", "JD"],
//     "ended": 1
// }, {
//     "started": 1,
//     "cards": ["JS", "9C", "TD", "5D"],
//     "ended": 1
// }

time.startTime1 = performance.now();

let cards = ["4H", "3H"];


let turnCards = [
    '6H'
];

let history = [
    //actions from the game
    ['4S', 'TS', '1S', '2S'],
    ['2C', '1C', '7C', 'TC'],
    ['8H', '9H', '3H', '1H'],
    ['8C', 'JC', 'KC', '4C'],
    ['KS', '9S', '6S', '7S'],
    ['3S', '5S', '8S', 'QS'],
    ['7H', 'KH', '2H', '4H'],
    ['2D', 'QD', '9D', 'KD'],
    ['JH', '6H', '5C', 'QH'],
    ['5H', 'TH', '6C', 'JD'],
    ['JS', '9C', 'TD', '5D']
];

let playerIds = ["Bot 1", "Uvryptic1", "Bot 0", "Uvryptic2"];

let mainBoard = new Board();

time.startTime = performance.now();

mainBoard.setPlayersOrder(playerIds);

mainBoard.setPlayerCards('Uvryptic1', cards);

let bidValue = mainBoard.getBid('Uvryptic1');

console.log(bidValue);

history.forEach(h => {
    mainBoard.addToHistory(h);

    let context = {
        'Bot 1': {
            'totalPoints': Math.floor(Math.random() * 5),
            'bid': Math.floor(Math.random() * 5),
            'won': Math.floor(Math.random() * 5)
        },
        'Uvryptic1': {
            'totalPoints': Math.floor(Math.random() * 5),
            'bid': Math.floor(Math.random() * 5),
            'won': Math.floor(Math.random() * 5)
        },
        'Bot 0': {
            'totalPoints': Math.floor(Math.random() * 5),
            'bid': Math.floor(Math.random() * 5),
            'won': Math.floor(Math.random() * 5)
        },
        'Uvryptic2': {
            'totalPoints': Math.floor(Math.random() * 5),
            'bid': Math.floor(Math.random() * 5),
            'won': Math.floor(Math.random() * 5)
        }
    };

    mainBoard.updatePlayerInfo(context);
});

mainBoard.startNewHand();
mainBoard.setThrownCards(turnCards, "Uvryptic1");
console.log(mainBoard.unplayedCards);
mainBoard.readyChildren();
let bestMove = monteCarlo(mainBoard, 100, "Uvryptic1");
console.log(
    mainBoard.children.map(child => {
        {
            return {
                cards: child.thrownCards.map(card => card.toString()).join(", "),
                score: child.score,
                visits: child.visits,
            }
        }
    }));

console.log(bestMove);
console.log(time);