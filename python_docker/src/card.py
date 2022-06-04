import numpy as np

SUIT = {
    "HEART": {"value": 2, "code": "H"},
    "CLUB": {"value": 3, "code": "C"},
    "DIAMOND": {"value": 4, "code": "D"},
    # spade always trumps other cards
    "SPADE": {"value": 5, "code": "S"},
}

RANK = {
    "TWO": {"value": 2, "code": "2"},
    "THREE": {"value": 3, "code": "3"},
    "FOUR": {"value": 4, "code": "4"},
    "FIVE": {"value": 5, "code": "5"},
    "SIX": {"value": 6, "code": "6"},
    "SEVEN": {"value": 7, "code": "7"},
    "EIGHT": {"value": 8, "code": "8"},
    "NINE": {"value": 9, "code": "9"},
    "TEN": {"value": 10, "code": "T"},
    "JACK": {"value": 11, "code": "J"},
    "QUEEN": {"value": 12, "code": "Q"},
    "KING": {"value": 13, "code": "K"},
    "ACE": {"value": 14, "code": "1"},
}


class Card:
    def __init__(self, card: str):
        self.rank = Card.getRank(card)
        self.suit = Card.getSuit(card)

    @staticmethod
    def getRank(card: str):
        if card[0] == "2":
            return RANK["TWO"]
        if card[0] == "3":
            return RANK["THREE"]
        if card[0] == "4":
            return RANK["FOUR"]
        if card[0] == "5":
            return RANK["FIVE"]
        if card[0] == "6":
            return RANK["SIX"]
        if card[0] == "7":
            return RANK["SEVEN"]
        if card[0] == "8":
            return RANK["EIGHT"]
        if card[0] == "9":
            return RANK["NINE"]
        if card[0] == "T":
            return RANK["TEN"]
        if card[0] == "J":
            return RANK["JACK"]
        if card[0] == "Q":
            return RANK["QUEEN"]
        if card[0] == "K":
            return RANK["KING"]
        # Ace is always the highest value card
        if card[0] == "1":
            return RANK["ACE"]

    @staticmethod
    def getSuit(card: str):
        if card[1] == "H":
            return SUIT["HEART"]
        if card[1] == "C":
            return SUIT["CLUB"]
        if card[1] == "D":
            return SUIT["DIAMOND"]
        if card[1] == "S":
            return SUIT["SPADE"]

    def __str__(self) -> str:
        return self.rank["code"] + self.suit["code"]



class card_history:

    
    def __init__(self):
        self.heart_cards = np.array(["1H", "KH", "QH", "JH", "TH", "9H", "8H", "7H", "6H", "5H", "4H", "3H", "2H"])
        self.club_cards = np.array(["1C", "KC", "QC", "JC", "TC", "9C", "8C", "7C", "6C", "5C", "4C", "3C", "2C"])
        self.diamond_cards = np.array(["1D", "KD", "QD", "JD", "TD", "9D", "8D", "7D", "6D", "5D", "4D", "3D", "2D"])
        self.spade_cards = np.array(["1S", "KS", "QS", "JS", "TS", "9S", "8S", "7S", "6S", "5S", "4S", "3S", "2S"])
    
    
    
    def update_history(self, cards):
        for card in cards:
            if card[1] == "H":
                if card in self.heart_cards:
                    self.heart_cards = self.heart_cards[self.heart_cards != card]
                
            if card[1] == "C":
                if card in self.club_cards:
                    self.club_cards = self.club_cards[self.club_cards != card]
            
            if card[1] == "D":
                if card in self.diamond_cards:
                    self.diamond_cards = self.diamond_cards[self.diamond_cards != card]
            
            if card[1] == "S":
                if card in self.spade_cards:
                    self.spade_cards = self.spade_cards[self.spade_cards != card]
    
    
    
    def get_winning_cards(self, suit, cur_card,  cards_in_hand, last_turn=False):
        self.winning_cards = []
        
        if suit == "H": self.card_list = self.heart_cards
        elif suit == "C": self.card_list = self.club_cards
        elif suit == "D": self.card_list = self.diamond_cards
        else: self.card_list = self.spade_cards
        
        for card in self.card_list:
            if card in cards_in_hand:
                self.winning_cards.append(Card(card))
                
            elif last_turn:
                if Card(card).rank["value"] > cur_card.rank["value"]:
                    self.winning_cards.append(Card(card))
                else:
                    break
                
            else:
                break
        
        return self.winning_cards