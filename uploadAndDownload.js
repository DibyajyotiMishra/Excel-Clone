let uploadButton = document.querySelector(".upload");
let downloadButton = document.querySelector(".download");

downloadButton.addEventListener("click", e => {
  let jsonData = JSON.stringify([sheetsDB, graphComponentMatrix]);
  let blob = new Blob([jsonData], { type: "application/json" });
  let anchorElement = document.createElement("a");
  anchorElement.href = window.URL.createObjectURL(blob);
  anchorElement.download = "data.json";
  anchorElement.click();
});

uploadButton.addEventListener("click", e => {
  let input = document.createElement("input");
  input.setAttribute("type", "file");
  input.click();

  input.addEventListener("change", e => {
    let fr = new FileReader();
    fr.readAsText(input.files[0]);
    fr.addEventListener("load", e => {
      let jsonData = JSON.parse(fr.result);
      addSheetButton.click();
      sheetsDB = jsonData[0];
      graphComponentMatrix = jsonData[1];
      allSheetsDB[allSheetsDB.length - 1] = sheetsDB;
      allSheetsGraphComponentMatrix[allSheetsGraphComponentMatrix.length - 1] =
        graphComponentMatrix;
      handleSheetProperties();
    });
  });
});
