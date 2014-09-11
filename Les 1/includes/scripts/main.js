function Person(name) {
    //Property
     this.name = name;
    //Method
    this.speak = function () {
        console.log("Hallo, mijn naam is "+ this.name +"");
    }	
}
var User = new Person("Bob");
User.speak();