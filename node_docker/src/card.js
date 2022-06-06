export const Suit = {
    HEART: {
        value: 2,
        code: "H"
    },
    CLUB: {
        value: 3,
        code: "C"
    },
    DIAMOND: {
        value: 4,
        code: "D"
    },
    // spade always trumps other cards
    SPADE: {
        value: 5,
        code: "S"
    },
};



export const Rank = {
    TWO: {
        value: 2,
        code: "2"
    },
    THREE: {
        value: 3,
        code: "3"
    },
    FOUR: {
        value: 4,
        code: "4"
    },
    FIVE: {
        value: 5,
        code: "5"
    },
    SIX: {
        value: 6,
        code: "6"
    },
    SEVEN: {
        value: 7,
        code: "7"
    },
    EIGHT: {
        value: 8,
        code: "8"
    },
    NINE: {
        value: 9,
        code: "9"
    },
    TEN: {
        value: 10,
        code: "T"
    },
    JACK: {
        value: 11,
        code: "J"
    },
    QUEEN: {
        value: 12,
        code: "Q"
    },
    KING: {
        value: 13,
        code: "K"
    },
    ACE: {
        value: 14,
        code: "1"
    },
};

export class Card {
    /**
     * 
     * @param {String} cardString 
     */
    constructor(cardString) {
        if (typeof cardString !== "string") throw new Error("cardString must be a string");
        this.cardString = cardString;
        this.rank = Card.getRank(cardString);
        this.suit = Card.getSuit(cardString);
    }

    /**
     * 
     * @param {String} card 
     * @returns Rank
     */
    static getRank(card) {
        if (card[0] === "2") return Rank.TWO;
        if (card[0] === "3") return Rank.THREE;
        if (card[0] === "4") return Rank.FOUR;
        if (card[0] === "5") return Rank.FIVE;
        if (card[0] === "6") return Rank.SIX;
        if (card[0] === "7") return Rank.SEVEN;
        if (card[0] === "8") return Rank.EIGHT;
        if (card[0] === "9") return Rank.NINE;
        if (card[0] === "T") return Rank.TEN;
        if (card[0] === "J") return Rank.JACK;
        if (card[0] === "Q") return Rank.QUEEN;
        if (card[0] === "K") return Rank.KING;
        // Ace is always the highest value card
        if (card[0] === "1") return Rank.ACE;
    }

    /**
     * 
     * @param {String} card 
     * @returns Suit
     */
    static getSuit(card) {
        if (card[1] === "H") return Suit.HEART;
        if (card[1] === "C") return Suit.CLUB;
        if (card[1] === "D") return Suit.DIAMOND;
        if (card[1] === "S") return Suit.SPADE;
    }

    toString() {
        return this.cardString;
    }

    equals(other) {
        return this.cardString == other.cardString;
    }

    sameSuit(other) {
        return this.suit == other.suit;
    }
}

export const allCards = [
    '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', 'TH', 'JH', 'QH', 'KH', '1H',
    '2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', 'TC', 'JC', 'QC', 'KC', '1C',
    '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', 'TD', 'JD', 'QD', 'KD', '1D',
    '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', 'TS', 'JS', 'QS', 'KS', '1S',
];