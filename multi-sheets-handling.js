let activeSheetTabColor = "#CED6E0";
let sheetsFolderContainer = document.querySelector(".sheets-folder-container");
let addSheetButton = document.querySelector(".sheet-add-icon");

/**
 * Adds a new sheet to the UI.
 **/
addSheetButton.addEventListener("click", e => {
  let sheet = document.createElement("div");
  sheet.setAttribute("class", "sheet-folder");
  let totalSheets = document.querySelectorAll(".sheet-folder");
  let sheetId = totalSheets.length;
  sheet.setAttribute("id", sheetId);

  sheet.innerHTML = `<div class="sheet-content">Sheet ${sheetId + 1}</div>`;
  sheet.scrollIntoView({ behavior: "smooth", block: "center" });
  sheetsFolderContainer.appendChild(sheet);
  addSheetDB();
  createGraphComponentMatrix();
  handleSheetActive(sheet);
  handleSheetRemoval(sheet);
  sheet.click();
});

/**
 * Generates a new sheet database and adds it to the allSheetsDB array.
 *
 * @param {number} rows - The number of rows in the sheet.
 * @param {number} cols - The number of columns in the sheet.
 * @return {void} This function does not return a value.
 */
function addSheetDB() {
  let sheetsDB = [];

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

  allSheetsDB.push(sheetsDB);
}

/**
 * Creates a graph component matrix.
 *
 * @return {void}
 */
function createGraphComponentMatrix() {
  let graphComponentMatrix = [];

  for (let row = 0; row < rows; row++) {
    let currentRow = [];
    for (let col = 0; col < cols; col++) {
      // Why array ? because a parent can have multiple children
      currentRow.push([]);
    }
    graphComponentMatrix.push(currentRow);
  }
  allSheetsGraphComponentMatrix.push(graphComponentMatrix);
}

/**
 * Handles the sheet DB for a given sheet index.
 *
 * @param {number} sheetIdx - The index of the sheet.
 */
function handleSheetDB(sheetIdx) {
  sheetsDB = allSheetsDB[sheetIdx];
  graphComponentMatrix = allSheetsGraphComponentMatrix[sheetIdx];
}

/**
 * Handles the properties of the sheet.
 *
 * @param {number} rows - The number of rows in the sheet.
 * @param {number} cols - The number of columns in the sheet.
 * @return {undefined} This function does not return a value.
 */
function handleSheetProperties() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let cell = document.querySelector(
        `.cell[rowId="${row}"][colId="${col}"]`
      );
      cell.click();
    }
  }
  // Keep first cell clicked by default during page load.
  let firstCell = document.querySelector(".cell");
  firstCell.click();
}

/**
 * Handles the UI for a given sheet.
 *
 * @param {object} sheet - The sheet object to handle the UI for.
 * @return {undefined} This function does not return a value.
 */
function handleSheetUI(sheet) {
  let allSheets = document.querySelectorAll(".sheet-folder");
  for (let idx = 0; idx < allSheets.length; idx++) {
    allSheets[idx].style.backgroundColor = "transparent";
  }
  sheet.style.backgroundColor = activeSheetTabColor;
}

/**
 * Handles the event when a sheet is activated.
 *
 * @param {Object} sheet - The sheet object that was clicked.
 * @return {undefined} This function does not return a value.
 */
function handleSheetActive(sheet) {
  sheet.addEventListener("click", e => {
    let sheetIdx = Number(sheet.getAttribute("id"));
    handleSheetDB(sheetIdx);
    handleSheetProperties();
    handleSheetUI(sheet);
  });
}

/**
 * Handles the removal of a sheet.
 *
 * @param {Object} sheet - The sheet to be removed.
 * @return {undefined} This function does not return a value.
 */
function handleSheetRemoval(sheet) {
  sheet.addEventListener("mousedown", e => {
    // detect right click
    if (e.button !== 2) return;

    let allSheets = document.querySelectorAll(".sheet-folder");

    if (allSheets.length === 1) {
      alert("You need at least one sheet");
      return;
    }

    let userResponse = confirm("Are you sure you want to delete this sheet?");

    if (userResponse === false) return;

    // Remove sheet from DOM
    let sheetIdx = Number(sheet.getAttribute("id"));
    allSheetsDB.splice(sheetIdx, 1);
    allSheetsGraphComponentMatrix.splice(sheetIdx, 1);
    handleSheetUIRemoval(sheet);

    // Update the sheetDB and graphComponentMatrix to first sheet
    sheetsDB = allSheetsDB[0];
    graphComponentMatrix = allSheetsGraphComponentMatrix[0];
    handleSheetProperties();
  });
}

/**
 * Handles the removal of a sheet from the UI.
 *
 * @param {Object} sheet - The sheet element to remove.
 * @return {undefined} - This function does not return a value.
 */
function handleSheetUIRemoval(sheet) {
  sheet.remove();
  let allSheets = document.querySelectorAll(".sheet-folder");
  for (let idx = 0; idx < allSheets.length; idx++) {
    allSheets[idx].setAttribute("id", idx);
    let sheetContent = allSheets[idx].querySelector(".sheet-content");
    sheetContent.innerText = `Sheet ${idx + 1}`;
    allSheets[idx].style.backgroundColor = "transparent";
  }
  allSheets[0].style.backgroundColor = activeSheetTabColor;
}
