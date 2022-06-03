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
}