let rows = 1000;
let cols = 26;

let addressColContainer = document.querySelector(".address-col-container");
let addressRowContainer = document.querySelector(".address-row-container");
let cellsContainer = document.querySelector(".cells-container");
let addressBar = document.querySelector(".address-bar");

// Populates the address bar with row IDs
for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
  let addressCol = document.createElement("div");
  addressCol.setAttribute("class", "address-col");
  addressCol.innerText = rowIdx + 1;
  addressColContainer.appendChild(addressCol);
}

// Populates the address bar with column IDs from A to Z
for (let colIdx = 0; colIdx < cols; colIdx++) {
  let addressRow = document.createElement("div");
  addressRow.setAttribute("class", "address-row");
  addressRow.innerText = String.fromCharCode(65 + colIdx);
  addressRowContainer.appendChild(addressRow);
}

// Populates the cells
for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
  let rowContainer = document.createElement("div");
  rowContainer.setAttribute("class", "row-container");
  for (let colIdx = 0; colIdx < cols; colIdx++) {
    let cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("contenteditable", "true");
    cell.setAttribute("spellcheck", "false");

    // Attributes for cell and storage identification
    cell.setAttribute("rowId", rowIdx);
    cell.setAttribute("colId", colIdx);

    rowContainer.appendChild(cell);
    addListenerForAddressBarDisplay(cell, rowIdx, colIdx);
  }
  cellsContainer.appendChild(rowContainer);
}

/**
 * Populates the row ID and column ID of the clicked cell in the address bar display.
 *
 * @param {HTMLElement} cell - The cell to add the event listener to.
 * @param {number} rowIdx - The index of the row containing the cell.
 * @param {number} colIdx - The index of the column containing the cell.
 */
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

// Keep first cell clicked by default during page load.
let firstCell = document.querySelector(".cell");
firstCell.click();
