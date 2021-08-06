function getTableSheet(species) {
  var ss = SpreadsheetApp.openById("1xAZQsLdFBDF57PnK0mBFg4QldleI03Nx8UjnpRL6Gr0")
  
  var tableAr;
  
  if(species == "DF" || species == "SP")
     return ss.getSheetByName("DF / SP")
  else if(species == "WC" || species == "WP")
    return ss.getSheetByName("WC / WP");
  else if(species == "JP" || species == "LP" || species == "CP" || species == "NP")
    return ss.getSheetByName('JP / LP / CP / NP');

    //TODO: VERIFY NO CATASTROPHIC FAILURE BY SETTING "NA" to DF/SP Sheet
  else if(species == "NA")
   return ss.getSheetByName("DF / SP")
  else
    return -1;
}

/* 
FUNCTION - getCircumSheet
  Gets circum data based on species
  TODO: Verify all circum specs are directly derived from class
        without respect to species.  If true, auto pull data from table.
*/
function getCircumSheet(species) {
  var ss = SpreadsheetApp.openById("1_gNiZiWMEfFNo-EZIc3VBhCpSeTix9uf30auewJscHc");
  
  var tableAr;
  
  if(species == "DF" || species == "SP")
     return ss.getSheetByName("DF / SP")
  else if(species == "WC" || species == "WP")
    return ss.getSheetByName("WC / WP");
  else if(species == "JP" || species == "LP" || species == "CP" || species == "NP")
    return ss.getSheetByName('JP / LP / CP / NP');
   else
     return -1;
}

function getTipCircum(species, poleClass){
  var sheet = getCircumSheet(species);
  if(sheet != -1){
    sheet = sheet.getDataRange().getValues();
    for(var i = 0; i < sheet[0].length; i++){
      if(sheet[0][i] == poleClass)
        return sheet[1][i];
    }
    
    return -1;
  }
}

function getTableValues(tableSheet){
  return tableSheet.getRange(2,2,tableSheet.getLastRow(), tableSheet.getLastColumn()).getValues();
}
function getColumn(pttClass, sheet){
  var classes = sheet.getRange(1, 2, 1, sheet.getLastColumn()).getValues();
  
  var column = -1;

  for(var i = 0; i < classes[0].length; i++)
    if(classes[0][i] == pttClass)
      column = i + 2;
  return column;
}
function getRow(pttLength, sheet){
  var length = sheet.getRange(2, 1, sheet.getLastRow(), 1).getValues();
  
  var row = -1;

  for(var i = 0; i < length.length; i++)
    if(length[i] == pttLength)
      row = i + 2;
  
  return row;
}

function getTableCircum(sheet, row, col){
  return sheet.getRange(row, col).getValue();
}

function test(){
  var pttLength = 75;
  var pttClass = 3;
  var species = "DF";
  
  var tableSheet = getTableSheet(species);
  
  var lengthRow = getRow(pttLength, tableSheet);
  var classCol = getColumn(pttClass, tableSheet);
  
  //Logger.log("INPUT: Length = " + pttLength + " | Class = " + pttClass + " | Species = " + species)
  //Logger.log("OUTPUT");
  //Logger.log("Row = " + lengthRow);
 // Logger.log("Column = " + classCol);
  //Logger.log("Expected Cirum = " + getTableCircum(tableSheet, lengthRow, classCol));
}

function readPttLine(row, pttSheet){
  var idCol = 1;
  var circumCol = 14;
  var poleClassCol = 17;
  var speciesCol = 18;
  var lengthCol = 3;
  
  var pttData = [pttSheet.getRange(row, idCol).getValue(), 
                 pttSheet.getRange(row, circumCol).getValue(), 
                 pttSheet.getRange(row, poleClassCol).getValue(),
                 pttSheet.getRange(row, speciesCol).getValue(),
                 pttSheet.getRange(row, lengthCol).getValue()];
  //Logger.log(pttData);
 return pttData;
}

