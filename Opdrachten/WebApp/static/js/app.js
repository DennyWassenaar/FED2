// Namespace om het object WebApp aan te maken en ervoor te zorgen dat meerdere objecten hierop in kunnen haken.
var WebApp = WebApp || {};

// Self invoking anonymous function, ervoor zorgen dat er geen conflicten ontstaan met andere scripts/libraries.
(function () {

    var content = {
        about: {
            title: "About this app",
            description: "Cities fall but they are rebuilt. heroes die but they are remembered. the man likes to play chess; let's get him some rocks. circumstances have taught me that a man's ethics are the only possessions he will take beyond the grave. multiply your anger by about a hundred, kate, that's how much he thinks he loves you. bruce... i'm god. multiply your anger by about a hundred, kate, that's how much he thinks he loves you. no, this is mount everest. you should flip on the discovery channel from time to time. but i guess you can't now, being dead and all. rehabilitated? well, now let me see. you know, i don't have any idea what that means. mister wayne, if you don't want to tell me exactly what you're doing, when i'm asked, i don't have to lie. but don't think of me as an idiot. rehabilitated? well, now let me see. you know, i don't have any idea what that means. cities fall but they are rebuilt. heroes die but they are remembered. no, this is mount everest. you should flip on the discovery channel from time to time. but i guess you can't now, being dead and all."
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

    WebApp.controller = {
        init: function () {
            WebApp.router.init();
            WebApp.sections.init();
            //console.log("controller aan het werk gezet");
        }
    };

    WebApp.router = {
        init: function () {
            routie({
                "about": function () {
                    console.log("about");
                    WebApp.sections.toggle("about");
                },
                "movies": function () {
                    console.log("movies");
                    WebApp.sections.toggle("movies");
                }
            });
        }
    }
    WebApp.sections = {
        init: function () {
            this.about();
            this.movies();
            //console.log("sections geinitieerd");
        },
        about: function () {
            Transparency.render(document.querySelector('section[data-route="about"]'), content.about);
        },
        movies: function () {
            Transparency.render(document.querySelector('section[data-route="movies"]'), content.movies);
        },
        toggle: function (section) {
            document.querySelector('section[data-route="'+section+'"]').classList.toggle("active");
        }

    }
    WebApp.controller.init();
})();