$('select')
  .dropdown()
;

function initCardDropdown(id) {
  let dropdown = document.getElementById(id);
  
  let kinds = ['A','1','2','3','4','5','6','7','8','9','10','J','Q','K'];
  let suits = ['Spades','Hearts','Clubs','Diamonds'];
  let suit_entities = {
    'Spades'   : '&spades;',
    'Hearts'   : '<span style="color:crimson">&hearts;</span>',
    'Clubs'    : '&clubs;',
    'Diamonds' : '<span style="color:crimson">&diams;</span>'
  };
  
  for (let suit of suits) {
    for (let kind of kinds) {
      let option = document.createElement('option');
      option.value = kind + " " + suit;
      option.innerHTML = kind + " " + suit_entities[suit];
      dropdown.appendChild(option);
    }
  }
}

['community-cards', 'player1-cards', 'player2-cards']
  .forEach((dropdown_id) => initCardDropdown(dropdown_id) );

$('select')
  .dropdown()
;

function compareCards(ev) {
  ev.preventDefault();
  
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(JSON.parse(this.responseText));
    }
  }
  xhttp.open('POST', '/poker-compare', true);
  xhttp.setRequestHeader('Content-Type', 'application/json');
  xhttp.send("{}");
}

document.getElementById('compare-button').addEventListener('click', compareCards);
