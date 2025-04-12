const priceValue = document.getElementById("price-value");
const cashInput = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");
const changeDrawer = document.getElementById("change-in-drawer");
const changeDue = document.getElementById("change-due");



const cashRegisterStatus = ["OPEN", "CLOSED", "INSUFFICIENT_FUNDS"];
let isStatusOpen = false;
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
const updateDisplay = () => {
  changeDrawer.innerHTML = "";
  changeDue.innerHTML = ""
  priceValue.innerText = `$ ${price}`;
  cid.forEach((cash) => {
    changeDrawer.innerHTML += `<span><b>${cash[0]}:</b></span> <span class="cid-span-value">$${cash[1]} </span></br> `;  //aggiornamento del resto nel cassetto
  });
  changeDue.innerHTML += `${isStatusOpen ? "Status: OPEN </br>" : ""}`;
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
  if (cashValue === price) {
    changeDue.innerHTML = "No change due - customer paid with exact cash"      //controllo dell'input utente
    return;
  }
  if (cashValue < price) {
    alert("Customer does not have enough money to purchase the item")      //controllo dell'input utente
    return;
  }
  let changeValue = Number((cashValue - price).toFixed(2));

  calculateChange(changeValue);
  cashAmounts = {}
}



const calculateChange = (changeValue) => {
  const unitChange2 = cid.filter((_, index) => (unitsAmounts[index][1] / changeValue) <= 1).reduce((acc, el) => (el[1] + acc), 0);
  console.log(unitChange2)
  while (changeValue > 0) {
    //trova un array dell'unitAmount (formattato dentro checkCid) il quale se diviso per il resto(changeValue) da minore o uguale a 1 e lo salva in unitChange
    const unitChange = checkCid().toReversed().find((cash) => (cash[1] / changeValue) <= 1);

    if (unitChange2 < changeValue || !unitChange) {
      changeDue.innerHTML = "Status: INSUFFICIENT_FUNDS";
      return
    }

    //sottrae il valore salvato in unitChange dal resto changeValue approssimandolo alla seconda cifra decimale 
    isStatusOpen = true;
    changeValue = Number((changeValue - unitChange[1]).toFixed(2));

    //passa il valore trovato alle funzioni 
    updateCid(unitChange[0], unitChange[1]);
    updateCashAmount(unitChange[0]);
    updateDisplay();
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
      value[1] = Number((value[1] - changeAmount).toFixed(2));
      return
    }
  })
}


const checkCid = () => unitsAmounts.filter((_, index) => cid[index][1] !== 0);


const checkEnoughChange = () => {
  cashValue = Number(cashInput.value);
  let changeValue = Number((cashValue - price).toFixed(2));


}

const formatNumber = (number) => {
  return number % 1 === 0 ? Number(number) : Number(number.toFixed(2))
}


if (cid.every((value) => value[1] === 0)) {
  console.log("ok")
}

purchaseBtn.addEventListener('click', () => {
  checkEnoughChange();
  (!cashInput.value) ? alert("Insert a customer's cash value") : purchase()
})

