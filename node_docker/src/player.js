import {
    Card,
    Rank
} from "./card.js";


export class Player {
    constructor(pId, nextPId) {
        this.cards = [];
        this.cardNumbers = {
            'C': 0,
            'H': 0,
            'S': 0,
            'D': 0
        };
        this.totalPoints = 0;
        this.calledBid = -1;
        this.wonHands = 0;
        this.playerId = pId;
        this.nextPlayerId = nextPId;

        this.botHasRunOut = {
            'C': false,
            'H': false,
            'S': false,
            'D': false
        }
    }

    setCards(cards) {
        this.cards = cards;

        this.cardNumbers = {
            'C': 0,
            'H': 0,
            'S': 0,
            'D': 0
        };

        this.cards.forEach(c => {
            this.cardNumbers[c.suit.code]++;
        });
    }

    /**
     * 
     * @param {Card} card 
     */
    playCard(card) {
        this.cards = this.cards.filter(c => !c.equals(card));
        this.cardNumbers[card.suit.code]--;
    }

    /**
     * 
     * @param {Object.<string, Integer>} allScores 
     * @returns 
     */
    getBid() {
        let count = 0;

        let spades = this.cardNumbers['S'];
        let trumpWinPrediction = 3;


        if (spades > 5) {
            count += spades - 5;
        }

        // count aces use that as bid value
        for (let i = 0; i < this.cards.length; i++) {
            let card = this.cards[i];
            if (card.rank.value === Rank.ACE.value) {
                if (card.suit.code == 'S') {
                    count++;
                } else if (this.cardNumbers[card.suit.code] < 6) {
                    count++;
                }
            }
        }

        // count if we have both of king and queen/jack/ace of same suit
        for (let i = 0; i < this.cards.length; i++) {
            let card = this.cards[i];
            if (card.rank.value === Rank.KING.value && (this.cardNumbers[card.suit.code] < 5 || card.suit.code == 'S')) {
                let kingCanWin = false;
                for (let j = 0; j < this.cards.length; j++) {
                    let otherCard = this.cards[j];
                    if (otherCard.rank.value === Rank.QUEEN.value && otherCard.suit.code === card.suit.code) {
                        kingCanWin = true;
                        break;
                    }
                    if (otherCard.rank.value === Rank.JACK.value && otherCard.suit.code === card.suit.code) {
                        kingCanWin = true;
                        break;
                    }
                    if (otherCard.rank.value === Rank.TEN.value && otherCard.suit.code === card.suit.code) {
                        kingCanWin = true;
                        break;
                    }
                    if (otherCard.rank.value === Rank.ACE.value && otherCard.suit.code === card.suit.code) {
                        kingCanWin = true;
                        break;
                    }
                }

                if (kingCanWin) {
                    if (card.suit.code == 'S') {
                        trumpWinPrediction++;
                    }
                    count++;
                }
            }
        }

        Object.keys(this.cardNumbers).forEach(c => {
            if (c != 'S' && spades >= trumpWinPrediction && this.cardNumbers[c] < 3) {
                count++;
                // trumpWinPrediction++;
            }
        });

        // cap count at 1 to 5.
        count = Math.min(Math.max(1, count), 8);

        return count;
    }

    static getHighestCard(turnCards) {
        let highestCardPlayed = turnCards[0];
        for (let i = 1; i < turnCards.length; i++) {
            if (turnCards[i].suit.code == highestCardPlayed.suit.code) {
                if (turnCards[i].rank.value > highestCardPlayed.rank.value) {
                    // if this card is of same suit as the played and is ranked higher this is the new highest card
                    highestCardPlayed = turnCards[i];
                }
            } else if (turnCards[i].suit.code == 'S') {
                if (highestCardPlayed.suit.code != 'S') {
                    highestCardPlayed = turnCards[i];
                } else if (highestCardPlayed.rank.value < turnCards[i].rank.value) {
                    highestCardPlayed = turnCards[i];
                }
            }
        }
        return highestCardPlayed;
    }

