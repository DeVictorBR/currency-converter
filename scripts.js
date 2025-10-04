const button = document.getElementById("convert-btn");
const selectFrom = document.getElementById("convert-from");
const selectTo = document.getElementById("convert-to");
const toValueText = document.getElementById("to-value-text");
const fromValueText = document.getElementById("from-value-text");
const inputMoney = document.getElementById("input-money");

const loadValues = async () => {
  const data = await fetch(
    "https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,BTC-BRL"
  ).then((response) => response.json());

  const dolar = data.USDBRL.high;
  const euro = data.EURBRL.high;
  const bitcoin = data.BTCBRL.high;
  return {
    dolar: dolar,
    euro: euro,
    bitcoin: bitcoin
  };
};

const convertValues = async () => {
  let inputMoneyValue = inputMoney.value
    .replace(/[R$\s]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  inputMoneyValue = parseFloat(inputMoneyValue) || 0;

  const values = await loadValues();
  const convertedValues = {
    convertedDolar: inputMoneyValue / values.dolar,
    convertedEuro: inputMoneyValue / values.euro,
    convertedBitcoin: inputMoneyValue / values.bitcoin
  };
  formatCurrency(convertedValues);

  fromValueText.textContent = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(inputMoneyValue);
  inputMoney.value = "";
};

const formatCurrency = (convertedValues) => {
  switch (selectTo.value) {
    case "Dolar":
      toValueText.textContent = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      }).format(convertedValues.convertedDolar);
      break;
    case "Euro":
      toValueText.textContent = new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR"
      }).format(convertedValues.convertedEuro);
      break;
    case "Bitcoin":
      toValueText.textContent = `${convertedValues.convertedBitcoin.toFixed(
        6
      )} BTC`;
  }
};

const formatCurrencyWhenChange = (convertedValues) => {
  switch (selectTo.value) {
    case "Dolar":
      toValueText.textContent = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      }).format(convertedValues);
      break;
    case "Euro":
      toValueText.textContent = new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR"
      }).format(convertedValues);
      break;
    case "Bitcoin":
      toValueText.textContent = `${convertedValues.toFixed(6)} BTC`;
  }
  fromValueText.textContent = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(0);
};

const changeCurrency = () => {
  const toCurrencyName = document.getElementById("to-currency-name");
  const toCurrencyImg = document.getElementById("to-currency-img");

  switch (selectTo.value) {
    case "Dolar":
      toCurrencyName.textContent = "Dólar americano";
      toCurrencyImg.src = "./assets/dolar.svg";
      formatCurrencyWhenChange(0);
      break;
    case "Euro":
      toCurrencyName.textContent = "Euro";
      toCurrencyImg.src = "./assets/euro.svg";
      formatCurrencyWhenChange(0);
      break;
    case "Bitcoin":
      toCurrencyName.textContent = "Bitcoin";
      toCurrencyImg.src = "./assets/bitcoin.png";
      formatCurrencyWhenChange(0.0);
  }
};

const addMask = (event) => {
  let value = event.target.value;
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d+)(\d{2})$/, "$1,$2");
  value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  value = "R$ " + value;
  event.target.value = value;
};

button.addEventListener("click", convertValues);
selectTo.addEventListener("change", changeCurrency);
inputMoney.addEventListener("input", addMask);
