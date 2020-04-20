exports.pokerCompare = function (req, res) {
  
  let game = req.body;

  let errors = validateGame(game);

  if (errors.length > 0) {
    return res.json({ ok: false, errors: errors });
  }
  
  let player1Count = generateCounter();
  let player2Count = generateCounter();

  initialCount(game.player1Cards, player1Count);
  initialCount(game.player2Cards, player2Count);

  let player1OriginalKinds = [];
  let player2OriginalKinds = [];

  for (let kind in player1Count.kinds) {
    player1OriginalKinds.push(kind);
  }

  for (let kind in player2Count.kinds) {
    player2OriginalKinds.push(kind);
  }

  game.communityCards.forEach((card) => {
    communityCount(card, player1Count, game.player1Cards);
    communityCount(card, player2Count, game.player2Cards);
  });

  player1Hand = evalHand(game.player1Cards, player1Count, player1OriginalKinds);
  player2hand = evalHand(game.player2Cards, player2Count, player2OriginalKinds); 
  
  return res.json({
    ok: true,
    winner: "player1",
    player1Hand: player1Hand,
    player2Hand: player2Hand,
  });
}

function validateGame(game) {
  errors = [];

  if (game.communityCards.length !== 5) {
    errors.push("Must have 5 community cards");
  }

  if (game.player1Cards.length !== 2) {
    errors.push("Player's 1 hand must have 2 cards");
  }

  if (game.player2Cards.length !== 2) {
    errors.push("Player's 2 hand must have 2 cards");
  }

  let allCards = game.communityCards.concat(game.player1Cards, game.player2Cards);

  let kinds = ['A','1','2','3','4','5','6','7','8','9','10','J','Q','K'];
  let suits = ['Spades','Hearts','Clubs','Diamonds'];

  for (let card of allCards) {
    if (!(card.kind in kinds) || !(card.suit in suits)) {
      errors.push("There's some invalid cards in the input");
      return errors;
    }
  }

  let cardsSoFar = [];
  for (let card of allCards) {
    if (cardsSoFar.find(c => c.kind == card.kind && c.suit == card.suit)) {
      errors.push("There's some repeated cards in the input");
    } else {
      cardsSoFar.push(card);
    }
  }

  return errors;
}

function generateCounter() {
  return {
    suits: {},
    kinds: {},
  };
}

function initialCount(playerCards, counter) {
  playerCards.forEach((card) => {
    if (card.suit in counter.suits) {
      counter.suits[card.suit] += 1;
    } else {
      counter.suits[card.suit] = 1;
    }

    if (card.kind in counter.kinds) {
      counter.kinds[card.kind] += 1;
    } else {
      counter.kinds[card.kind] = 1;
    }
  });
}

function communityCount(card, counter, playerCards) {
  if (card.suit in counter.suits || card.kind in counter.kind) {
    if (card.suit in counter.suits) {
      counter.suits[card.suit] += 1;
    } else {
      counter.suits[card.suit] = 1;
    }

    if (card.kind in player2Cards.kinds) {
      counter.kinds[card.kind] += 1;
    } else {
      counter.kinds[card.kind] = 1;
    }

    playerCards.push(card);
  }
}

