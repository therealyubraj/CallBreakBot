import {
    allCards,
    Card
} from './card.js';
import {
    Player
} from './player.js';
import {
    shuffle
} from './Matrix.js';

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
        this.removeCardsFromUnplayed(cards);
    }

    removeCardFromUnplayed(card) {
        this.unplayedCards = this.unplayedCards.filter(uc => !uc.equals(card));
    }

    removeCardsFromUnplayed(cards) {
        cards.forEach(c => {
            this.removeCardFromUnplayed(c);
        });
    }

    setThrownCards(cards, pId) {
        //remove thrown cards from unplayed cards
        this.removeCardsFromUnplayed(cards);
        this.thrownCards = cards;
        this.handStarter = pId;

        //calculate the original hand starter, there are 4 cards in the hand
        for (let i = 0; i < 4 - this.thrownCards.length; i++) {
            this.handStarter = this.players[this.handStarter].nextPlayerId;
        }
    }

    readyChildren(fast = false) {
        this.expanded = true;
        this.children = [];
        if (this.thrownCards.length == 4) {
            let handWinningCard = Player.getHighestCard(this.thrownCards);
            let handWinnerIndex = this.thrownCards.findIndex(c => c.equals(handWinningCard));

            let handWinner = this.handStarter;
            for (let i = 0; i < handWinnerIndex; i++) {
                handWinner = this.players[handWinner].nextPlayerId;
            }
            let newBoard = this.copy();
            newBoard.addToHistory(newBoard.thrownCards);
            newBoard.startNewHand();
            newBoard.handStarter = handWinner;
            newBoard.players[handWinner].wonHands++;
            newBoard.thrownCards = [];
            newBoard.parent = this;
            this.children.push(newBoard);
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
            possibleMoves = this.players[playerId].getBotPlayableCards(this.thrownCards, this.turnHistory, this.unplayedCards, this.handHistory);
        }

        // create a new board for each possible move
        if (!fast) {
            possibleMoves.forEach(c => {
                let newBoard = this.copy();
                newBoard.thrownCards.push(c);
                newBoard.playCard(c, playerId);
                newBoard.parent = this;
                this.children.push(newBoard);
            });
        } else {
            let randCard = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            let newBoard = this.copy();
            newBoard.thrownCards.push(randCard);
            newBoard.playCard(randCard, playerId);
            newBoard.parent = this;
            this.children.push(newBoard);
        }

    }

    addToHistory(lastHistory) {
        let curPlayer = this.handStarter;
        curPlayer = this.players[curPlayer].nextPlayerId;

        let origSuit = lastHistory[0].suit.code;
        for (let i = 1; i < lastHistory.length; i++) {
            if (lastHistory[i].suit.code != origSuit) {
                this.players[curPlayer].botHasRunOut[origSuit] = true;
            }
            curPlayer = this.players[curPlayer].nextPlayerId;
        }

        this.removeCardsFromUnplayed(lastHistory);

        this.turnHistory.push(lastHistory);
        this.handHistory[origSuit]++;
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
        this.handHistory = {
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

        this.handHistory = {
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
        shuffle(newBoard.unplayedCards); //TODO validate that the shuffle is according to bot informations

        let nextPlayer = newBoard.handStarter;
        for (let i = 0; i < newBoard.thrownCards.length; i++) {
            nextPlayer = newBoard.players[nextPlayer].nextPlayerId;
        }

        let newCards = {};

        this.playersOrder.forEach(pId => {
            newCards[pId] = [];
        });

        let nextPlayerIndex = newBoard.playersOrder.indexOf(nextPlayer);

        let pIndex = nextPlayerIndex;
        while (newBoard.unplayedCards.length > 0) {
            let p = newBoard.playersOrder[pIndex];

            if (this.players[p].cards.length == 0) {
                newCards[p].push(...newBoard.unplayedCards.splice(0, 1));
            }
            nextPlayer = newBoard.players[nextPlayer].nextPlayerId;
            pIndex = (pIndex + 1) % newBoard.playersOrder.length;
        };

        newBoard.playersOrder.forEach(p => {
            if (this.players[p].cards.length == 0) {
                newBoard.players[p].setCards(newCards[p]);
            }
        });


        let a = 0;

        while (newBoard.turnHistory.length < 13) {
            newBoard.readyChildren(true);

            if (!newBoard.children[0]) {
                newBoard.readyChildren();
                console.log("no children");
            }

            newBoard = newBoard.children[0];
        }
        // evaluate the board
        let wins = newBoard.getPlayerPoints();

        // get the rank of pId in wins
        wins.sort((a, b) => b.points - a.points);

        let scoreRanking = {
            0: 10,
            1: -1,
            2: -2,
            3: -3
        }

        let rank = wins.findIndex(w => w.id == pId);
        let score = scoreRanking[rank];
        if (newBoard.players[pId].wonHands >= newBoard.players[pId].calledBid) {
            score += newBoard.players[pId].wonHands;
        }
        return score;
    }

    getPlayerPoints() {
        let wins = [];
        Object.keys(this.players).forEach(pId => {
            let pointsToAdd = 0;
            let player = this.players[pId];
            if (player.calledBid > player.wonHands) {
                pointsToAdd = -player.calledBid;
            } else {
                pointsToAdd = player.calledBid + ((player.wonHands - player.calledBid) * 0.1);
            }
            wins.push({
                id: pId,
                points: pointsToAdd + player.totalPoints
            });
        });
        return wins;
    }

    playCard(card, pId) {
        this.removeCardFromUnplayed(card);
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
        newBoard.handHistory = {
            'C': this.handHistory['C'],
            'H': this.handHistory['H'],
            'S': this.handHistory['S'],
            'D': this.handHistory['D']
        };
        newBoard.gameNumber = this.gameNumber;
        newBoard.parent = this.parent;
        return newBoard;
    }
}