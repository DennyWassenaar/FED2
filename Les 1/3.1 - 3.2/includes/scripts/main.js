function Person(name) {
    //Property
    this.name = name;
    //Method
    this.speak = function () {
        console.log("Hallo, mijn naam is " + this.name + "");
    }
}
// Prototype
Person.prototype.walk = function () {
    console.log("Lopen");
}
Person.prototype.eat = function () {
    console.log("Eten");
}
var User = new Person("Bob");
User.speak();
User.walk();
User.eat();