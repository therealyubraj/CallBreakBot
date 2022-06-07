import {
    allCards,
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
        this.startNewGame();
    }

    setPlayersOrder(playersOrder) {
        this.startNewGame();
        this.playersOrder = playersOrder;
        this.gameNumber = 1;
        this.players = {};
        this.playersOrder.forEach((p, i) => {
            this.players[p] = new Player(p, this.playersOrder[(i + 1) % this.playersOrder.length]);
        });
    }

    setPlayerCards(playerId, cards) {
        this.players[playerId].setCards(cards);
        //remove cards from unplayed cards
        cards.forEach(c => {
            this.unplayedCards.splice(this.unplayedCards.indexOf(c), 1);
        });
    }


    setThrownCards(cards, pId) {
        //remove thrown cards from unplayed cards
        cards.forEach(c => {
            this.unplayedCards.splice(this.unplayedCards.indexOf(c), 1);
        });
        this.thrownCards = cards.map(c => new Card(c));
        this.handStarter = pId;

        //calculate the original hand starter, there are 4 cards in the hand
        for (let i = 0; i < 4 - this.thrownCards.length; i++) {
            this.handStarter = this.players[this.handStarter].nextPlayerId;
        }
    }

    readyChildren() {
        this.expanded = true;
        this.children = [];
        if (this.thrownCards.length == 4) {
            let handWinningCard = Player.getHighestCard(this.thrownCards);
            let handWinnerIndex = 0;
            for (let i = 0; i < this.thrownCards.length; i++) {
                if (this.thrownCards[i].equals(handWinningCard)) {
                    handWinnerIndex = i;
                    break;
                }
            }

            let handWinner = this.handStarter;
            for (let i = 0; i < handWinnerIndex; i++) {
                handWinner = this.players[handWinner].nextPlayerId;
            }
            let newBoard = this.copy();
            newBoard.addToHistory(newBoard.thrownCards.map(c => c.cardString));
            newBoard.startNewHand();
            newBoard.handStarter = handWinner;
            newBoard.players[handWinner].wonHands++;

            let possibleMoves;
            // get possible moves using the hand winner
            if (newBoard.players[handWinner].cards.length == 0) {
                possibleMoves = newBoard.players[handWinner].getBotPlayableCards([], newBoard.turnHistory, newBoard.unplayedCards, newBoard.historyNumber);
            } else {
                possibleMoves = newBoard.players[handWinner].getAllPlayableCards([]).cards;
            }

            for (let card of possibleMoves) {
                let copiedBoard = newBoard.copy();
                copiedBoard.thrownCards = [card];
                copiedBoard.players[handWinner].playCard(card);
                copiedBoard.unplayedCards.splice(copiedBoard.unplayedCards.indexOf(card.cardString), 1);
                copiedBoard.parent = this;
                this.children.push(copiedBoard);
            }
            return;
        }

        // get all possible boards from this board
        let playerId = this.handStarter;
        for (let i = 0; i < this.thrownCards.length; i++) {
            playerId = this.players[playerId].nextPlayerId;
        }

        let possibleMoves;
        if (this.players[playerId].cards.length > 0) {
            possibleMoves = this.players[playerId].getAllPlayableCards(this.thrownCards).cards;
        } else {
            possibleMoves = this.players[playerId].getBotPlayableCards(this.thrownCards, this.turnHistory, this.unplayedCards, this.historyNumber);
        }

        // create a new board for each possible move
        possibleMoves.forEach(c => {
            let newBoard = this.copy();
            newBoard.thrownCards.push(c);
            newBoard.parent = this;
            newBoard.players[playerId].playCard(c);
            newBoard.unplayedCards.splice(newBoard.unplayedCards.indexOf(c.cardString), 1);
            this.children.push(newBoard);
        });
    }

    addToHistory(lastHistory) {
        //TODO: analyze the last history to better update the card numbers of bots

        lastHistory.forEach(c => {
            // if c is found in unplayed cards, remove it
            let cInd = this.unplayedCards.indexOf(c);
            if (cInd != -1) {
                this.unplayedCards.splice(cInd, 1);
            }
        });

        this.turnHistory.push(lastHistory.map(a => new Card(a)));
        this.turnHistory[this.turnHistory.length - 1].forEach(c => {
            this.historyNumber[c.suit.code]++;
        });
    }

    getBid(pId) {
        return this.players[pId].getBid();
    }

    startNewGame() {
        this.thrownCards = [];
        this.handStarter = "";
        this.playersOrder = [];
        /**
         * @type Object.<string, Player>
         */
        this.players = {};
        this.turnHistory = [];
        this.unplayedCards = [...allCards];
        this.historyNumber = {
            'C': 0,
            'H': 0,
            'S': 0,
            'D': 0
        };
        this.gameNumber = 0;

        this.score = 0;
        this.visits = 0;
        this.expanded = false;
        this.parent = null;
        /**
         * @type Board[]
         */
        this.children = [];
    }

    startNewRound() {
        this.gameNumber++;
        this.handStarter = "";
        this.turnHistory = [];
        this.unplayedCards = [...allCards];

        this.historyNumber = {
            'C': 0,
            'H': 0,
            'S': 0,
            'D': 0
        };
        this.startNewHand();
    }

    startNewHand() {
        this.thrownCards = [];
        this.score = 0;
        this.visits = 0;
        this.expanded = false;
        this.parent = null;
        this.children = [];
    }

    updatePlayerInfo(playerInfo) {
        Object.keys(playerInfo).forEach((pId, i) => {
            this.players[pId].wonHands = playerInfo[pId].won;
            this.players[pId].calledBid = playerInfo[pId].bid;
            this.players[pId].totalPoints = playerInfo[pId].totalPoints;
        });
    }

    getUCB(total) {
        if (this.visits == 0) {
            return Infinity;
        }
        return (this.score / this.visits) + 2 * Math.sqrt(Math.log(total) / this.visits);
    }

    rollOut(pId) {
        let newBoard = this.copy();
        while (newBoard.unplayedCards.length > 0) {
            // TODO: here we can optimize time by choosing random child without using readyChildren
            newBoard.readyChildren();
            let randomChildren = newBoard.children[Math.floor(Math.random() * newBoard.children.length)];
            if (!randomChildren) {
                throw new Error("No children");
                //break;
            }
            newBoard = randomChildren;
        }
        if (newBoard.players[pId].calledBid > newBoard.players[pId].wonHands) {
            return newBoard.players[pId].wonHands - newBoard.players[pId].calledBid;
        }
        return newBoard.players[pId].wonHands;
    }

    playCard(card, pId) {
        this.players[pId].playCard(card);
    }

    copy() {
        let newBoard = new Board();
        newBoard.children = [];
        newBoard.thrownCards = [...this.thrownCards];
        newBoard.handStarter = this.handStarter;
        newBoard.playersOrder = [...this.playersOrder];
        newBoard.players = {};
        Object.keys(this.players).forEach(pId => {
            newBoard.players[pId] = this.players[pId].copy();
        });
        newBoard.turnHistory = [...this.turnHistory];
        newBoard.unplayedCards = [...this.unplayedCards];
        newBoard.historyNumber = {
            'C': this.historyNumber['C'],
            'H': this.historyNumber['H'],
            'S': this.historyNumber['S'],
            'D': this.historyNumber['D']
        };
        newBoard.gameNumber = this.gameNumber;
        return newBoard;
    }
}