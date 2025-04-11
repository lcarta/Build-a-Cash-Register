const priceValue = document.getElementById("price-value");
const cashInput = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");
const changeDrawer = document.getElementById("change-in-drawer");
const changeDue = document.getElementById("change-due");



const cashRegisterStatus = ["OPEN", "CLOSED", "INSUFFICIENT_FUNDS"];
let isInsufficientFunds = false;
//Dati imposti dal progetto
let price = 3.26;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];

//array per valori monetari dele valute
const unitsAmounts = [
  ['PENNY', 0.01],
  ['NICKEL', 0.05],
  ['DIME', 0.1],
  ['QUARTER', 0.25],
  ['ONE', 1],
  ['FIVE', 5],
  ['TEN', 10],
  ['TWENTY', 20],
  ['ONE HUNDRED', 100]
]

let cashAmounts = {};
let cashValue = 0;


//funzione per aggiornamento display
const updateDisplay = (isInsufficientFunds) => {
  changeDrawer.innerHTML = "";
  changeDue.innerHTML = ""
  priceValue.innerText = `$ ${price}`;
  cid.forEach((cash) => {
    changeDrawer.innerHTML += `<span><b>${cash[0]}:</b></span> <span class="cid-span-value">$${cash[1]} </span></br> `;  //aggiornamento del resto nel cassetto
  });
  if (isInsufficientFunds) {
    changeDue.innerHTML += "Status: INSUFFICIENT_FUNDS";
    return
  }
  changeDue.innerHTML += "Status: OPEN </br>";
  for (let key in cashAmounts) {
    unitsAmounts.forEach((unit) => {
      if (unit[0] === key) {
        changeDue.innerHTML += `${key}: $${formatNumber(cashAmounts[key] * unit[1])}</br>`;  //aggiornamento del resto da dare in base ai valori dell'oggetto cashAmounts
      }
    })

  }
}

updateDisplay();

//funzione chiamata dal bottone purchase
const purchase = () => {
  cashValue = Number(cashInput.value);
  let changeValue = cashValue - price;
  if (cashValue === price) {
    changeDue.innerHTML = "No change due - customer paid with exact cash"      //controllo dell'input utente
    return;
  }
  if (cashValue < price) {
    alert("Customer does not have enough money to purchase the item")      //controllo dell'input utente
    return;
  }
  calculateChange(changeValue);
  updateDisplay(isInsufficientFunds);
  cashAmounts = {}
}



const calculateChange = (changeValue) => {
  while (changeValue > 0) {
    //trova un array dell'unitAmount (formattato dentro checkCid) il quale se diviso per il resto(changeValue) da minore o uguale a 1 e lo salva in unitChange
    const unitChange = checkCid().toReversed().find((cash) => (cash[1] / changeValue) <= 1);
    if (!unitChange) {
      console.log("insufficient")
      isInsufficientFunds = !isInsufficientFunds;
      console.log(isInsufficientFunds)
      return
    }
    //sottrae il valore salvato in unitChange dal resto changeValue approssimandolo alla seconda cifra decimale 
    changeValue = formatNumber((changeValue - unitChange[1]));

    //passa il valore trovato alle funzioni 
    updateCid(unitChange[0], unitChange[1]);
    updateCashAmount(unitChange[0]);


  }
}

//funzione che aggiorna l'oggetto cashAmount per conteggiare quanto queli unità di resto è neccessario restituire
const updateCashAmount = (cash) => {
  cashAmounts[cash] ? cashAmounts[cash]++ : cashAmounts[cash] = 1;
  //console.log(cashAmounts);
}


//funzione che confronta tutti i valori dell'array cid col nome della valuta passata nella funzione, se corrisponde allora sottrae dal cid il quantitativo passato changeAmount
const updateCid = (changeName, changeAmount) => {
  cid.map((value) => {
    if (value[0] === changeName) {
      value[1] = formatNumber((value[1] - changeAmount));
      return
    }
  })
}


const checkCid = () => unitsAmounts.filter((_, index) => cid[index][1] !== 0);

const changeCashRegisterStatus = (string) => {
  if (string === "isInsufficient") {
    return "Status: INSUFFICIENT_FUNDS"
  } else if (string === "open") {
    return "Status: OPEN"
  }
}


const formatNumber = (number) => {
  return number % 1 === 0 ? Number(number) : Number(number.toFixed(2))
}

purchaseBtn.addEventListener('click', () => {
  (!cashInput.value) ? alert("Insert a customer's cash value") : purchase()
})