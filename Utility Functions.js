 function removeEmptyRows(sheet){
  var sh = sheet;
  var maxRows = sh.getMaxRows(); 
  var lastRow = sh.getLastRow();
  
  if(lastRow < maxRows)
    sh.deleteRows(lastRow+1, maxRows-lastRow);
}


//Turn Species name into PTT/ taper chart species code
function SpeciesToCode(species) {
  var speciesCode;
  
  switch(species){
    case "DOUGLAS FIR":
      speciesCode = "DF";
      break;
    case "PONDEROSA PINE":
      speciesCode = "WP";
      break;
    case "WESTERN RED CEDAR":
      speciesCode = "WC";
      break;  
    case "JACK PINE":
      speciesCode = "JP";
      break;
    case "LODGEPOLE PINE":
      speciesCode = "LP";
      break;  
    case "RED PINE":
      speciesCode = "NP";
      break;
    //NO CODE YET
    case "REDWOOD":
      speciesCode = 'NA REDWOOD';
      break;
    //NO CODE YET
    case "SITKA SPRUCE":
      speciesCode = 'NA SITKA';
      break;  
    case "WESTERN FIR":
      speciesCode = 'NA WESTERN FIR';
      break;
    //NO CODE YET
    case "WHITE SPRUCE":
      speciesCode = "NA WHITE SPRUCE";
      break;  
    case "ALASKA YELLOW CEDAR":
      speciesCode = "YC";
      break;  
    case "OTHER":
      speciesCode = "NA";
      break;  
    case "SOUTHERN PINE":
      speciesCode = "SP";
      break;  
    case "WESTERN LARCH":
      speciesCode = "WL";
      break;  
    default:
      speciesCode = "NA"
      break; 
  }
  
  return speciesCode;
}

//Turn Species name into PTT/ taper chart species code
//NA IF ERROR

function CodeToSpecies(species) {
  var speciesCode;
  
  switch(species){
    case "DF":
      speciesCode = "DOUGLAS FIR";
      break;
    case "WP":
      speciesCode = "PONDEROSA PINE";
      break;
    case "WC":
      speciesCode = "WESTERN RED CEDAR";
      break;  
    case "JP":
      speciesCode = "JACK PINE";
      break;
    case "LP":
      speciesCode = "LODGEPOLE PINE";
      break;  
    case "NP":
      speciesCode = "RED PINE";
      break;
    //NO CODE YET
    /*
    case 'NA':
      speciesCode = "REDWOOD";
      break;
    //NO CODE YET
    case 'NA':
      speciesCode = "SITKA SPRUCE";
      break;  
    case "NA":
      speciesCode = "WESTERN FIR";
      break;
    //NO CODE YET
    case 'NA':
      speciesCode = "WHITE SPRUCE";
      */
      break;  
    case 'YC':
      speciesCode = "ALASKA YELLOW CEDAR";
      break;  
    case "NA":
      speciesCode = "OTHER";
      break;  
    case 'SP':
      speciesCode = "SOUTHERN PINE";
      break;  
    case 'WL':
      speciesCode = "WESTERN LARCH";
      break;  
    default:
      speciesCode = "NOT AVAILABLE"
      break; 
  }
  
  return speciesCode;
}

function verifyClass(species, poleClass){
  var speciesTable = getTableSheet(species);

  var tableData = speciesTable.getRange(1, 2, speciesTable.getLastRow(), speciesTable.getLastColumn()).getValues()[0];

  var classExists = false;
  var i = 0;

  while(i < tableData.length && !classExists){
    if(tableData[i] == poleClass){
      classExists = true;
    }else{
      i++;
    }
  }

  return classExists;
}

function bomCheck(fileBytes){
  var hasBom = false;

  if(fileBytes[0] == -17 && fileBytes[1] == -69 && fileBytes[2] == -65){
    hasBom = true;
  }

  return hasBom;
}