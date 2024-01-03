let sheetsDB = [];

/**
 * Since cell-properties.js file is below grid.js in index.html,
 * it can access all the variables used in it.
 */
for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
  let sheetRow = [];
  for (let colIdx = 0; colIdx < cols; colIdx++) {
    // default props
    let cellProps = {
      bold: false,
      italic: false,
      underline: false,
      alignment: "left",
      fontFamily: "monospace",
      fontSize: "14",
      fontColor: "#000000",
      backgroundColor: "#ffffff",
      value: "",
      formula: "",
      children: [],
    };
    sheetRow.push(cellProps);
  }
  sheetsDB.push(sheetRow);
}

// Selectors for cell properties
let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let alignment = document.querySelectorAll(".alignment");
let leftAlign = alignment[0],
  centerAlign = alignment[1],
  rightAlign = alignment[2];
let fontFamily = document.querySelector(".font-family-prop");
let fontSize = document.querySelector(".font-size-prop");
let fontColor = document.querySelector(".font-color");
let backgroundColor = document.querySelector(".cell-bg-color");
let fontColorIcon = document.querySelector(".textColor");
let backgroundColorIcon = document.querySelector(".bgColor");

let activeCellColorProp = "#d1d8e0",
  inActiveCellColorProp = "#ecf0f1";

// Applying two-way data binding
// Attach click listeners on each property
bold.addEventListener("click", e => {
  // access active cell
  let address = addressBar.value;
  let [cell, cellProp] = getActiveCell(address);

  // Altering the property
  // Data change
  cellProp.bold = !cellProp.bold;

  // UI change
  cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
  bold.style.backgroundColor = cellProp.bold
    ? activeCellColorProp
    : inActiveCellColorProp;
  bold.style.borderRadius = cellProp.bold ? "0.3rem" : "0rem";
});

italic.addEventListener("click", e => {
  // access active cell
  let address = addressBar.value;
  let [cell, cellProp] = getActiveCell(address);

  // Altering the property
  // Data change
  cellProp.italic = !cellProp.italic;

  // UI change
  cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
  italic.style.backgroundColor = cellProp.italic
    ? activeCellColorProp
    : inActiveCellColorProp;
  italic.style.borderRadius = cellProp.italic ? "0.3rem" : "0rem";
});

underline.addEventListener("click", e => {
  // access active cell
  let address = addressBar.value;
  let [cell, cellProp] = getActiveCell(address);

  // Altering the property
  // Data change
  cellProp.underline = !cellProp.underline;

  // UI change
  cell.style.textDecoration = cellProp.underline ? "underline" : "none";
  underline.style.backgroundColor = cellProp.underline
    ? activeCellColorProp
    : inActiveCellColorProp;
  underline.style.borderRadius = cellProp.underline ? "0.3rem" : "0rem";
});

alignment.forEach(alignType => {
  alignType.addEventListener("click", e => {
    // access active cell
    let address = addressBar.value;
    let [cell, cellProp] = getActiveCell(address);

    let alignValue = e.target.classList[0];
    // Altering the property
    // Data change
    cellProp.alignment = alignValue;

    // UI change
    cell.style.textAlign = cellProp.alignment;

    switch (cellProp.alignment) {
      case "left":
        leftAlign.style.backgroundColor = activeCellColorProp;
        leftAlign.style.borderRadius = "0.3rem";
        rightAlign.style.backgroundColor = inActiveCellColorProp;
        centerAlign.style.backgroundColor = inActiveCellColorProp;
        break;
      case "right":
        rightAlign.style.backgroundColor = activeCellColorProp;
        rightAlign.style.borderRadius = "0.3rem";
        leftAlign.style.backgroundColor = inActiveCellColorProp;
        centerAlign.style.backgroundColor = inActiveCellColorProp;
        break;
      case "center":
        centerAlign.style.backgroundColor = activeCellColorProp;
        centerAlign.style.borderRadius = "0.3rem";
        leftAlign.style.backgroundColor = inActiveCellColorProp;
        rightAlign.style.backgroundColor = inActiveCellColorProp;
        break;
      default:
        break;
    }
  });
});

fontFamily.addEventListener("change", e => {
  // access active cell
  let address = addressBar.value;
  let [cell, cellProp] = getActiveCell(address);

  // Altering the property
  // Data change
  cellProp.fontFamily = fontFamily.value;

  // UI change
  cell.style.fontFamily = cellProp.fontFamily;
  fontFamily.value = cellProp.fontFamily;
});

fontSize.addEventListener("change", e => {
  // access active cell
  let address = addressBar.value;
  let [cell, cellProp] = getActiveCell(address);

  // Altering the property
  // Data change
  cellProp.fontSize = fontSize.value;

  // UI change
  cell.style.fontSize = `${cellProp.fontSize}px`;
  fontSize.value = cellProp.fontSize;
});

