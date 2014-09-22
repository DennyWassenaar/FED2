(function () {

    var content = {
        about: {
            titel: "About this app",
            description: "blabla bla"
        },
        movies: [{
            "title": "Shawshank Redemption",
            "releaseDate": "14 October 1994",
            "description": "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
            "cover": "shawshank-redemption.jpg"
        }, {
            "title": "The Godfather",
            "releaseDate": "24 March 1972",
            "description": "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
            "cover": "the-godfather.jpg"
        }, {
            "title": "Pulp Fiction",
            "releaseDate": "14 October 1994",
            "description": "The lives of two mob hit men, a boxer, a gangster's wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
            "cover": "pulp-fiction.jpg"
        }, {
            "title": "The Dark Knight",
            "releaseDate": "18 July 2008",
            "description": "When Batman, Gordon and Harvey Dent launch an assault on the mob, they let the clown out of the box, the Joker, bent on turning Gotham on itself and bringing any heroes down to his level.",
            "cover": "the-dark-knight.jpg"
        }]
    };
    var WebApp = WebApp || {};

    WebApp.sections = {
        init: function () {
            console.log("geinitieerd");
            this.about();
            this.movies();
        },
        about: function () {
            
            console.log("about");
        },
        movies: function () {
            console.log("movies");
        }

    }

    WebApp.controller = {
        //method Roep in de 'init'-methode van het 'controller'-object, de 'init'-methode van het 'sections'-object aan
        init: function () {
            WebApp.sections.init();
            routie({
                "about": function () {
                    WebApp.sections.about();
                },
                "movies": function () {
                    WebApp.sections.movies();
                }
            });
            console.log("draait");
        }
    };
    WebApp.controller.init();
})();