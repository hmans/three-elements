/* Found on a random jsfiddle. Probably lots of room for optimization here :D */

export const camelize = (str: string) => {
  var arr = str.split(/[_-]/)
  var newStr = ""

  for (var i = 1; i < arr.length; i++) {
    newStr += arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
  }

  return arr[0] + newStr
}
