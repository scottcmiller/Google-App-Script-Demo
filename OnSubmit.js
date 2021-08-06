function OnSubmit() {
  var sheet = SpreadsheetApp.openById('1Mz5oLdW7g3niUqKNcm6f7za6yMhc-Ji96Ro2TpBiKCQ').getSheetByName('Form Responses 1');
  
  var pplldLink = sheet.getRange(sheet.getLastRow(), 2).getValue();
  var pttLink = sheet.getRange(sheet.getLastRow(), 3).getValue();
  
  var newSheet = DriveApp.getFileById('1u7APCQmHmal8Uv4FMOpb1lAFX6CUAB768IUHViXrpOQ').makeCopy().getId();
  DriveApp.getFileById(newSheet).moveTo(DriveApp.getFolderById('1hpur7IYzVsLx-bs6l14Jin_uCmiL0hi1'));
  
  Logger.log(pplldLink);
  Logger.log(pttLink);
  Logger.log(newSheet);
  DriveApp.getFileById(newSheet).setName(getPPLLD(getIdFromUrl(pplldLink)).getName() + " | " + sheet.getRange(sheet.getLastRow(), 1).getValue());
  var currentRow = sheet.getLastRow();
  sheet.getRange(currentRow, 5).setValue(SpreadsheetApp.openById(newSheet).getUrl());
  sheet.getRange(currentRow, 5).setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
  printToSheet(newSheet, pplldLink, pttLink);
  
  analyzePTTExact(newSheet);
  
  removeEmptyRows(SpreadsheetApp.openById(newSheet).getSheetByName("Data"));
  
  colorizeDiscrepanies(SpreadsheetApp.openById(newSheet), "Data");
  var newFile = alterPplxFiles(getIdFromUrl(pplldLink), unZip(getPPLLD(getIdFromUrl(pplldLink))),SpreadsheetApp.openById(newSheet).getSheetByName('Data'));
  DriveApp.getFileById(newFile).setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  sheet.getRange(currentRow, 6).setValue(DriveApp.getFileById(newFile).getUrl());
  sheet.getRange(currentRow, 6).setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
}

function manualAlter(){
  //Logger.log();
  //1i7MPnwjVn6l4x4nnsEWZhaSBgMf7jGva
  alterPplxFiles('1di-s0njG7pgD93z42miU2WOGwCmLWRe9', unZip(getPPLLD('1di-s0njG7pgD93z42miU2WOGwCmLWRe9')), SpreadsheetApp.openById('1vnfgstMMEt7QLTPy41_BUgRA5NOLZ2GS2kSmi2HJjtI').getSheetByName('Data'));
  //alterPplxFiles('1i7MPnwjVn6l4x4nnsEWZhaSBgMf7jGva', unZip(getPPLLD('1i7MPnwjVn6l4x4nnsEWZhaSBgMf7jGva')), SpreadsheetApp.openById('19Y9PJhyrjNFKdO_uO5AqqNn2WZp3dJPtpRVvvDKqTLQ').getSheetByName('Data'));
}