function evalHand(playerCards, counter, originalKinds) {
  let cardValues = {
    'A'  : 1,
    '2'  : 2,
    '3'  : 3,
    '4'  : 4,
    '5'  : 5,
    '6'  : 6,
    '7'  : 7,
    '8'  : 8,
    '9'  : 9,
    '10' : 10,
    'J'  : 11,
    'Q'  : 12,
    'K'  : 13,
  }
  
  let handSoFar = {
    order: 10,
    name: 'HighCard',
    cards: playerCards,
    highestCardValue: Math.max.apply(Math, playerCards.map(c => cardValues[c.kind])),
  }

  let cards;

  for (let suit in counter.suits) {
    if (counter.suits[suit] >= 5) {
      // Royal Straight Flush -> return
      cards = playerCards.filter(card => card.suit === suit);
      if (
        cards.find(card => card.kind === 'A') &&
        cards.find(card => card.kind === 'K') &&
        cards.find(card => card.kind === 'Q') &&
        cards.find(card => card.kind === 'J') &&
        cards.find(card => card.kind === '10')
      ) {
        return {
          order: 1,
          name: 'Royal Straight Flush',
          cards: ['A','K','Q','J','10'].map(kind => {
            return {
              suit: suit,
              kind: kind
            };
          }),
          highestCardValue: Infinity
        }
      }

      // Straight Flush -> return
      let straightFlush;
      cards.sort((a, b) => cardValues[a.kind] - cardValues[b.kind]);
      for(let i = 0; i <= cards.length-5; ++i) {
        straightFlush = true;
        for(let j = i+1; j < i+5; ++j) {
          if (cardValues[cards[j]] !== cardValues[cards[j-1]] + 1) {
            straightFlush = false;
            break;
          }
        }
        if (straightFlush) {
          return {
            order: 2,
            name: 'Straight Flush',
            cards: cards.slice(i, i+5),
            highestCardValue: Infinity,
          }
        }
      }
      // Flush
      handSoFar = {
        order: 5,
        name: 'Flush',
        cards: cards.slice(i, 5),
        highestCardValue: (() => {
          let otherCards = playerCards.filter(card => card.suit !== suit);
          if (otherCards.length === 0) {
            return 0;
          }
          return Math.max.apply(Math, otherCards.map(c => cardValues[c.kind]));
        })()
      }
    }
  }

  for (let kind in counter.kinds) {
    if (counter.kinds[kind] === 4 && kind in originalKinds) {
      // Four of a kind -> return
      cards = playerCards.filter(card => card.kind === kind);
      return {
        order: 3,
        name: 'Four of a kind',
        cards: cards,
        highestCardValue: cardValues[cards[0]]
      };
    } else if (counter.kinds[kind] === 3 && kind in originalKinds) {
      // Full House
      cards = playerCards.filter(card => card.kind === kind);
      for (let kind2 in counter.kinds) {
        if (counter.kinds[kind2] >= 2 && kind2 in originalKinds && kind !== kind2) {
          if ((hansSoFar.order === 4 && handSoFar.highestCardValue < cardValues[cards[0]] ) || handSoFar.order > 4) {
            handSoFar = {
              order: 4,
              name: 'Full House',
              cards: cards.concat(playerCards.filter(card => card.kind === kind2).slice(0,2)),
              highestCardValue: cardValues[cards[0]]
            }
          }
        }
      }

      // Three of a kind
      if ((hansSoFar.order === 7 && handSoFar.highestCardValue < cardValues[cards[0]] ) || handSoFar.order > 4) {
        handSoFar = {
          order: 7,
          name: 'Three of a kind',
          cards: cards,
          highestCardValue: cardValues[cards[0]]
        }
      }
    } else if (counter.kinds[kind] === 2 && kind in originalKinds) {
      // Two Pairs
      cards = playerCards.filter(card => card.kind === kind);
      for (let kind2 in counter.kinds) {
        if (counter.kinds[kind2] == 2 && kind2 in originalKinds && kind !== kind2) {
          if ((hansSoFar.order === 8 && handSoFar.highestCardValue < cardValues[cards[0]] ) || handSoFar.order > 8) {
            handSoFar = {
              order: 8,
              name: 'Two Pairs',
              cards: cards.concat(playerCards.filter(card => card.kind === kind2)),
              highestCardValue: cardValues[cards[0]]
            }
          }
        }
      }

      // One Pair
      if ((hansSoFar.order === 9 && handSoFar.highestCardValue < cardValues[cards[0]] ) || handSoFar.order > 9) {
        handSoFar = {
          order: 9,
          name: 'One Pair',
          cards: cards,
          highestCardValue: cardValues[cards[0]]
        }
      }
    }
  }

  return handSoFar;
}
