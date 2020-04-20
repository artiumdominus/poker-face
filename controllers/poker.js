exports.pokerCompare = function (req, res) {
  
  let game = req.body;

  let errors = validateGame(game);

  if (errors.length > 0) {
    return res.json({ ok: false, errors: errors });
  }
  
  player1Count = {
    suits: {},
    kinds: {},
  };

  player2Count = {
    suits: {},
    kinds: {},
  }

  game.player1Cards.forEach((card) => {
    if (card.suit in player1Count.suits) {
      player1Count.suits[card.suit] += 1;
    } else {
      player1Count.suits[card.suit] = 1;
    }

    if (card.kind in player1Cards.kinds) {
      player1Count.kinds[card.kind] += 1;
    } else {
      player1Count.kinds[card.kind] = 1;
    }
  });

  game.player2Cards.forEach((card) => {
    if (card.suit in player2Count.suits) {
      player2Count.suits[card.suit] += 1;
    } else {
      player2Count.suits[card.suit] = 1;
    }

    if (card.kind in player2Cards.kinds) {
      player2Count.kinds[card.kind] += 1;
    } else {
      player2Count.kinds[card.kind] = 1;
    }
  });

  game.communityCards.forEach((card) => {
    if (card.suit in player2Count.suits || card.kind in player2Cards.kind) {
      if (card.suit in player1Count.suits) {
        player1Count.suits[card.suit] += 1;
      } else {
        player1Count.suits[card.suit] = 1;
      }
  
      if (card.kind in player1Cards.kinds) {
        player1Count.kinds[card.kind] += 1;
      } else {
        player1Count.kinds[card.kind] = 1;
      }

      game.player1Cards.push(card);
    }

    if (card.suit in player2Count.suits || card.kind in player2Cards.kind) {
      if (card.suit in player2Count.suits) {
        player2Count.suits[card.suit] += 1;
      } else {
        player2Count.suits[card.suit] = 1;
      }
  
      if (card.kind in player2Cards.kinds) {
        player2Count.kinds[card.kind] += 1;
      } else {
        player2Count.kinds[card.kind] = 1;
      }

      game.player2Cards.push(card);
    }
  });
  
  return res.json({ winner: "player1" });
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
