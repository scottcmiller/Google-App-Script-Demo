function GetPTTDataAr(id) {
  var file;
  var csv;
  
  file = DriveApp.getFileById(id);
  csv = file.getBlob().getDataAsString('ISO-8859-1');
  
  csv = csv.replaceAll('"', '');
  
  return Utilities.parseCsv(csv);
}

String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.replace(new RegExp(search, 'g'), replacement);
}

function getSortedCSV(link){
  var id = getIdFromUrl(link);
  
  var pttAr = GetPTTDataAr(id);
  
  var pttArRaw = [];
  
  for(i = 1; i < pttAr.length; i++)
    pttArRaw.push(pttAr[i]);
  
  return (cleanPtt(sortPtt(pttArRaw)));
}

function sortPtt(pttAr){
 return pttAr.sort(function(x,y){
      var xid = x[0];
      var yid = y[0];
      var xdate = new Date(x[6]);
      var ydate = new Date(y[6]);
   //Logger.log(xdate);
  // Logger.log(xdate.getTime());
   //Logger.log(ydate);
   //Logger.log(ydate.getTime());
   return xid == yid ? (xdate == ydate ? 0 : xdate.getTime() > ydate.getTime() ? -1: 1) : xid < yid ? -1 : 1;
    });
  
}

function cleanPtt(sortedPtt){
  //printAr2d(sortedPtt);
  var newPttAr = [];
  var lastPushed = [];
  
  for(i = 0; i < sortedPtt.length; i++){
    if(sortedPtt[i][4] != 0){
      if(lastPushed.length < 1 || sortedPtt[i][0] != lastPushed[0]){
        newPttAr.push(sortedPtt[i]);
        lastPushed = sortedPtt[i];
      }
    }
  }
  
  return newPttAr;
}

function printAr2d(ar){
  for(var i in ar){
    var str = '';
    for(var j in ar[i]){
      str += ar[i][j] + " | ";
    }
    Logger.log(str);
  }
}