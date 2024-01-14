/**
 * Storage of the 2D matrix for cycle detection.
 */

let allSheetsGraphComponentMatrix = [];
let graphComponentMatrix = [];

/**
 * Checks whether a graph represented by a matrix is cyclic.
 *
 * @param {Array<Array<number>>} graphComponentMatrix - The 2D matrix representation of the graph.
 * @return {boolean} Returns true if the graph is cyclic, false otherwise.
 */
function isGraphCyclic(graphComponentMatrix) {
  let visited = []; // Node visit trace
  let dfsVisited = []; // Stack visit trace

  // Initialize visited and dfsVisited arrays with false
  for (let row = 0; row < rows; row++) {
    let visitedRow = [],
      dfsVisitedRow = [];
    for (let col = 0; col < cols; col++) {
      visitedRow.push(false);
      dfsVisitedRow.push(false);
    }
    visited.push(visitedRow);
    dfsVisited.push(dfsVisitedRow);
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (visited[row][col] === false) {
        if (
          dfsCycleDetectionUtil(
            graphComponentMatrix,
            row,
            col,
            visited,
            dfsVisited
          ) === true
        ) {
          return [row, col];
        }
      }
    }
  }
  return null;
}

/**
 *  Check for cycle in graph.
 *  Cycle Detection Condition: if both visited and dfsVisited are true, then there is a cycle.
 * @param {Array<Array<number>>} graphComponentMatrix - The 2D matrix representation of the graph.
 * @param {number} rowId - Parent Row Id.
 * @param {number} colId - Parent Column Id.
 * @param {number} visited - Node visit trace.
 * @param {Array<Array<number>>} dfsVisited - Stack visit trace.
 * @returns {boolean} - true if cycle is detected, false otherwise.
 */
function dfsCycleDetectionUtil(
  graphComponentMatrix,
  rowId,
  colId,
  visited,
  dfsVisited
) {
  // while entering dfs
  // visited --> true
  // dfsVisited --> true
  visited[rowId][colId] = true;
  dfsVisited[rowId][colId] = true;

  // access each child in the parent's children array and detect cycle.
  // A1 -> [ [0, 1], [1, 0], [5, 10], .....  ]
  for (
    let children = 0;
    children < graphComponentMatrix[rowId][colId].length;
    children++
  ) {
    let [childRowId, childColId] = graphComponentMatrix[rowId][colId][children];
    if (visited[childRowId][childColId] === false) {
      let response = dfsCycleDetectionUtil(
        graphComponentMatrix,
        childRowId,
        childColId,
        visited,
        dfsVisited
      );
      if (response === true) return true; // Found cycle so return immediately, no need to explore more path
    } else if (
      visited[childRowId][childColId] === true &&
      dfsVisited[childRowId][childColId] === true
    ) {
      // Found cycle so return immediately, no need to explore more path
      return true;
    }
  }

  // while exiting dfs
  // visited --> true
  // dfsVisited --> false
  dfsVisited[rowId][colId] = false;

  // Cycle not detected
  return false;
}
