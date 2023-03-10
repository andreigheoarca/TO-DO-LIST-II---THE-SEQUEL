console.log("Another To Do List");

const addForm = document.querySelector(".add");
console.log(addForm);
const list = document.querySelector(".todos");
console.log(list);
const search = document.querySelector(".search input");
const clearAllBtn = document.querySelector(".clear-all");
console.log(clearAllBtn);
const alertBubble = document.querySelector(".alert-bubble");
console.log(alertBubble);

// item persistence in the window

window.addEventListener("DOMContentLoaded", displayItems);

function displayItems() {
  let storedItems = currentLocalStorageItems();
  console.log(storedItems);
  if (storedItems.length > 0) {
    storedItems.forEach(function (item) {
      let storedId = item.id;
      let storedItem = item.item;
      console.log(storedId, storedItem);
      list.innerHTML += `<li
  class="list-group-item d-flex justify-content-between align-items-center" data-id="${storedId}"
  >
  <span>${storedItem}</span>
  <i class="fa fa-pencil edit"></i>
  <i class="far fa-trash-alt delete"></i>
  </li>`;
    });
  }
}

// add item functionality

const generateDOM = function (item) {
  // Creates a unique dataaset for each added item and append it
  let randomId = idGen();
  // DOM item
  const domHTML = `   <li
  class="list-group-item d-flex justify-content-between align-items-center" data-id="${randomId}"
  >
  <span>${item}</span>
  <i class="fa fa-pencil edit"></i>
  <i class="far fa-trash-alt delete"></i>
  </li>`;

  list.innerHTML += domHTML;
  // add to local storage functionality
  addToLocalStorage(randomId, item);
};

addForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const item = addForm.add.value.trim();

  console.log(item);
  if (item.length) {
    generateDOM(item);
    // addItemFunction(item);
    addForm.reset();
    displayAlert("Item added", "success");
  }
});

// edit item functionality

list.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("edit item");
  if (e.target.classList.contains("edit")) {
    // e.preventDefault();
    console.log("item edited");
    let currentItemId = e.target.parentElement.dataset.id;
    console.log(currentItemId);
    let currentValue = e.target.parentElement.children[0];
    let inputValue =
      e.target.parentElement.parentElement.nextElementSibling.children[1].value;
    console.log(inputValue);
    console.log(currentValue);
    currentValue.innerHTML = inputValue;
    let newCurrentText = e.target.parentElement.children[0].textContent;
    console.log(newCurrentText);
    editLocalStorage(currentItemId, inputValue);
    displayAlert("Item edited", "success");
  }
});

// delete item

list.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete")) {
    e.target.parentElement.remove();
    let targetId = e.target.parentElement.dataset.id;
    console.log(targetId);
    removeFromLocalStorage(targetId);
    displayAlert("Item deleted", "danger");
  }
});

// search functionality

function filterItems(searchTerm) {
  let arrayItems = [...list.children];
  console.log(arrayItems);

  arrayItems.forEach(function (item) {
    console.log(item.textContent);
    if (!item.textContent.includes(searchTerm)) {
      console.log(item.textContent);
      item.classList.add("filtered");
    } else {
      item.classList.remove("filtered");
    }
  });
}

search.addEventListener("keyup", function () {
  const searchTerm = search.value.trim();
  filterItems(searchTerm);
});

// clear all btn functionality

clearAllBtn.addEventListener("click", clearAll);

function clearAll() {
  let items = document.querySelectorAll(".list-group-item");
  console.log(items);
  console.log("clear all");
  if (items.length > 0) {
    items.forEach(function (item) {
      item.remove();
    });
  }
  localStorage.removeItem("listItems");
  displayAlert("Items deleted", "danger");
}

// display alert function

function displayAlert(text, type) {
  let alertBubbleText = (alertBubble.querySelector(
    "p"
  ).textContent = `${text}`);
  alertBubble.classList.add("show");
  alertBubble.classList.add(`${type}`);
  // remove after a certain time
  setTimeout(function () {
    alertBubbleText = "";
    alertBubble.classList.remove("show");
    alertBubble.classList.remove(`${type}`);
  }, 1000);
}

// random id generator

const idGen = function () {
  let id = "";
  for (let i = 0; i < 6; i++) {
    let randomNumbers = Math.round(Math.random()) * i;
    id = id + randomNumbers;
  }
  console.log(id);
  return id;
};

// add to local storage

function addToLocalStorage(id, item) {
  const addedItem = { id: id, item: item };
  console.log(addedItem);
  let existingItems = currentLocalStorageItems();
  // let existingItems = localStorage.getItem("listItems")
  //   ? JSON.parse(localStorage.getItem("listItems"))
  //   : [];
  console.log(existingItems);
  existingItems.push(addedItem);
  localStorage.setItem("listItems", JSON.stringify(existingItems));
}

// edit item in local storage

function editLocalStorage(id, newValue) {
  let currentItems = currentLocalStorageItems();
  console.log(currentItems);
  let updatedItems = currentItems.map(function (item) {
    if (item.id === id) {
      item.item = newValue;
    }
    return item;
  });
  console.log(currentItems);
  console.log(updatedItems);
  localStorage.setItem("listItems", JSON.stringify(updatedItems));
}

// remove from local storage

function removeFromLocalStorage(id) {
  let listItems = currentLocalStorageItems();
  console.log(listItems);
  let filteredItems = listItems.filter(function (item) {
    if (item.id !== id) {
      console.log(item);
      return item;
    }
  });
  localStorage.setItem("listItems", JSON.stringify(filteredItems));
}

// get current local storage items

function currentLocalStorageItems() {
  return localStorage.getItem("listItems")
    ? JSON.parse(localStorage.getItem("listItems"))
    : [];
}
