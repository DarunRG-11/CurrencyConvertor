import { countryList } from './country-codes.js';

const fromCurrency = document.querySelector("select[name='from']");
const toCurrency = document.querySelector("select[name='to']");
const amountInput = document.querySelector(".amount input");
const msg = document.querySelector(".msg");
const btn = document.querySelector("button");

for (let currency in countryList) {
    let option1 = document.createElement("option");
    option1.value = currency;
    option1.textContent = currency;
    if (currency === "USD") option1.selected = true;
    fromCurrency.append(option1);

    let option2 = document.createElement("option");
    option2.value = currency;
    option2.textContent = currency;
    if (currency === "INR") option2.selected = true;
    toCurrency.append(option2);
}

function updateFlag(element, countryCode) {
    let img = element.parentElement.querySelector("img");
    img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}

fromCurrency.addEventListener("change", () => {
    updateFlag(fromCurrency, countryList[fromCurrency.value]);
});
toCurrency.addEventListener("change", () => {
    updateFlag(toCurrency, countryList[toCurrency.value]);
});

btn.addEventListener("click", async () => {
    let amount = parseFloat(amountInput.value);
    if (isNaN(amount) || amount <= 0) {
        msg.textContent = "Please enter a valid amount.";
        return;
    }

    let from = fromCurrency.value;
    let to = toCurrency.value;
    let from_small = from.toLowerCase();
    let to_small = to.toLowerCase();

    try {
        let URL = `https://www.floatrates.com/daily/${from_small}.json`
        let response = await fetch(URL);
        let data = await response.json();
        if (!data[to_small]) {
            msg.textContent = "Conversion rate not found.";
            return;
        }

        let rate = data[to_small]['rate'];
        let convertedAmount = (amount * rate).toFixed(3);
        msg.textContent = `${amount} ${from} = ${convertedAmount} ${to}`;
    } catch (error) {
        msg.textContent = "Error fetching exchange rate.";
        console.error(error);
    }
});
