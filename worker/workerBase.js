var showLogs = true;
var currentLoggedNumber = 0;
var currentIteration = 0;

function log() {
  if (!showLogs) return;
  
  var currentDate = new Date();
  var hours = '' + currentDate.getHours();
  if (hours.length < 2) hours = '0' + hours;
  var minutes = '' + currentDate.getMinutes();
  if (minutes.length < 2) minutes = '0' + minutes;
  var seconds = '' + currentDate.getSeconds();
  if (seconds.length < 2) seconds = '0' + seconds;
  var millis = '' + currentDate.getMilliseconds();
  while (millis.length < 3) millis = '0' + millis;
  var message = hours + ':' + minutes + ':' + seconds + '.' + millis;
  
  message += '/' + currentIteration;
  
  currentLoggedNumber++;
  if (currentLoggedNumber > 100) {
    message = "Too many logs, disabling for this iteration";
    showLogs = false;
  } else {
    for (var c=0;c<arguments.length;c++) {
      message += ' - ';
      var currentArg = arguments[c];
      
      if (typeof currentArg == "string") {
        message += currentArg;
      } else {
        message += JSON.stringify(currentArg);
      }
    }
  }

  postMessage(["log", message]);
}

var Break = {toString: function() {return "Break";}};

function forEach(array, action) {
  try {
    for (var i = 0; i < array.length; i++) {
      if (action(array[i], i, array.length) === false) break;
    }
  }
  catch (exception) {
    if (exception != Break)
      throw exception;
  }
}

function forEachIn(object, action) {
  for (var property in object) {
    if (Object.prototype.hasOwnProperty.call(object, property))
      if (action(property, object[property]) === false) break;
  }
}



var currentOutputLine = "";

function print() {
  for (var c=0;c<arguments.length;c++) {
    if (c > 0) {
      currentOutputLine += " ";
    }
    if (typeof(arguments[c]) == "object") {
      if (Arrays.isArray(arguments[c])) {
        for (var d=0;d<arguments[c].length;d++) {
          if (d > 0) {
            currentOutputLine += " ";
          }
          currentOutputLine += arguments[c][d];
        }
      } else {
        currentOutputLine += arguments[c];
      }
    } else {
      currentOutputLine += arguments[c];
    }
  }
}

function println() {
  print.apply(null, arguments);
  currentOutputLine += "\n";
}


function getOutputLine() {
  return currentOutputLine;
}

function resetOutputLine() {
  currentOutputLine = '';
}

var currentInput = [];

function readLine() {
  return currentInput.shift();
}

function readInt() {
  return parseInt(readLine());
}

function readStrings() {
  return readLine().split(' ');
  var returnValue = [];
  for (var c=0;c<parts.length;c++) {
    returnValue.push(parseInt(parts[c]));
  }
  
  return returnValue;
}

function readInts() {
  var parts = readStrings();
  var returnValue = [];
  for (var c=0;c<parts.length;c++) {
    returnValue.push(parseInt(parts[c]));
  }
  
  return returnValue;
}

function readFloats() {
  var parts = readStrings();
  var returnValue = [];
  for (var c=0;c<parts.length;c++) {
    returnValue.push(parseFloat(parts[c]));
  }
  
  return returnValue;
}

function smartRead(firstIsCount) {
  var parts = readStrings();
  
  var total = parts.length;
  
  if (typeof firstIsCount == "undefined") {
    var firstNumber = parseInt(parts[0]);
    if ((total > 1) && 
        (!isNaN(firstNumber))&&
        ((total - 1)%firstNumber == 0)
        ) {
      isFirstCount = true;
    }
  }
  if (isFirstCount) {
    total = parseInt(parts.shift());
  }
  var perGroup = Math.floor(parts.length / total);
  for (var c=0;c<total;c++) {
    var resultPart;
    if (perGroup > 1) {
      resultPart = [];
    }
    for (var d=0;d<perGroup;d++) {
      var newPart = parts[c*perGroup+d];
      if (newPart.indexOf('.') > -1) {
        if (!isNaN(parseFloat(newPart))) {
          newPart = parseFloat(newPart);
        }
      } else {
        if (!isNaN(parseInt(newPart))) {
          newPart = parseInt(newPart);
        }
      }
      if (perGroup > 1) {
        resultPart.push(newPart);
      } else {
        parts[c*perGroup+d] = newPart;
      }
    }
    if (perGroup > 1) {
      parts[c] = resultPart;
    }
  }
  
  parts.length = total;

  return parts;
}

onmessage = function(event) {
  var data = event.data;
  
  currentInput = data[0].split("\n");
  
  try {
    importScripts(data[1]);
  } catch (e) {
    log('Exception while loading program', e.stack);
    return;
  }
  var totalCases = readInt();
  
  var numCases = data[2];
  
  if ((numCases < 1)|| (numCases > totalCases)) {
    numCases = totalCases;
  }
  
  var realProgramOutput = "";
  
  nullifyCache();
  
  for (var c=1;c<=numCases;c++) {
    currentIteration = c;
    if (numCases <= 1000) {
      log("Starting iteration " + c);
    }
    showLogs = true;
    currentLoggedNumber = 0;
    resetOutputLine();
    program();
    realProgramOutput += 'Case #' + c + ': ' + getOutputLine() + "\n";
  }
  
  postMessage(["result", realProgramOutput]);
}