function classAnalysisExact(pttData){
  var tableSheet = getTableSheet(pttData[3]);
  
  var tableCircum;
  var pttCircum = pttData[1];
  
  
  
  var lastCol = 16;
  var firstCol = 2;
  
  var requiresChange = false;
  
  if(tableSheet != -1){
    
    var classRow = getRow(pttData[4], tableSheet);
    var classCol = getColumn(pttData[2], tableSheet);
    var newClassCol = classCol;
    var currentCircum;
    
    tableCircum = getTableCircum(tableSheet, classRow, classCol);
    var newCircum;
    
    if(pttCircum != tableCircum){
      if(pttCircum > tableCircum){
        if(classCol - 2 >= firstCol){
          newCircum = getTableCircum(tableSheet, classRow, classCol - 2);
          if(newCircum !== ''){
            Logger.log(tableCircum + " | " + pttCircum + " | " + newCircum);
            if(pttCircum >= newCircum){
              requiresChange = true;
              newClassCol = classCol - 2;
              while(newClassCol - 1 >= firstCol && requiresChange){
                newCircum = getTableCircum(tableSheet, classRow, newClassCol - 1);
                if(newCircum !== '' && pttCircum >= newCircum){
                  newClassCol = newClassCol - 1;
                }else{
                  requiresChange = false;
                }
              }
            }
          }
        }
      }else{
        if(classCol + 1 <= lastCol){
          newCircum = getTableCircum(tableSheet, classRow, classCol + 1);
          if(newCircum !== ''){
            Logger.log(tableCircum + " | " + pttCircum +" | "+newCircum);
            if(pttCircum < newCircum){
              if(getTableCircum(tableSheet, classRow, classCol + 2) !== ''){
                newClassCol = classCol + 2;
                requiresChange = true;
              }
              while(newClassCol + 1 <= lastCol && requiresChange){
                currentCircum = getTableCircum(tableSheet, classRow, newClassCol);
                newCircum = getTableCircum(tableSheet, classRow, newClassCol + 1);
                if(newCircum !== '' && pttCircum < currentCircum){
                  newClassCol = ++newClassCol;
                }else{
                  requiresChange = false;
                }
              }
            }
          }
        }
      }
    }
    return getTableSheet(pttData[3]).getRange(1, newClassCol).getValue();
  }else{
    requiresChange = true;
    return -1;
  }
  Logger.log(requiresChange);
  
}

function analyzePTTExact(id){
  var sheet = SpreadsheetApp.openById(id).getSheetByName('Data');
  
  //Logger.log("Last Row = " + sheet.getLastRow());
  var i = 0;
  var newClass = false;
  var newCircum;
  
  for(i = 2; i <= sheet.getLastRow(); i++){
    var pttData = readPttLine(i, sheet);
    
    newClass = classAnalysisExact(pttData);
    newCircum = getTipCircum(pttData[3], newClass);
    if(sheet.getRange(i, 10).isBlank())
        sheet.getRange(i, 20).setValue('');
    else{
      sheet.getRange(i, 20).setValue(newClass);
      sheet.getRange(i, 21).setValue(newCircum);
    }
    /*
    if(newClass != -1 && newClass != pttData[2] && !sheet.getRange(i, 9).isBlank()){
      sheet.getRange(i, 1, 1, sheet.getLastColumn()).setBackground("#f4cccc");
      sheet.getRange(i, 2).setBackground("#ea9999");
      sheet.getRange(i, 16).setBackground("#ea9999");
      sheet.getRange(i, 19).setBackground("#ea9999");
    }
    */
    
    //FIX FOR NO SPECIES DATA
    /*TODO : IMPLEMENT CLASS VERIFICATION.  MAKE SURE PTT HAS CLASS, THEN SET TO THAT CLASS AND TIP.  OTHERWISE, DO NO TOUCH.*/
    
    if(newClass == -1 && !sheet.getRange(i, 10).isBlank()){
      sheet.getRange(i, 20).setValue(pttData[2]);
      sheet.getRange(i, 21).setValue(getTipCircum("DF", pttData[2]));
      //sheet.getRange(i, 19).setBackground("#ea9999");
      //sheet.getRange(i, 1).setBackground("#f4cccc");
    }
    
   // Logger.log("i = " + i);
  }
}