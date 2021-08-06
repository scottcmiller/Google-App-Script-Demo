function matchingId(ptt, ocalc) {
  var i = 0;
  
  var matches = [];
  
  for(i = 0; i < ocalc.length ; i++){
    var j = 0;
    
    matches[i] = -1;
    var match = false;
  
    while(!match && j < ptt.length){
      //Logger.log(ocalc[i][0] +" | " + ptt[j][0]);
      if(ocalc[i][0] == ptt[j][0]){
         match = true;
         matches[i] = j;
      }else{
        j++;
      }
    }
  }
  
  return matches;
}

function mergeData(ptt, ocalc, matches){
  var mergedAr = [];
  //Logger.log(matches);
  for(i = 0; i < ocalc.length; i++){
    if(matches[i] != -1){
      mergedAr.push(ocalc[i].concat(ptt[matches[i]]));
    }else{
    mergedAr.push(ocalc[i]);
    }
  }
  
  return mergedAr;
}
  
function Merge(pplldLink, pttLink){
  
  var setAr = getSetAr(pplldLink);
  var pttAr = getSortedCSV(pttLink);
  var matches = matchingId(pttAr, setAr);
  
  return (sortByCol(mergeData(pttAr, setAr, matches), 1));
  
}

function sortByCol(pttAr, col){
 return pttAr.sort(function(x,y){
      var xid = x[col - 1];
      var yid = y[col - 1];
      var xdate = new Date(x[6]);
      var ydate = new Date(y[6]);
   return xid == yid ? 0 : xid < yid ? -1 : 1;
    });
  
}