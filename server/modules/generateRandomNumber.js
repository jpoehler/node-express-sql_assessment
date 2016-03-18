
var randomNumber = function(min, max){
  return Math.floor(Math.random() * (1 + max - min) + min);
};

module.exports = randomNumber(1, 100);
