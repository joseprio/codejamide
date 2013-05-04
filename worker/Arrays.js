
/*!
 * Arrays Libary v1.0
 * http://joseprio.com/
 *
 * Copyright 2012, Josep del Rio
 * Licensed under the MIT license.
 *
 *
 * Date: Mon Apr 15 12:23:00 2012 +0100
 * 
 * New functions:
 *
 * Arrays.create(m, n, ...)
 * Creates a new multidimensional array of dimensions m*n*...
 * 
 * Arrays.isArray(a)
 * Returns true if a is an array, false otherwise
 *
 * Java equivalent function support:
 *
 * static int binarySearch(Object[] a, int fromIndex, int toIndex, Object key)
 * static int binarySearch(Object[] a, Object key) 
 * static boolean equals(Object[] a, Object[] a2) 
 * static void fill(Object[] a, int fromIndex, int toIndex, Object val) 
 * static void fill(Object[] a, Object val) 
 * static void sort(Object[] a)
 * static void sort(Object[] a, Comparator c)
 * static void sort(Object[] a, int fromIndex, int toIndex)
 * static void sort(Object[] a, int fromIndex, int toIndex, Comparator c)
 * static String toString(Object[] a)
 * static boolean deepEquals(Object[] a1, Object[] a2) 
 * static String deepToString(Object[] a)
 * static Object[] copyOf(Object[] original, int newLength) 
 * static Object[] copyOfRange(Object[] original, int from, int to) 
 *
 * Unimplemented:
 * static int binarySearch(Object[] a, Object key, Comparator c)
 * static int hashCode(Object[] a) 
 * static int deepHashCode(Object[] a) 
 * static List	asList(Object[] a) 
 * 
 * 
 */
var Arrays = {
  sort: function() {
    var target = arguments[0];
    var sorter = null;
    
    if (arguments.length == 2) {
      sorter = arguments[1];
    } else if (arguments.length == 4) {
      sorter = arguments[3];
    } else {
      sorter = function(a, b) { if (a < b) return -1;  if (a > b) return 1; return 0 };
    }
    
    if (arguments.length >= 3) {
      // We have fromIndex and toIndex
      var subtarget = Arrays.copyOfRange(target, arguments[1], arguments[2]);
      subtarget.sort(sorter);
      
      for (var c=arguments[1];c<=arguments[2];c++) {
        target[c] = subtarget[c-arguments[1]];
      }
    } else {
      target.sort(sorter);
    }
  },
  
  create: function() {
    // Create a multidimensional array
    var total = arguments[0];
    var result = new Array(total);
    if (arguments.length > 1) {
      var newArgs = [];
      for (var c=1;c<arguments.length;c++) {
        newArgs[c-1] = arguments[c];
      }
      for (var c=0;c<total;c++) {
        result[c] = Arrays.create.apply(null, newArgs);
      }
    }
    return result;
  },
  
  fill: function(target, value) {
    // We fill the array with certain value
    // If it's a multidimensional array, we fill them too
    
    var fromIndex = 0,
        toIndex = target.length-1,
        valueIsFunction = (typeof value == "function"),
        valueIsArray = Arrays.isArray(value);
    
    // Support fromIndex/toIndex
    if (arguments.length > 2) {
      fromIndex = arguments[1];
      toIndex = arguments[2];
      value = arguments[3];
    }
    
    for (var c=fromIndex;c<=toIndex;c++) {
      if (Arrays.isArray(target[c])) {
        Arrays.fill(target[c], value);
      } else {
        if (valueIsFunction) {
          target[c] = value.call(target, c);
        } else if (valueIsArray) {
          // If value is an array, create a copy to avoid problems
          target[c] = Arrays.copyOf(value);
        } else {
          target[c] = value;
        }
      }
    }
  },
  
  toString: function(target) {
    return "[" + target.join(", ") + "]";
  },
  
  // TODO: handle arrays that contain themselves; when detected, use "[...]"
  deepToString: function(target) {
    var output = "[";
    for (var c=0;c<target.length;c++) {
      if (c > 0) {
        output += ", ";
      }
      if (Arrays.isArray(target[c])) {
        output += Arrays.deepToString(target[c]);
      } else {
        output += target[c];
      }
    }
    
    output += "]";
    
    return output;
  },

  isArray: Array.isArray || function(a) {
    // Use Array.isArray if present; if not, we need to check the string value
    return (Object.prototype.toString.call(a) === '[object Array]');
  },
  
  binarySearch: function(a, fromIndex, toIndex, key) {
    // Binary search can be called in two ways: with from/to indexes or without
    if (arguments.length < 4) {
      key = fromIndex;
      fromIndex = 0;
      toIndex = a.length-1;
    }
    if (toIndex < fromIndex) {
      // Not found
    }
    
    var pos = Math.floor((toIndex + fromIndex) / 2);
    if (a[pos] === key) {
      return pos;
    } else if (fromIndex >= toIndex) {
      // Failed to find it
      return -Math.abs(toIndex)-1;
    } else if (a[pos] > key) {
      return Arrays.binarySearch(a, fromIndex, pos-1, key);
    } else {
      return Arrays.binarySearch(a, pos+1, toIndex, key);
    }
  },
  
  copyOf: function(original, newLength) {
    var newArray;
    
    // copyOf can be called with newLength or without, so check for it
    if (typeof newLength == "undefined") {
      newLength = original.length;
    }
    
    if (newLength < original.length) {
      newArray = original.slice(0, newLength);
    } else {
      newArray = original.slice(0);
      newArray.length = newLength;
    }
    
    return newArray;
  },
  
  copyOfRange: function(original, from, to) {
    return original.slice(from, to+1);
  },
  
  equals: function(a1, a2) {
    if (a1.length != a2.length) return false;
    
    var isEquals = true;
    
    for (var c=0;(c<a2.length)&&isEquals;c++) {
      isEquals = (a1[c] === a2[c]);
    }
    
    return isEquals;
  },
  
  // TODO: make sure we don't enter an infinite array contains itself
  deepEquals: function(a1, a2) {
    if (a1.length != a2.length) return false;
    
    var isEquals = true;
    
    for (var c=0;(c<a1.length)&&isEquals;c++) {
      if (Arrays.isArray(a1[c]) && Arrays.isArray(a2[c])) {
        isEquals = Arrays.deepEquals(a1[c], a2[c]);
      } else {
        isEquals = (a1[c] === a2[c]);
      }
    }
    
    return isEquals;
  }
};