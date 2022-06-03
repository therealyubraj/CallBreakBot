from math import floor

from python_docker.app import play

CHDS_ORDER = {"C": 0, "H": 1, "D": 2, "S": 3}
FACE_VALUE = {"A": 12, "J": 9, "Q": 10, "K": 11, "T": 8}


# all cards are converted to integer so that it is easier to compare two cards cased on their values
# 2 is the lowest, so it becomes 0, 3 = 1, 4 = 2, so on till King. Ace becomes 12 as it is the highest valued one.
# then, the suit is used to convert these values into single integer by doing this:
#                       13 * CHDS_ORDER[suit] + num

def cardToInteger(card):
    # AS = ace of spades = 13 * 3 + 12 = 26 + 12 = 51

    suit = card[1]
    num = card[0]
    if num == "1":
        num = "A"

    if num.isnumeric():
        num = int(num) - 2
    else:
        num = FACE_VALUE[num]

    return CHDS_ORDER[suit] * 13 + num


def integerToCard(cardInt):
    # 51 => Ace of spades

    suit = floor(cardInt / 13)

    if suit == 0:
        suit = "C"
    elif suit == 1:
        suit = "H"
    elif suit == 2:
        suit = "D"
    else:
        suit = "S"

    cardNum = cardInt % 13

    if cardNum < 8:
        cardNum = str(cardNum + 2) + ""
    elif cardNum == 8:
        cardNum = "T"
    elif cardNum == 9:
        cardNum = "J"
    elif cardNum == 10:
        cardNum = "Q"
    elif cardNum == 11:
        cardNum = "K"
    else:
        cardNum = "A"

    return cardNum + suit


class State():

    def __init__(self):
        self.history = []
        self.deck = []

    def setDeck(self, cards):
        for card in cards:
            self.deck.append(cardToInteger(card))

    def getPlayableCards(self, curRoundCards):
        playableCards = []

        # if we are to start the round
        if len(curRoundCards) == 0:
            return "QS"

        curRoundCards = list(map(cardToInteger, curRoundCards))
        

        return list(map(integerToCard, playableCards))

    def addToHistory(self, cards):
        for card in cards:
            self.history.append(cardToInteger(card))
