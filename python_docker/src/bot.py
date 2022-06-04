from logging.config import valid_ident
from typing import List

from card import Card, RANK, SUIT





# ------------------- Brain Related Functions -------------------

def start_best_move(handCard: List[Card], move_count: int):
    
    # if we have ace or king, sent it
    for card in handCard:
        if card.rank == RANK["ACE"]:
            return card
    
    normal_cards = [card for card in handCard if card.suit["value"] != SUIT["SPADE"]["value"]]
    spade_cards = [card for card in handCard if card.suit["value"] == SUIT["SPADE"]["value"]]
    
    if normal_cards:
        return normal_cards[0]
    else:
        return spade_cards[0]





# ------------------- Card Related Functions -------------------

def parse_card_arr(cards: List[str]):
    return [Card(card) for card in cards]




def get_highest_played_card(played: List[Card]):
    
    highestCard = played[0]
    
    # find the highest card for the suit based on same color
    for i in range(1, len(played)):
        card = played[i]
        if (( card.suit["value"] ==  highestCard.suit["value"] ) and ( card.rank["value"] > highestCard.rank["value"] )):
            highestCard = card

    return highestCard



def get_play_card(played_str_arr: List[str], cards_str_arr: List[str], history, game_board):
    played_cards = parse_card_arr(played_str_arr)
    cards = parse_card_arr(cards_str_arr)
    cards = sorted(cards, key=lambda card: card.rank["value"])

    # First turn is ours or we have won last hand.
    # Throw the first card in hand.
    # TODO: maybe play Ace or King here
    if len(played_cards) == 0: return start_best_move(cards, len(history))


    selected_card = None
    highest_card = get_highest_played_card(played_cards)
    same_suit_cards = [card for card in cards if card.suit["value"] == highest_card.suit["value"]]
    
    
    winning_cards = game_board.get_winning_cards(   suit=highest_card.suit["code"], 
                                                    cur_card=highest_card,
                                                    cards_in_hand=set(cards_str_arr),
                                                    last_turn=len(played_str_arr)==3)
    
    if winning_cards:
        print("-------------- I am gonna win yipee")
        # for x in winning_cards:
        #     print(x, end="\n")
        
        return winning_cards[-1]
    

    # select higher card of same suit
    for card in same_suit_cards:
        if card.rank["value"] > highest_card.rank["value"]:
            selected_card = card
    
    if selected_card: return selected_card
    elif same_suit_cards: return same_suit_cards[0]


    # no card of same suit found; use spade
    if selected_card is None:
        opponent_spade = None
        
        # check first is other players have played spade card
        for card in played_cards:
            if card.suit["value"] == SUIT["SPADE"]["value"]:
                opponent_spade = card

        for card in cards:
            if opponent_spade:
                if  card.suit["value"] == SUIT["SPADE"]["value"] and card.rank["value"] > opponent_spade.rank["value"]:
                    selected_card = card
                    break
                
            elif card.suit["value"] == SUIT["SPADE"]["value"]:
                # TODO: maybe play a low-rank spade card if opponents have not played spade=
                selected_card = card

    # no spade card in hand; use any card
    if selected_card is None:
        # TODO: maybe play a low-rank card if no winning card exists
        
        selected_card = cards[0]

    return selected_card






def get_bid(cardsStrArr: List[str]):
    cards = parse_card_arr(cardsStrArr)

    # TODO: maybe count the number of other cards and spades as well
    count = 0
    
    # count aces and king and use that as bid value
    for suit in ["H", "D", "C", "S"]:
        card_filter = [card.rank for card in cards if card.suit["code"] == suit]
        
        if RANK["ACE"] in card_filter:
            count += 1
        
        if RANK["KING"] in card_filter:
            if RANK["ACE"] in card_filter:
                count += 1
            elif RANK["QUEEN"] in card_filter:
                count += 1
        
        if suit =="S" and len(card_filter) > 5:
            count += len(card_filter) - 5 
    
    
    count = int(count)
    
    # 8 is maximum allowed bid
    count = count if count < 8 else 8
    
    # 1 is minimum allowed bid
    return max(1, count)