fontColor.addEventListener("change", e => {
  // access active cell
  let address = addressBar.value;
  let [cell, cellProp] = getActiveCell(address);

  // Altering the property
  // Data change
  cellProp.fontColor = fontColor.value;

  // UI change
  cell.style.color = cellProp.fontColor;
  fontColor.value = cellProp.fontColor;
  fontColorIcon.style.color = cellProp.fontColor;
});

backgroundColor.addEventListener("change", e => {
  // access active cell
  let address = addressBar.value;
  let [cell, cellProp] = getActiveCell(address);

  // Altering the property
  // Data change
  cellProp.backgroundColor = backgroundColor.value;

  // UI change
  cell.style.backgroundColor = cellProp.backgroundColor;
  backgroundColor.value = cellProp.backgroundColor;
  backgroundColorIcon.style.color = cellProp.backgroundColor;
});

/**
 * Retrieves the active cell and its corresponding property from the given address.
 *
 * @param {string} address - The address of the cell in the format "A1".
 * @return {[HTMLElement, object<cellProp>]} - An array containing the active cell element and its property.
 */
function getActiveCell(address) {
  let [rowId, colId] = decodeRowIdAndColIdFromAddress(address);
  // access active cell and storage obj
  let cell = document.querySelector(
    `.cell[rowId="${rowId}"][colId="${colId}"]`
  );
  let cellProp = sheetsDB[rowId][colId];
  return [cell, cellProp];
}

/**
 * Decode the row ID and column ID from a given address string in the format "A1".
 *
 * @param {string} address - The address from which to decode the row ID and column ID.
 * @return {Array} An array containing the decoded row ID and column ID.
 */
function decodeRowIdAndColIdFromAddress(address) {
  let rowId = Number(address.slice(1) - 1);
  let colId = Number(address.charCodeAt(0)) - 65;
  return [rowId, colId];
}

// Attach listeners to all cells
let allCells = document.querySelectorAll(".cell");
for (let index = 0; index < allCells.length; index++) {
  addListenerToAttachCellProperties(allCells[index]);
}

/**
 * Adds a listener to attach cell styling properties to the given cell when it is clicked.
 *
 * @param {HTMLElement} cell - The cell element to attach properties to.
 */
function addListenerToAttachCellProperties(cell) {
  cell.addEventListener("click", e => {
    // get cell address
    let address = addressBar.value;
    let [rowId, colId] = decodeRowIdAndColIdFromAddress(address);

    // get cell properties from storage
    let cellProp = sheetsDB[rowId][colId];

    // Apply Cell Properties
    cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
    cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
    cell.style.textDecoration = cellProp.underline ? "underline" : "none";
    cell.style.fontFamily = cellProp.fontFamily;
    cell.style.fontSize = `${cellProp.fontSize}px`;
    cell.style.textAlign = cellProp.textAlign;
    cell.style.color = cellProp.fontColor;
    cell.style.backgroundColor = cellProp.backgroundColor;

    // Mark properties' state on the Cell Actions Menu based on cell properties
    bold.style.backgroundColor = cellProp.bold
      ? activeCellColorProp
      : inActiveCellColorProp;
    bold.style.borderRadius = cellProp.bold ? "0.3rem" : "0rem";
    italic.style.backgroundColor = cellProp.italic
      ? activeCellColorProp
      : inActiveCellColorProp;
    italic.style.borderRadius = cellProp.italic ? "0.3rem" : "0rem";
    underline.style.backgroundColor = cellProp.underline
      ? activeCellColorProp
      : inActiveCellColorProp;
    underline.style.borderRadius = cellProp.underline ? "0.3rem" : "0rem";
    fontFamily.value = cellProp.fontFamily;
    fontSize.value = cellProp.fontSize;
    fontColor.value = cellProp.fontColor;
    fontColorIcon.style.color = cellProp.fontColor;
    backgroundColor.value = cellProp.backgroundColor;
    backgroundColorIcon.style.color = cellProp.backgroundColor;
    switch (cellProp.alignment) {
      case "left":
        leftAlign.style.backgroundColor = activeCellColorProp;
        leftAlign.style.borderRadius = "0.3rem";
        rightAlign.style.backgroundColor = inActiveCellColorProp;
        centerAlign.style.backgroundColor = inActiveCellColorProp;
        break;
      case "right":
        rightAlign.style.backgroundColor = activeCellColorProp;
        rightAlign.style.borderRadius = "0.3rem";
        leftAlign.style.backgroundColor = inActiveCellColorProp;
        centerAlign.style.backgroundColor = inActiveCellColorProp;
        break;
      case "center":
        centerAlign.style.backgroundColor = activeCellColorProp;
        centerAlign.style.borderRadius = "0.3rem";
        leftAlign.style.backgroundColor = inActiveCellColorProp;
        rightAlign.style.backgroundColor = inActiveCellColorProp;
        break;
      default:
        break;
    }

    let formulaBar = document.querySelector(".formula-bar");
    formulaBar.value = cellProp.formula;
    cell.value = cellProp.value;
  });
}
