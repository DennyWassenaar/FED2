//Local scope
(function () {
    var iterator = 1;
    var max = 10;
    var min = 0;
})();
//Global scope
var iterator = 1;
var max = 10;
var min = 0;
//Closure
var a = 10;
function closure() {
  console.log(a); // will output 10
  console.log(b); // will output 6
}
var b = 6;
closure();