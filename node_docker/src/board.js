import {
    Card
} from './card.js';
import {
    Player
} from './player.js';

export class Board {
    /**
     * 
     * @param {Card[]} moves 
     * @param {Card[]} possibleMoves 
     */
    constructor() {
        this.thrownCards = [];
        this.handStarter = "";
        this.playersOrder = [];
        /**
         * @type Object.<string, Player>
         */
        this.players = {};
        this.score = 0;
        this.visits = 0;
        this.expanded = false;
        this.parent = null;
        this.gameNumber = -1;

        this.history = [];
        this.historyNumber = {
            'C': 0,
            'H': 0,
            'S': 0,
            'D': 0
        };

        /**
         * @type Board[]
         */
        this.children = [];
    }

    setPlayersOrder(playersOrder) {
        this.playersOrder = playersOrder;
        this.playersOrder.forEach((p, i) => {
            this.players[p] = new Player(p, this.playersOrder[(i + 1) % this.playersOrder.length]);
        });
    }

    setPlayerCards(playerId, cards) {
        console.log(this.players);
        this.players[playerId].setCards(cards);
    }

    setThrownCards(cards, pId) {
        this.thrownCards = cards.map(c => new Card(c));
        this.handStarter = pId;

        //calculate the original hand starter, there are 4 cards in the hand
        for (let i = 0; i < 4 - this.thrownCards.length; i++) {
            this.handStarter = this.players[this.handStarter].nextPlayerId;
        }

    }

    readyChildren() {
        this.children = [];
    }

    addToHistory(lasthistory) {
        this.history.push(lasthistory);
        this.history[this.history.length - 1][1].map(a => new Card(a));
        this.history[this.history.length - 1][1].forEach(c => {
            this.historyNumber[c.suit.code]++;
        });
    }

    getBid(pId) {
        return this.players[pId].getBid();
    }

    startNewGame() {
        this.gameNumber++;
        this.history = [];
        this.historyNumber = {
            'C': 0,
            'H': 0,
            'S': 0,
            'D': 0
        };
        this.thrownCards = [];
        this.score = 0;
        this.visits = 0;
        this.expanded = false;
        this.parent = null;
        this.children = [];
    }

    getUCB(total) {
        if (this.visits == 0) {
            return Infinity;
        }
        return (this.score / this.visits) + 2 * Math.sqrt(Math.log(total) / this.visits);
    }

    rollOut() {

    }
}