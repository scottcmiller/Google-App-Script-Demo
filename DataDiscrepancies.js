function testColorize(){
  colorizeDiscrepanies(SpreadsheetApp.openById('1mqbSySp0t6e32I6kLCr2BQKCmgt-ROLW78mTb9X8Ii0'), 'Data');
  
}

function colorizeDiscrepanies(ss, sheetName){
  var sheet = ss.getSheetByName(sheetName);
  
  sheet.getDataRange().setBackground('#FFFFFF');
  for(i = 1; i < sheet.getLastRow(); i++){
    Logger.log(i);
    matchingPTT(sheet, i + 1);
    Logger.log("Properly existed matchingPTT");
  }
}

function matchingPTT(sheet, row) {
  //Reset Colors
  sheet.getRange(row, 1, 1, sheet.getLastColumn()).setBackground('#efefef');
  
  
  //Set to true if any conditionals are triggered
  var hasDataDiscrepancy  = false;
  
  var poleIdCol         = 1;
  var poleClassCol      = 2;
  var poleLengthCol     = 3;
  var poleSpeciesCol    = 4;
  var poleTipCircumCol  = 5;
  var poleMeasuredByCol = 6;
  var poleCircumCol     = 7; 
  var poleEffCircumCheckedCol = 8;
  var poleEffCircumCol  = 9;
  
  var pttIdCol         = 10;
  var pttCircumCol     = 14;
  var pttEffCircumCol  = 15;
  var pttPoleClassCol  = 17;
  var pttSpeciesCol    = 18;
  var pttLengthCol = 19;
  
  var correctClassCol = 20;
  var expectedTipCircumCol = 21;
  
  var poleId = sheet.getRange(row, poleIdCol).getValue();
  var poleClass = sheet.getRange(row, poleClassCol).getValue();
  var poleLength = sheet.getRange(row, poleLengthCol).getValue();
  var poleCircum = sheet.getRange(row, poleCircumCol).getValue();
  var poleSpecies = sheet.getRange(row, poleSpeciesCol).getValue();
  var poleTipCircum = sheet.getRange(row, poleTipCircumCol).getValue();
  var poleMeasuredBy = sheet.getRange(row, poleMeasuredByCol).getValue();
  var poleEffCircum = sheet.getRange(row, poleEffCircumCol).getValue();
  var poleEffCircumChecked = sheet.getRange(row, poleEffCircumCheckedCol).getValue();
  
  var pttId = sheet.getRange(row, pttIdCol).getValue();
  var pttCircum = sheet.getRange(row, pttCircumCol).getValue();
  var pttEffCircum = sheet.getRange(row, pttEffCircumCol).getValue();
  var pttPoleClass = sheet.getRange(row, pttPoleClassCol).getValue();
  var pttSpecies = sheet.getRange(row, pttSpeciesCol).getValue();
  var pttLength = sheet.getRange(row, pttLengthCol).getValue();
  
  var correctClass = sheet.getRange(row, correctClassCol).getValue();
  var expectedTipCircum = sheet.getRange(row, expectedTipCircumCol).getValue();
  
  // darker red highlight("#ea9999");
  // light red highlight("#f4cccc");
  if(!sheet.getRange(row, pttIdCol).isBlank()){
    //Do ID's Match?
    if(pttId != poleId){
      sheet.getRange(row, poleIdCol).setBackground("#ea9999");
      sheet.getRange(row, pttIdCol).setBackground("#ea9999");
      hasDataDiscrepancy = true;
    }
    
    if(poleClass != correctClass){
      sheet.getRange(row, poleClassCol).setBackground("#ea9999");
      sheet.getRange(row, correctClassCol).setBackground("#ea9999");
      hasDataDiscrepancy = true;
    }
    if(poleClass != pttPoleClass){
      sheet.getRange(row, poleClassCol).setBackground("#ea9999");
      sheet.getRange(row, pttPoleClassCol).setBackground("#ea9999");
      hasDataDiscrepancy = true;
    }
    if(!sheet.getRange(row, poleLengthCol).isBlank() && pttLength != "TBD" && poleLength != pttLength){
      sheet.getRange(row, poleLengthCol).setBackground("#ea9999");
      sheet.getRange(row, pttLengthCol).setBackground("#ea9999");
      hasDataDiscrepancy = true;
    }
    if(SpeciesToCode(poleSpecies) != pttSpecies){
      sheet.getRange(row, poleSpeciesCol).setBackground("#ea9999");
      sheet.getRange(row, pttSpeciesCol).setBackground("#ea9999");
      hasDataDiscrepancy = true;
    }
    //Check if pole has had any circum data entered
    //If not, highlight Pole Measured By
    //If so, highlight any discrepancies between ocalc and ptt
    if(poleMeasuredBy != "Measured"){
      sheet.getRange(row, poleMeasuredByCol).setBackground("#ea9999");
      hasDataDiscrepancy = true;
    }
    else{
      if(poleCircum != pttCircum){
        sheet.getRange(row, poleCircumCol).setBackground("#ea9999");
        sheet.getRange(row, pttCircumCol).setBackground("#ea9999");
        hasDataDiscrepancy = true;
      }
      //Check if eff circum was checked.  if not, highlight boolean column.  
      //Else, highlight any discrepancy
      if(poleEffCircumChecked != true){
        sheet.getRange(row, poleEffCircumCheckedCol).setBackground("#ea9999");
        hasDataDiscrepancy = true;
      }else
        if(poleEffCircum != pttEffCircum){
          sheet.getRange(row, poleEffCircumCol).setBackground("#ea9999");
          sheet.getRange(row, pttEffCircumCol).setBackground("#ea9999");
          hasDataDiscrepancy = true;
        }
    }
    
    if(pttPoleClass != correctClass){
       sheet.getRange(row, pttPoleClassCol).setBackground("#ea9999");
       sheet.getRange(row, correctClassCol).setBackground("#ea9999");
       hasDataDiscrepancy = true;
    }
    if(poleTipCircum != expectedTipCircum){
       sheet.getRange(row, poleTipCircumCol).setBackground("#ea9999");
       sheet.getRange(row, expectedTipCircumCol).setBackground("#ea9999");
       hasDataDiscrepancy = true;
    }
    
    if(hasDataDiscrepancy){
      if(sheet.getRange(row, poleIdCol).getBackground() == '#efefef'){
        sheet.getRange(row, poleIdCol).setBackground('#f4cccc');
      }
    }else
      sheet.getRange(row, 1, 1, sheet.getLastColumn()).setBackground('#ffffff');
  }else
    sheet.getRange(row, 1, 1, sheet.getLastColumn()).setBackground('#ffffff');
  
}
