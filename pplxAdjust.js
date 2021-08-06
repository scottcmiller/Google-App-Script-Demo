function doesPTTMatch() {
  
}

function setAttribute(children, attribute, val){
  var value= -1;
  var localVal;
  var found = false;
  var i = 0; 
  
  while(i < children.length && !found){
    localVal = children[i].getAttributes()[0].getValue();
    
    if(localVal == attribute){
      var ogVal = children[i].getValue();

      children[i].setText(val);

      Logger.log("Modifying [" + children[i].getName() + "]... [" + ogVal + "] ---> [" +  children[i].getValue() + "]");

      found = true;
    }else
      i++;
  }
  
  return children;
  
}

function findRow(sheetAR, id){
  Logger.log("SHEETAR LEN: " + sheetAR.length);
  for(var i = 0; i < sheetAR.length; i++){
    //Logger.log("CURRENT SHEET ID: " + sheetAR[i][0] + " VS " + id);
   if(sheetAR[i][0] == id)
     return i + 1;
  }
  
  return -1;
}

function adjustDiscrepancies(sheet, id, attributes) {
  //Logger.log(id);
  var row = findRow(sheet.getDataRange().getValues(), id);
  Logger.log("POLE ROW: " + row);
  if(row > -1){
    var poleSheetInfo = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues();
    poleSheetInfo = poleSheetInfo[0];
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
    
    var poleId = poleSheetInfo[poleIdCol - 1];
    var poleClass = poleSheetInfo[poleClassCol - 1];
    var poleLength = poleSheetInfo[poleLengthCol - 1];
    var poleCircum = poleSheetInfo[poleCircumCol - 1];
    var poleSpecies = poleSheetInfo[poleSpeciesCol - 1];
    var poleTipCircum = poleSheetInfo[poleTipCircumCol - 1];
    var poleMeasuredBy = poleSheetInfo[poleMeasuredByCol - 1];
    var poleEffCircum = poleSheetInfo[poleEffCircumCol - 1];
    var poleEffCircumChecked = poleSheetInfo[poleEffCircumCheckedCol - 1];
    
    var pttId = poleSheetInfo[pttIdCol - 1];
    var pttCircum = poleSheetInfo[pttCircumCol - 1];
    var pttEffCircum = poleSheetInfo[pttEffCircumCol - 1];
    var pttPoleClass = poleSheetInfo[pttPoleClassCol - 1];
    var pttSpecies = poleSheetInfo[pttSpeciesCol - 1];
    var pttLength = poleSheetInfo[pttLengthCol - 1];
    
    var correctClass = poleSheetInfo[correctClassCol - 1];
    var expectedTipCircum = poleSheetInfo[expectedTipCircumCol - 1];
    
    Logger.log(pttId + " | " + poleId);
    if(pttId == poleId){
      //TODO - CREATE CLASS VALIDATOR
      if(poleClass != correctClass && correctClass != 'NO SPECIES TABLE'){
        attributes = setAttribute(attributes, 'Class', correctClass);
        attributes = setAttribute(attributes, 'RadiusAtTipInInches', (expectedTipCircum/2)/Math.PI);
      }
      /* -----CREATE FUNCTION TO PULL PROPER SETTING DEPTH BEFORE INTEGRATING------
      
      if(!sheet.getRange(row, poleLengthCol).isBlank() && pttLength != "TBD" && poleLength != pttLength){
        //SETTING DEPTH MUST BE MODIFIED (CURRENT NEW DELTA + (CURRENT DELTA - EXPECTED OLD DELTA)
        attributes = setAttribute(attributes, 'Length', pttLength);
        hasDataDiscrepancy = true;
      }
      */
      
      
      if(SpeciesToCode(poleSpecies) != pttSpecies){
        //--SPECIES IS PULLED FROM PTT DATA, SO CLASS CHANGE SHOULD ALREADY ACCOUNT FOR ANY DIFFERENCE---
        // TEST BEFORE INTEGRATING
        attributes = setAttribute(attributes, 'Species', CodeToSpecies(pttSpecies));
        hasDataDiscrepancy = true;
      }
      
      attributes = setAttribute(attributes, 'GLCircumMethod', "Measured");
      attributes = setAttribute(attributes, 'MeasuredRadiusGL', (pttCircum/2)/Math.PI);
      attributes = setAttribute(attributes, 'ApplyEffectiveRadiusGL', "True");
      attributes = setAttribute(attributes, 'EffectiveRadiusGL', (pttEffCircum/2)/Math.PI);
      attributes = setAttribute(attributes, 'StrengthRemainingGL', (((pttEffCircum / 2) / Math.PI) / ((pttCircum / 2) / Math.PI)));
    }
  }
  return attributes;
}
function alterPplxFiles(id, fileArray, joinedData){
  //Logger.log(joinedData.getDataRange().getValues());
  
  DriveApp.getFileById(id)
  //Array containing all poles and their info
  var blobs = [];
  
  var byteBOM;
  
  //Logger.log(fileArray.length);
  for(var i = 0; i < fileArray.length; i++){
    Logger.log("Blobs Length is currently... " + blobs.length);
    Logger.log("For LOOP: " + i);
    //Array that will contain pole info
    var poleInfo;
    //PPLD XML has a 3 byte BOM that must be removed to properly read
    var bytes = fileArray[i].getBytes();
    
    //Removing BOM bytes so XML can be parsed correctly.  
 
    //Removing BOM bytes so XML can be parsed correctly.
    byteBOM = bytes.splice(0, 3);
    Logger.log("BYTES: " + byteBOM);
    var fileName; 
    var fileExtension;
    var poleId;
    
    
    fileName = fileArray[i].getName();
    
    fileExtension = fileName.substring(fileName.length-5,fileName.length);
    
    if(verifyFileExtension(fileName, "pplx")){

      //Dumping bytes into readable string
      var data = Utilities.newBlob(bytes).getDataAsString();
      //Creating XML document
      var document = XmlService.parse(data);
      //Setting root of where pertinent data resides
      var root = document.getRootElement().getChild('PPLScene').getChild('PPLChildElements').getChild('WoodPole')
      
      //Creating array of all info under ATTRIBUTES node to then search through
      var info = root.getChild('ATTRIBUTES').getChildren();
      poleId = findAttribute(info, 'Pole Number');
      
      
      var newInfo = adjustDiscrepancies(joinedData, poleId, info)
      
      document.getRootElement().getChild('PPLScene').getChild('PPLChildElements').getChild('WoodPole').getChild('ATTRIBUTES').removeContent();
      //Logger.log(document.getRootElement().getChild('PPLScene').getChild('PPLChildElements').getChild('WoodPole').getChildren())
      var newElement;
      for(var j = 0; j < newInfo.length; j++){
        document.getRootElement().getChild('PPLScene').getChild('PPLChildElements').getChild('WoodPole').getChild('ATTRIBUTES').addContent(newInfo[j]);
      }
      
      //TODO - MAKE SURE ENCODING PROPERLY.  lower case instead of upper.
      var xml = XmlService.getPrettyFormat().format(document);
      
      Logger.log(xml.substring(0, 500));

      Logger.log("Creating New XML blob with the file name [" + fileName + "]");
      var blobFile = DriveApp.createFile(fileName, xml);
      Logger.log(" > Temporary Drive File created....")
      var blob = blobFile.getBlob();
      Logger.log(" > Blob extracted....")

      var blobBytes = blob.getBytes();
      //ERROR CHECK: Make sure File is not empty.  If it is, run again.
      Logger.log("Blobs Length is currently... " + blobs.length);
      if(((blobBytes.length / bytes.length) * 100) > 90){
        blobBytes = byteBOM.concat(blobBytes);
        blob = Utilities.newBlob(blobBytes);
        blob.setName(fileName);

        Logger.log("FILE IS " + ((blobBytes.length / bytes.length) * 100) + "% of Original File");
        //TODO - INCONSISTENT ERROR ON XML INJECTION TO ZIP? AA ran into an error where a random pplx file would load into zip as blank
        //       FIX - Check file size and anything under X bytes should be re-ran before adding to blobs array
        Logger.log("newBlob length after ByteBom Concat...." + blob.length);

        Logger.log("Blobs Length is currently... " + blobs.length);
        blobs.push(blob);
        Logger.log("File Creation Successful! Pushing [" + fileName + "] into blob array");
        Logger.log("Blobs Length is now... " + blobs.length);
      }
      else{
        Logger.log("ERROR! FILE LESS THAN 90 of ORIGINAL SIZE @ " + ((blobBytes.length / bytes.length) * 100) + "%");
        Logger.log("Retrying... WARNING: may cause fatal loop error. Standby....")
        //Reset and retry
        i--;
      }
      
    }else{
      Logger.log("Non-pplx file detected...  Pushing [" + fileName + "] as-is" )
      // MAY NEED TO .setContentType('null')
      blobs.push(fileArray[i].setName(fileName).setContentType('null'));
    }

    Logger.log("END OF LOOP, BREAKING OUT TO TOP OF Loop");
    Logger.log("Blobs Length is now... " + blobs.length);
  }

  //TODO - LOG HOW MANY LOOPS VS EXPECTED #
  Logger.log("\nFILE ANALYSIS COMPLETED! Zipping files into PPLLD container....");

  var date = new Date();
  //Get Name of original file
  var ogFile = DriveApp.getFileById(id).getBlob().setContentType("application/zip");
  var zipName = ogFile.getName();

  var ogBlobs = Utilities.unzip(ogFile);

  Logger.log("File Dump...Current Blob Array has [" + blobs.length + "] files. Original has [" +ogBlobs.length+"] files");

  for(var x = 0; x < blobs.length; x++){
    Logger.log(x + 1 + " - " + blobs[x].getName());
    if(blobs[x].getName() === null){
      blobs.splice(x, 1);
      //TODO - FIGURE OUT WHY NULL OBJECTS BEING ADDED TO FILE
      Logger.log("NULL OBJECT REMOVED!");
    }
  }
  var zipBlob = Utilities.zip(blobs, zipName.substring(0, zipName.length - 6) + "_" + date.getTime() + ".pplld");
  var zipFile = DriveApp.createFile(zipBlob);
  var zipId = zipFile.getId();

  
  if(((zipFile.getSize() / blobs.length) * 100) > 20){
    Logger.log("Zip Created! CONTAINS " + blobs.length + " files. File ID is " + zipId);
    Logger.log("File Size Check PASSED! File is " + ((zipFile.getSize() / ogFile.getBytes().length) * 100) + "% of original blob array size.");
    return zipId;
  }
  else{
    Logger.log("Zip Created! CONTAINS " + blobs.length + " files. File ID is " + zipId);
    Logger.log("File Size Check FAILED! File is " + ((zipFile.getSize() / ogFile.getBytes().length) * 100) + "% of original blob array size.");
    Logger.log("RE-RUNNING ANALYSIS...WARNING: May cause fatal loop error as-is");

    return alterPplxFiles(id, fileArray, joinedData);
  }
}