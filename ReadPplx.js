//Get Google File ID from URL string
function getIdFromUrl(url) { 
  Logger.log(url.match(/[-\w]{25,}/));
  
  return url.match(/[-\w]{25,}/); 
}


//Get PPLLD file from link submitted with Google Form Upload
function getPPLLD(id){
  Logger.log(id);
  var theFile = DriveApp.getFileById(id);
  
  //Logger.log(theFile.getName());
  
  return theFile.getBlob();
}


//Unzips file (PPLLD is a .zip container
//Returns file array of .pplx
function unZip(file){
  Logger.log(file.getContentType());
  file.setContentType("application/zip");
  
  var unZipped = Utilities.unzip(file);
  
  return unZipped;
}

function createPplxRecordTable(fileArray){
  //Array containing all poles and their info
  var poleArray = [];
  
  //Logger.log(fileArray.length);
  for(i = 0; i < fileArray.length; i++){
    Logger.log("FILE CONTENT TYPE: "+fileArray[i].getContentType())
    //Array that will contain pole info
    var poleInfo;
    //PPLD XML has a 3 byte BOM that must be removed to properly read
    var bytes = fileArray[i].getBytes();
    if(bomCheck(bytes)){
      //Removing BOM bytes so XML can be parsed correctly.
      Logger.log("SPLICING OUT BOM....")
      bytes.splice(0, 3);
    }
    
    var fileName; 
    var fileExtension;
    var poleId;
    var poleClass
    var poleLength;
    var poleSpecies;
    var poleTipCircum;
    var poleCircumMethod;
    var poleMeasuredGl;
    var poleEffectiveGLApplied;
    var poleEffectiveGl;
    
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
      
      //Setting variables
      poleId = findAttribute(info, 'Pole Number');
      poleClass = findAttribute(info, 'Class');
      poleLength = findAttribute(info, 'LengthInInches') / 12;
      poleSpecies = findAttribute(info, 'Species');
      poleTipCircum = (((findAttribute(info, 'RadiusAtTipInInches') * Math.PI) * 2)).toFixed(1);
      poleCircumMethod = findAttribute(info, 'GLCircumMethod');
      poleMeasuredGl = (((findAttribute(info, 'MeasuredRadiusGL') * Math.PI) * 2)).toFixed(1);
      poleEffectiveGLApplied = findAttribute(info, 'ApplyEffectiveRadiusGL');
      poleEffectiveGl = (((findAttribute(info, 'EffectiveRadiusGL') * Math.PI) * 2)).toFixed(1);
      
      //Filling pole info array
      poleInfo = [poleId,poleClass,poleLength,poleSpecies,poleTipCircum, poleCircumMethod,poleMeasuredGl,poleEffectiveGLApplied,poleEffectiveGl];
      
      //Adding to poleArray
      poleArray.push(poleInfo);
    }
  }
    
    return poleArray;
}
  
function printArray(ar){
    for(i = 0; i < ar.length; i++)
      Logger.log(ar[i]);
}

function getSetAr(link){
  var fileId = getIdFromUrl(link);
  var zippedFile = getPPLLD(fileId);
  var rawFile = unZip(zippedFile);
  
  return createPplxRecordTable(rawFile);
}
               
function findAttribute(children, attribute){
  var value= -1;
  var localVal;
  var found = false;
  var i = 0; 
  
  while(i < children.length && !found){
    localVal = children[i].getAttributes()[0].getValue();
    
    if(localVal == attribute){
      value = children[i].getValue();
      found = true;
    }else
      i++;
  }
  
  return value;
  
}

function verifyFileExtension(fileName, extension) {
  if(fileName.substring(fileName.length - (extension.length), fileName.length) == extension){
    return true;
  }
  else
    return false;
}
