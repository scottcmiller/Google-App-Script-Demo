function printToSheet(sheetID, pplldLink, pttLink) {
  var dataSheet = SpreadsheetApp.openById(sheetID).getSheetByName('Data');
  var QCSheet = SpreadsheetApp.openById(sheetID).getSheetByName('Feedback');
  var data = Merge(pplldLink, pttLink);
  
  for(i = 0; i < data.length; i++){
    QCSheet.getRange(i+2, 1).setValue(data[i][0]);
    QCSheet.getRange(i+2, 1, 1, QCSheet.getLastColumn()).setBorder(true, true, true, true, true, true)
    try{
      for(j = 0; j < data[i].length; j++){
        dataSheet.getRange(i + 2, j+1).setValue(data[i][j]);
      }
    }catch(e){
      Logger.log(i);
      Logger.log(data);
    }
  }
}
