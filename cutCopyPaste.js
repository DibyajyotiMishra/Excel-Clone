let shiftKey;
let copyBtn = document.querySelector(".copy");
let cutBtn = document.querySelector(".cut");
let pasteBtn = document.querySelector(".paste");
let rangeStorage = [];
let copyData = [];

document.addEventListener("keydown", e => {
  shiftKey = e.shiftKey;
});
document.addEventListener("keyup", e => {
  shiftKey = e.shiftKey;
});

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    let cell = document.querySelector(`.cell[rowId="${i}"][colId="${j}"]`);
    handleSelectedCells(cell);
  }
}

/**
 * Change UI for selected cells.
 *
 * @param {Element} cell - The cell element that was clicked
 * @return {void}
 */
function handleSelectedCells(cell) {
  cell.addEventListener("click", e => {
    // Select cells range work
    if (!shiftKey) return;
    if (rangeStorage.length >= 2) {
      defaultSelectedCellsUI();
      rangeStorage = [];
    }

    // UI
    cell.style.border = "3px solid #218c74";

    let rowId = Number(cell.getAttribute("rowId"));
    let colId = Number(cell.getAttribute("colId"));
    rangeStorage.push([rowId, colId]);
    console.log(rangeStorage);
  });
}

/**
 * Put Default UI for selected cells.
 *
 * @param {type} paramName - description of parameter
 * @return {type} description of return value
 */
function defaultSelectedCellsUI() {
  for (let i = 0; i < rangeStorage.length; i++) {
    let cell = document.querySelector(
      `.cell[rowId="${rangeStorage[i][0]}"][colId="${rangeStorage[i][1]}"]`
    );
    cell.style.border = "1px solid lightgrey";
  }
}

copyBtn.addEventListener("click", e => {
  if (rangeStorage.length < 2) return;
  copyData = [];

  let [strow, stcol, endrow, endcol] = [
    rangeStorage[0][0],
    rangeStorage[0][1],
    rangeStorage[1][0],
    rangeStorage[1][1],
  ];

  for (let i = strow; i <= endrow; i++) {
    let copyRow = [];
    for (let j = stcol; j <= endcol; j++) {
      let cellProp = sheetsDB[i][j];
      copyRow.push(cellProp);
    }
    copyData.push(copyRow);
  }

  defaultSelectedCellsUI();
});

cutBtn.addEventListener("click", e => {
  if (rangeStorage.length < 2) return;

  let [strow, stcol, endrow, endcol] = [
    rangeStorage[0][0],
    rangeStorage[0][1],
    rangeStorage[1][0],
    rangeStorage[1][1],
  ];

  for (let i = strow; i <= endrow; i++) {
    for (let j = stcol; j <= endcol; j++) {
      let cell = document.querySelector(`.cell[rowId="${i}"][colId="${j}"]`);

      // DB
      let cellProp = sheetsDB[i][j];
      cellProp.value = "";
      cellProp.bold = false;
      cellProp.italic = false;
      cellProp.underline = false;
      cellProp.fontSize = 14;
      cellProp.fontFamily = "monospace";
      cellProp.fontColor = "#000000";
      cellProp.BGcolor = "#000000";
      cellProp.alignment = "left";

      // UI
      cell.click();
    }
  }

  defaultSelectedCellsUI();
});

pasteBtn.addEventListener("click", e => {
  // Past cells data work
  if (rangeStorage.length < 2) return;

  let rowDiff = Math.abs(rangeStorage[0][0] - rangeStorage[1][0]);
  let colDiff = Math.abs(rangeStorage[0][1] - rangeStorage[1][1]);

  // Target
  let address = addressBar.value;
  let [stRow, stCol] = decodeRowIdAndColIdFromAddress(address);

  // r -> refers copydata row
  // c -> refers copydata col
  for (let i = stRow, r = 0; i <= stRow + rowDiff; i++, r++) {
    for (let j = stCol, c = 0; j <= stCol + colDiff; j++, c++) {
      let cell = document.querySelector(`.cell[rowId="${i}"][colId="${j}"]`);
      console.log(cell);
      if (!cell) continue;

      // DB
      let data = copyData[r][c];
      let cellProp = sheetsDB[i][j];

      cellProp.value = data.value;
      cellProp.bold = data.bold;
      cellProp.italic = data.italic;
      cellProp.underline = data.underline;
      cellProp.fontSize = data.fontSize;
      cellProp.fontFamily = data.fontFamily;
      cellProp.fontColor = data.fontColor;
      cellProp.BGcolor = data.BGcolor;
      cellProp.alignment = data.alignment;

      // UI
      cell.click();
    }
  }
});
