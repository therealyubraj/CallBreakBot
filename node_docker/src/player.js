import {
    Card,
    Rank
} from "./card.js";


export class Player {
    /**
     * 
     * @param {Card[]} cards   
     */
    constructor(cards, pId) {
        this.cards = cards.map(c => new Card(c));
        this.cardNumbers = {
            'C': 0,
            'H': 0,
            'S': 0,
            'D': 0
        };

        this.cards.forEach(c => {
            console.log(c);
            this.cardNumbers[c.suit.code]++;
        });
        /**
         * @type Card[]
         */
        this.history = [];
        this.historyNumber = {
            'C': 0,
            'H': 0,
            'S': 0,
            'D': 0
        };
        this.calledBid = -1;
        this.wonHands = 0;
        this.playerId = pId;
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
     * @param {Card[]} cards 
     */
    addToHistory(cards) {
        cards.forEach(c => this.history.push(new Card(c)));
        cards.forEach(c => this.historyNumber[c[1]]++);
    }

    /**
     * 
     * @param {Object.<string, Integer>} allScores 
     * @returns 
     */
    getBid(allScores) {
        let count = 0;
        let safe = false;

        //if our total score is highest, we bid safer
        console.log(allScores);
        if (allScores[this.playerId] == Object.values(allScores).reduce((a, b) => a > b ? a : b)) {
            safe = true;
        }


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

    /**
     * 
     * @param {Card[]} turnCards 
     */
    getAllPlayableCards(turnCards) {
        turnCards = turnCards.map(p => new Card(p));

        if (turnCards.length == 0) {
            return {
                'cards': this.cards,
                'W': true
            };
        }

        let playedSuit = turnCards[0].suit;
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

        console.log("highest played");
        console.log(highestCardPlayed);

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
}