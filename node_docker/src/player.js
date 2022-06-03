import {
    Card
} from "./card.js";

export class Player {
    /**
     * 
     * @param {Card[]} cards   
     */
    constructor(cards) {
        this.cards = cards.map(c => new Card(c));
        this.cardNumbers = {
            'C': 0,
            'H': 0,
            'S': 0,
            'D': 0
        };

        this.cards.forEach(c => {
            this.cardNumbers[c.suit.code]++;
        });
        this.history = [];
    }

    /**
     * 
     * @param {Card} card 
     */
    playCard(card) {
        this.cards = this.cards.filter(c => !c.equals(card));
        this.cardNumbers[card.suit.code]--;
        this.history.push(card);
    }

    /**
     * 
     * @param {Card[]} cards 
     */
    addToHistory(cards) {
        cards.forEach(c => this.history.push(new Card(c)));
    }

    /**
     * 
     * @param {Card[]} turnCards 
     */
    getAllPlayableCards(turnCards) {
        turnCards = turnCards.map(p => new Card(p));

        if (turnCards.length < 1) {
            return this.cards;
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

        if (this.cardNumbers[playedSuit.code] <= 0) {
            // now we can either play a spade if we have one or play any card if no spade in hand
            let spadeCards = this.cards.filter(c => c.suit.code == 'S');
            if (highestCardPlayed.suit.code == 'S') {
                let winningSpades = spadeCards.filter(c => c.rank.value > highestCardPlayed.rank.value);

                if (winningSpades.length > 0) {
                    return winningSpades;
                } else {
                    return this.cards;
                }
            } else {
                if (spadeCards.length > 0) {
                    return spadeCards;
                } else {
                    return this.cards;
                }
            }
        } else {
            // if we have originally played cards, we have to check if highest card is a trump
            let allCardsForSuit = this.cards.filter(c => c.suit.code == playedSuit.code);
            if (highestCardPlayed.suit.code == 'S') {
                if (playedSuit.code == 'S') {
                    let winningCards = allCardsForSuit.filter(c => c.rank.value > highestCardPlayed.rank.value);

                    if (winningCards.length > 0) {
                        return winningCards;
                    } else {
                        return allCardsForSuit;
                    }
                } else {
                    return allCardsForSuit;
                }
            } else {
                let winningCards = allCardsForSuit.filter(c => c.rank.value > highestCardPlayed.rank.value);

                if (winningCards.length > 0) {
                    return winningCards;
                } else {
                    return allCardsForSuit;
                }
            }

        }
    }
    //  getAllPlayableCards(turnCards) {
    //     turnCards = turnCards.map(p => new Card(p));

    //     if (turnCards.length < 1) {
    //         return this.cards;
    //     }

    //     let playedSuit = turnCards[0].suit;
    //     let highestCardPlayed = turnCards[0];


    //     for (let i = 1; i < turnCards.length; i++) {
    //         if (turnCards[i].suit.code == playedSuit.code && turnCards[i].rank.value > highestCardPlayed.rank.value && highestCardPlayed.suit.code != 'S') {
    //             // if this card is of same suit as the played and is ranked higher this is the new highest card
    //             highestCardPlayed = turnCards[i];
    //         } else if (playedSuit.code != 'S' && turnCards[i].suit.value == Suit.SPADE.value) {
    //             //if the original suit was not spades and a spade was played then
    //             //it will be the highest card iif its higher ranked than the current highest card
    //             if (highestCardPlayed.suit.code == 'S') {
    //                 if (highestCardPlayed.rank.value < turnCards[i].suit.value) {
    //                     // if the currently played spade is lower value than this then
    //                     //replace the highest card
    //                     highestCardPlayed = turnCards[i];
    //                 }
    //             } else {
    //                 // since this is the first spade played it is now the highest card played
    //                 highestCardPlayed = turnCards[i];
    //             }
    //         } else if (turnCards[i].suit.code == 'S' && turnCards[i].rank.value > highestCardPlayed.rank.value) {
    //             // if this card is of same suit as the played and is ranked higher this is the new highest card
    //             highestCardPlayed = turnCards[i];
    //         }
    //     }

    //     // if the highest played card is not a spade 
    //     if (highestCardPlayed.suit.code != 'S') {
    //         // if we dont have this suit we can play a spade if we have one
    //         if (this.cardNumbers[highestCardPlayed.suit.code] <= 0) {
    //             if (this.cardNumbers[Suit.SPADE.code] > 0) {
    //                 return this.cards.filter(c => c.suit.code == 'S');
    //             } else {
    //                 // if we dont have the suit but no spades either we can play any card
    //                 return this.cards;
    //             }
    //         } else {
    //             let winningCards = this.cards.filter(c => c.suit.code == highestCardPlayed.suit.code && c.rank.value > highestCardPlayed.rank.value);

    //             if (winningCards.length > 0) {
    //                 // if we have the suit, play any card that can win the highest if we have one
    //                 return winningCards;
    //             } else {
    //                 // if we have the suit but not winning cards, play any card from this suit
    //                 return this.cards.filter(c => c.suit.code == highestCardPlayed.suit.code);
    //             }
    //         }
    //     } else {
    //         let origCards = this.cards.filter(c => c.suit.code == playedSuit.code);
    //         // if we have originally played cards we cannot win this round
    //         if (origCards.length > 0 && playedSuit.code != 'S') {
    //             return origCards;
    //         }

    //         if (this.cardNumbers[Suit.SPADE.code] <= 0) {
    //             // if we dont have spade, play any card
    //             if (origCards.length > 0) {
    //                 return origCards;
    //             } else {
    //                 return this.cards;
    //             }
    //         } else {
    //             let winningSpades = this.cards.filter(c => c.suit.code == Suit.SPADE.code && c.rank.value > highestCardPlayed.rank.value);

    //             if (winningSpades.length > 0) {
    //                 // if we do have spade, play any card that can win the highest if we have one
    //                 return winningSpades;
    //             } else {
    //                 // if we do not have winning spade, play any spade
    //                 return this.cards.filter(c => c.suit.code == Suit.SPADE.code);
    //             }
    //         }
    //     }
    // }
}