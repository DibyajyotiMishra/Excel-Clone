// Attach listeners to all cells
for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
  for (let colIdx = 0; colIdx < cols; colIdx++) {
    let cell = document.querySelector(
      `.cell[rowId="${rowIdx}"][colId="${colIdx}"]`
    );
    // Add Blur event listener to current cell
    cell.addEventListener("blur", e => {
      // access active cell address
      let address = addressBar.value;
      // get active cell and its properties from its address
      let [activeCell, cellProp] = getActiveCell(address);
      // get data of active cell
      let cellData = activeCell.innerText;

      if (cellData === cellProp.value) {
        return;
      }
      // set cell value
      cellProp.value = cellData;
      // if there's a change in cell value, update its formula and children cell values.
      removeChildReferenceFromParent(cellProp.formula);
      cellProp.formula = "";
      updateChildCellValue(address);
    });
  }
}

let formulaBar = document.querySelector(".formula-bar");

// Evaluate formula on enter
formulaBar.addEventListener("keydown", e => {
  // get formula
  let inputFormula = formulaBar.value;
  // perform evaluation if inputFormula is not empty
  if (e.key === "Enter" && inputFormula) {
    // remove child reference from parent if formula has changed
    let address = addressBar.value;
    let [cell, cellProp] = getActiveCell(address);
    // check if formula has changed and remove child reference from parent
    if (inputFormula !== cellProp.formula) {
      removeChildReferenceFromParent(cellProp.formula);
    }

    // Add to Graph Component Matrix for cycle detection
    addChildToGraphComponentMatrix(inputFormula, address);

    // Check for cycle in graph before formula evaluation
    let isCyclic = isGraphCyclic(graphComponentMatrix);

    if (isCyclic === true) {
      alert(
        "Can not evaluate formula as there is a cycle in the dependency chain."
      );
      removeChildFromGraphComponentMatrix(inputFormula);
      return;
    }

    // evaluate formula
    let evaluatedValue = evaluateFormula(inputFormula);

    // update UI and data
    updateCell(evaluatedValue, inputFormula, address);
    addChildReferenceToParent(inputFormula);
    updateChildCellValue(address);
  }
});

/**
 * Adds a active cell reference to the operator cell's children property based on the given formula.
 *
 * @param {string} formula - The formula to process.
 * @return {undefined} This function does not return a value.
 */
function addChildReferenceToParent(formula) {
  // access active cell from address bar
  let childCellAddress = addressBar.value;
  // split formula to an array of operators and operands
  let encodedFormula = formula.split(" ");

  // Get parent cell and update its children
  for (let idx = 0; idx < encodedFormula.length; idx++) {
    let asciiValue = encodedFormula[idx].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [parentCell, parentCellProp] = getActiveCell(encodedFormula[idx]);
      // check if parent and child cells are same and add only unique child cells
      if (
        encodedFormula[idx] !== childCellAddress &&
        !parentCellProp.children.includes(childCellAddress)
      ) {
        parentCellProp.children.push(childCellAddress);
      }
    }
  }
}

/**
 * Removes child cell reference from parent cell's children property based on the given formula.
 *
 * @param {string} formula - The formula to process.
 * @return {undefined} This function does not return a value.
 */
function removeChildReferenceFromParent(formula) {
  // access active cell from address bar
  let childCellAddress = addressBar.value;
  // split formula to an array of operators and operands
  let encodedFormula = formula.split(" ");

  // Get parent cell and update its children
  for (let idx = 0; idx < encodedFormula.length; idx++) {
    let asciiValue = encodedFormula[idx].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [parentCell, parentCellProp] = getActiveCell(encodedFormula[idx]);
      // Get index of child cell in parent cell's children array
      let index = parentCellProp.children.indexOf(childCellAddress);
      // remove child cell from parent cell's children array
      if (index > -1) {
        parentCellProp.children.splice(index, 1);
      }
    }
  }
}

/**
 * Recursively updates all child cell values if there's any change
 * in the parent based on the given parent cell address.
 *
 * @param {string} parentAddress - The address of the parent cell.
 */
function updateChildCellValue(parentAddress) {
  // get parent cell and its properties
  let [parentCell, parentCellProp] = getActiveCell(parentAddress);
  // get all children of the parent
  let children = parentCellProp.children;
  for (let index = 0; index < children.length; index++) {
    let childAddress = children[index];
    // get child cell and its properties
    let [childCell, childCellProp] = getActiveCell(childAddress);
    // update child cell value based on its formula
    let childFormula = childCellProp.formula;
    let evaluatedValue = evaluateFormula(childFormula);
    // update UI and data
    updateCell(evaluatedValue, childFormula, childAddress);
    // recursively update child cell values
    updateChildCellValue(childAddress);
  }
}

/**
 * Evaluates a formula by decoding and evaluating an encoded formula string.
 *
 * @param {string} formula - The formula to be evaluated.
 * @return {number} The result of the evaluated formula.
 */
function evaluateFormula(formula) {
  // split formula to an array of operators and operands
  let encodedFormula = formula.split(" ");

  /**
   * Iterate over the encoded formula array and
   * replace any cell references, if any, with
   * their corresponding values.
   */
  for (let idx = 0; idx < encodedFormula.length; idx++) {
    let asciiValue = encodedFormula[idx].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [cell, cellProp] = getActiveCell(encodedFormula[idx]);
      encodedFormula[idx] = cellProp.value;
    }
  }

  // convert array of operands and operators to a string
  let decodedFormula = encodedFormula.join(" ");

  // evaluate the formula string
  return eval(decodedFormula);
}

/**
 * Updates a cell in the spreadsheet with the evaluated value and formula.
 *
 * @param {any} evaluatedValue - The evaluated value to be displayed in the cell.
 * @param {string} formula - The formula used to evaluate the value.
 */
function updateCell(evaluatedValue, formula, cellAddress) {
  let [cell, cellProp] = getActiveCell(cellAddress);
  // UI change
  cell.innerText = evaluatedValue;

  // Data change
  cellProp.value = evaluatedValue;
  cellProp.formula = formula;
}

function addChildToGraphComponentMatrix(formula, childAddress) {
  let [childRowId, childColId] = decodeRowIdAndColIdFromAddress(childAddress);
  let encodedFormula = formula.split(" ");
  for (let idx = 0; idx < encodedFormula.length; idx++) {
    let asciiValue = encodedFormula[idx].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [parentRowId, parentColId] = decodeRowIdAndColIdFromAddress(
        encodedFormula[idx]
      );
      graphComponentMatrix[parentRowId][parentColId].push([
        childRowId,
        childColId,
      ]);
    }
  }
}

function removeChildFromGraphComponentMatrix(formula) {
  let encodedFormula = formula.split(" ");
  for (let idx = 0; idx < encodedFormula.length; idx++) {
    let asciiValue = encodedFormula[idx].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [parentRowId, parentColId] = decodeRowIdAndColIdFromAddress(
        encodedFormula[idx]
      );
      // remove recently added child cell
      graphComponentMatrix[parentRowId][parentColId].pop();
    }
  }
}
