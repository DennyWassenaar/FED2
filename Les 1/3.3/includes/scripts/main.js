var User = {
    name: ' Bob',
    speak: function () {
        console.log("Hallo, mijn naam is " + this.name + "");
    },
    walk: function () {
        console.log("Lopen");
    },
    eat: function () {
        console.log("Eten");
    }
}
User.speak();
User.walk();
User.eat();
