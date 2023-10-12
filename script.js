const main = document.getElementById("main");
const addUserButton = document.getElementById("addUser");
const doubleButton = document.getElementById("double");
const showMillionersButton = document.getElementById("showMillioners");
const sortButton = document.getElementById("sort");
const calculateWealthButton = document.getElementById("calculateWealth");
const template = document.querySelector("template");

const LOCAL_STORAGE_PREFIX = "PERSON-LIST";

let people = loadPeople();
console.log(people);

getRandomUser();

//Event Listeners
addUserButton.addEventListener("click", getRandomUser); //Add random user to the list
doubleButton.addEventListener("click", doubleMoney); // Doubles every persons money
showMillionersButton.addEventListener("click", showMillioners); // Shows only millioners
sortButton.addEventListener("click", sortPeople); // Sort from richest
calculateWealthButton.addEventListener("click", calculateTotalWealth); // Sum of everyones money

// Functions
async function getRandomUser() {
  const response = await fetch("https://randomuser.me/api/");
  const userData = await response.json();
  const randomUser = {
    firstName: userData.results[0].name.first,
    lastName: userData.results[0].name.last,
    img: userData.results[0].picture.large,
    money: Math.floor(Math.random() * 1000000),
  };

  people.push(randomUser);
  renderUser();
  savePeople();
}

function renderUser(data = people) {
  main.innerHTML = "<h2><strong>Person</strong>Wealth</h2>";
  people.forEach((person) => {
    const templateClone = template.content.cloneNode(true);
    const img = templateClone.querySelector("img");
    img.src = person.img;
    const name = templateClone.querySelector(".name");
    name.innerText = person.firstName + " " + person.lastName;
    const money = templateClone.querySelector(".money");
    money.innerText = `$ ${formatMoney(person.money)}`;
    main.appendChild(templateClone);
  });
}

function formatMoney(money) {
  return money.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
}

function doubleMoney() {
  people = people.map((user) => {
    return { ...user, money: user.money * 2 };
  });
  renderUser();
}

function showMillioners() {
  people = people.filter((user) => user.money >= 1e6);
  renderUser();
}

function sortPeople() {
  people = people.sort((a, b) => b.money - a.money);
  renderUser();
}

function calculateTotalWealth() {
  let total = people.reduce((acc, user) => (acc += user.money), 0);
  const wealthEl = document.createElement("div");
  wealthEl.innerHTML = `<h3>Total Wealth: <strong>$ ${formatMoney(
    total
  )}</strong></h3>`;
  main.appendChild(wealthEl);
}

// Local Storage
function savePeople() {
  localStorage.setItem(LOCAL_STORAGE_PREFIX, JSON.stringify(people));
}

function loadPeople() {
  const peopleString = localStorage.getItem(LOCAL_STORAGE_PREFIX);
  return JSON.parse(peopleString) || [];
}
