/**
 * Executes a delay of 1000 milliseconds and resolves the promise.
 *
 * @return {Promise} A Promise that resolves after the delay.
 */
function colorDelay() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

/**
 * Checks whether a graph represented by a matrix is cyclic.
 *
 * @param {Array<Array<number>>} graphComponentMatrix - The 2D matrix representation of the graph.
 * @return {boolean} Returns true if the graph is cyclic, false otherwise.
 */
async function traceCyclicPath(graphComponentMatrix, cycleDetectionResponse) {
  let [rowId, colId] = cycleDetectionResponse;
  let visited = [];
  let dfsVisited = [];

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

  let isCyclic = await dfsCycleDetectionTracingUtil(
    graphComponentMatrix,
    rowId,
    colId,
    visited,
    dfsVisited
  );

  if (isCyclic === true) {
    return Promise.resolve(true);
  }

  return Promise.resolve(false);
}

/**
 *  Color the path in the cycle.
 * @param {Array<Array<number>>} graphComponentMatrix - The 2D matrix representation of the graph.
 * @param {number} rowId - Parent Row Id.
 * @param {number} colId - Parent Column Id.
 * @param {number} visited - Node visit trace.
 * @param {Array<Array<number>>} dfsVisited - Stack visit trace.
 * @returns {boolean} - true if cycle is detected, false otherwise.
 */
async function dfsCycleDetectionTracingUtil(
  graphComponentMatrix,
  rowId,
  colId,
  visited,
  dfsVisited
) {
  visited[rowId][colId] = true;
  dfsVisited[rowId][colId] = true;

  let cell = document.querySelector(
    `.cell[rowId="${rowId}"][colId="${colId}"]`
  );

  cell.style.backgroundColor = "#86A5D9";
  cell.style.color = "#E6E6E6";
  await colorDelay();

  for (
    let children = 0;
    children < graphComponentMatrix[rowId][colId].length;
    children++
  ) {
    let [childRowId, childColId] = graphComponentMatrix[rowId][colId][children];
    if (visited[childRowId][childColId] === false) {
      let response = await dfsCycleDetectionTracingUtil(
        graphComponentMatrix,
        childRowId,
        childColId,
        visited,
        dfsVisited
      );
      if (response === true) {
        cell.style.backgroundColor = "#FFFFFF";
        cell.style.color = "#000000";
        await colorDelay();
        return Promise.resolve(true);
      }
    } else if (
      visited[childRowId][childColId] === true &&
      dfsVisited[childRowId][childColId] === true
    ) {
      let cyclicCell = document.querySelector(
        `.cell[rowId="${childRowId}"][colId="${childColId}"]`
      );

      cyclicCell.style.backgroundColor = "#5F4BB6";
      cyclicCell.style.color = "#E6E6E6";
      await colorDelay();
      cell.style.backgroundColor = "#FFFFFF";
      cell.style.color = "#000000";
      await colorDelay();
      cyclicCell.style.backgroundColor = "#FFFFFF";
      cyclicCell.style.color = "#000000";
      await colorDelay();
      return Promise.resolve(true);
    }
  }

  dfsVisited[rowId][colId] = false;
  return Promise.resolve(false);
}
