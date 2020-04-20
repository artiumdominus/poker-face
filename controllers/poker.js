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

  game.communityCards.forEach((card) => {
    communityCount(card, player1Count, game.player1Cards);
    communityCount(card, player2Count, game.player2Cards);
  });

  player1Hand = evalHand(game.player1Cards, player1Count);
  player2hand = evalHand(game.player2Cards, player2Count); 
  
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

function evalHand(playerCards, counter) {
  let handSoFar = {
    order: 10,
    name: 'HighCard',
    cards: null,
    highestCardValue: null,
  }

  for (suit in counter.suits) {
    if (counter.suits[suit] === 5) {
      // Royal Straight Flush -> return
      // Straight Flush
      // Flush
    }
  }

  for (kind in counter.kinds) {
    if (counter.kinds[kind] === 4) {
      // Four of a kind -> return
    } else if (counter.kinds[kind] === 3) {
      // Full House
      // Three of a kind
    } else if (counter.kinds[kind] === 2) {
      // Two Pairs
      // One Pair
    }
  }

  // High Card
}