    /**
     * 
     * @param {Card[]} turnCards 
     */
    getAllPlayableCards(turnCards) {
        if (this.cards.length == 0) {
            return {
                'cards': [],
                'W': false
            };
        }

        if (turnCards.length == 0) {
            return {
                'cards': this.cards,
                'W': true
            };
        }

        let playedSuit = turnCards[0].suit;
        let highestCardPlayed = Player.getHighestCard(turnCards);

        // if we dont have any original cards
        if (this.cardNumbers[playedSuit.code] <= 0) {
            // now we can either play a spade if we have one or play any card if no spade in hand
            let spadeCards = this.cards.filter(c => c.suit.code == 'S');
            if (highestCardPlayed.suit.code == 'S') {
                //if the highest card was also a spade
                let winningSpades = spadeCards.filter(c => c.rank.value > highestCardPlayed.rank.value);

                if (winningSpades.length > 0) {
                    // we have winnable cards
                    return {
                        'cards': winningSpades,
                        'W': true
                    };
                } else {
                    // we cannot win this hand
                    return {
                        'cards': this.cards,
                        'W': false
                    };
                }
            } else {
                if (spadeCards.length > 0) {
                    // no one has yet played a spade and we can win this hand
                    return {
                        'cards': spadeCards,
                        'W': true
                    };
                } else {
                    // we dont have any original or spade so we lost
                    return {
                        'cards': this.cards,
                        'W': false
                    };
                }
            }
        } else {
            // if we have originally played cards, we have to check if highest card is a trump
            let allCardsForSuit = this.cards.filter(c => c.suit.code == playedSuit.code);
            if (highestCardPlayed.suit.code == 'S') {
                // we can only win if the original card was a spade
                if (playedSuit.code == 'S') {
                    let winningCards = allCardsForSuit.filter(c => c.rank.value > highestCardPlayed.rank.value);

                    if (winningCards.length > 0) {
                        // if the original cards were spades and we have winning cards we can win
                        return {
                            'cards': winningCards,
                            'W': true
                        };
                    } else {
                        // we cannot win
                        return {
                            'cards': allCardsForSuit,
                            'W': false
                        };
                    }
                } else {
                    // someone already played a trump and we cannot win                    
                    return {
                        'cards': allCardsForSuit,
                        'W': false
                    };
                }
            } else {
                //original cards was not spade and no one played spade yet aka normal rounds
                let winningCards = allCardsForSuit.filter(c => c.rank.value > highestCardPlayed.rank.value);
                if (winningCards.length > 0) {
                    //can win
                    return {
                        'cards': winningCards,
                        'W': true
                    };
                } else {
                    //cannot win here
                    return {
                        'cards': allCardsForSuit,
                        'W': false
                    };
                }
            }
        }
    }

    getBotPlayableCards(turnCards, turnHistory, unplayedCards, handHistory) {
        if (unplayedCards.length == 0) {
            return [];
        }

        let cardsForBot = [...unplayedCards];
        Object.keys(this.botHasRunOut).forEach(c => {
            if (this.botHasRunOut[c]) {
                cardsForBot = cardsForBot.filter(card => card.suit.code != c);
            }
        });


        // if the bot has not run out of original cards and if this hand is less than 3 for suit
        // remove spades from cardsForBot
        if (turnCards.length > 0) {
            let origSuit = turnCards[0].suit.code;
            if (!this.botHasRunOut[origSuit] && handHistory[origSuit] < 3 && origSuit != 'S') {
                cardsForBot = cardsForBot.filter(card => card.suit.code != 'S');
            }
        }


        // TODO make this more accurate and short 
        // make this so that we get one state representing a win/loss
        // if the bot can hypothethically win, insert one winning card
        // if the bot cannot win, insert one losing card

        this.setCards(cardsForBot);
        let playableCards = this.getAllPlayableCards(turnCards);
        this.setCards([]);


        if (playableCards.W) {
            return playableCards.cards;
        }
        if (playableCards.cards.length == 0) {
            console.log("Here", turnHistory.length);
            return unplayedCards;
        }
        return playableCards.cards.splice(0, 1);
    }

    copy() {
        let newPlayer = new Player(this.playerId, this.nextPlayerId);

        newPlayer.cards = [...this.cards];
        Object.keys(this.cardNumbers).forEach(c => {
            newPlayer.cardNumbers[c] = this.cardNumbers[c];
        });
        newPlayer.calledBid = this.calledBid;
        newPlayer.wonHands = this.wonHands;
        newPlayer.totalPoints = this.totalPoints;
        newPlayer.botHasRunOut = {
            'C': this.botHasRunOut.C,
            'D': this.botHasRunOut.D,
            'H': this.botHasRunOut.H,
            'S': this.botHasRunOut.S
        }
        return newPlayer;
    }
}