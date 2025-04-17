const priceValue = document.getElementById("price-value");
const cashInput = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");
const changeDrawer = document.getElementById("change-in-drawer");
const changeDue = document.getElementById("change-due");

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
let unitsAmounts = [
  ["PENNY", 0.01],
  ["NICKEL", 0.05],
  ["DIME", 0.1],
  ["QUARTER", 0.25],
  ["ONE", 1],
  ["FIVE", 5],
  ["TEN", 10],
  ["TWENTY", 20],
  ["ONE HUNDRED", 100],
];


let isCashOpen = false;
let isNotEnoughFunds = false;
let isZeroFunds = false;
let cidBackup = [];
let cashAmounts = {};
let cashValue = 0;

class checkOnArrays {
  checkCid() { return cidBackup.filter((element) => element[1] !== 0) }
  checkUnitAmounts() { return unitsAmounts.filter((_, index) => cidBackup[index][1] !== 0); }
  checkZeroFunds() { return cid.every((value) => value[1] === 0) }
}

let checks = new checkOnArrays;


//funzione per aggiornamento display
const updateDisplay = () => {
  changeDrawer.innerHTML = "";
  changeDue.innerHTML = "";
  priceValue.innerText = `$ ${price}`;
  cid.forEach((cash) => {
    changeDrawer.innerHTML += `<span><b>${cash[0]}:</b></span> <span class="cid-span-value">$${cash[1]} </span></br> `;  //aggiornamento del resto nel cassetto
  });
  changeDue.innerHTML = `${isCashOpen ? "Status: OPEN </br>" : "Status: CLOSED </br>"}`;
  if (isNotEnoughFunds) {
    changeDue.innerHTML = "Status: INSUFFICIENT_FUNDS";
    isNotEnoughFunds = false;
    return
  }
  for (let key in cashAmounts) {
    unitsAmounts.forEach((el) => {
      if (el[0] === key) {
        changeDue.innerHTML += `${key}: $${Number((cashAmounts[key] * el[1]).toFixed(2))}</br>`
      }
    })
  }
}

updateDisplay();

const purchase = () => {
  if (isZeroFunds) return
  cidBackup = JSON.parse(JSON.stringify(cid));
  cashValue = Number(cashInput.value);
  let changeValue = Number((cashValue - price).toFixed(2));
  if (cashValue === price) {
    changeDue.innerHTML = "No change due - customer paid with exact cash"      //controllo dell'input utente
    return;
  } else if (cashValue < price) {
    alert("Customer does not have enough money to purchase the item")      //controllo dell'input utente
    return;
  }
  isCashOpen = true;
  calculateChange(changeValue);
  return
}


const calculateChange = (changeValue) => {
  cashAmounts = {};
  while (changeValue > 0) {
    const unitChange = checks.checkUnitAmounts().toReversed().find((cash) => (cash[1] / changeValue) <= 1);
    if (unitChange) {
      cashAmounts[unitChange[0]] ? cashAmounts[unitChange[0]]++ : cashAmounts[unitChange[0]] = 1;
      changeValue = Number((changeValue - unitChange[1]).toFixed(2));
      updateCid(unitChange);
      if (changeValue === 0) {
        console.log(cid, cidBackup);
        cid = JSON.parse(JSON.stringify(cidBackup));
      }
    } else {
      isNotEnoughFunds = true;
      changeValue = 0;
    }
    if (checks.checkZeroFunds()) {
      isZeroFunds = true;
      isCashOpen = false;
    }
    updateDisplay();
  }
}



const updateCid = (unitChange) => {
  cidBackup.map((element, index) => {
    if (element[0] === unitChange[0]) {
      if (element[1] >= unitsAmounts[index][1]) {
        element[1] = Number((element[1] - unitsAmounts[index][1]).toFixed(2));
      }
    }
  })
  return
};


purchaseBtn.addEventListener('click', () => {
  (!cashInput.value) ? alert("Insert a customer's cash value") : purchase()
})
