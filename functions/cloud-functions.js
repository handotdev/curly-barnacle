function findNextPossibleClassTime() {
  var coeff = 1000 * 60 * 5;
  var date = new Date(Date.now());
  var rounded = new Date(Math.round(date.getTime() / coeff) * coeff)
  return rounded.toString()
}

