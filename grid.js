let rows = 1000;
let cols = 26;

let addressColContainer = document.querySelector(".address-col-container");
let addressRowContainer = document.querySelector(".address-row-container");
let cellsContainer = document.querySelector(".cells-container");
let addressBar = document.querySelector(".address-bar");

for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
  let addressCol = document.createElement("div");
  addressCol.setAttribute("class", "address-col");
  addressCol.innerText = rowIdx + 1;
  addressColContainer.appendChild(addressCol);
}

for (let colIdx = 0; colIdx < cols; colIdx++) {
  let addressRow = document.createElement("div");
  addressRow.setAttribute("class", "address-row");
  addressRow.innerText = String.fromCharCode(65 + colIdx);
  addressRowContainer.appendChild(addressRow);
}

for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
  let rowContainer = document.createElement("div");
  rowContainer.setAttribute("class", "row-container");
  for (let colIdx = 0; colIdx < cols; colIdx++) {
    let cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("contenteditable", "true");
    cell.setAttribute("spellcheck", "false");

    // Attributes for cell and storage identification
    cell.setAttribute("rid", rowIdx);
    cell.setAttribute("cid", colIdx);

    rowContainer.appendChild(cell);
    addListenerForAddressBarDisplay(cell, rowIdx, colIdx);
  }
  cellsContainer.appendChild(rowContainer);
}

function addListenerForAddressBarDisplay(cell, rowIdx, colIdx) {
  cell.addEventListener("click", e => {
    let prevSelectedCell = document.querySelector(".cell-selected");
    if (prevSelectedCell) {
      prevSelectedCell.classList.remove("cell-selected");
    }
    cell.classList.add("cell-selected");
    let rowID = rowIdx + 1;
    let colID = String.fromCharCode(65 + colIdx);
    addressBar.value = `${colID}${rowID}`;
  });
}
