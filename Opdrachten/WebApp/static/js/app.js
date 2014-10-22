// Namespace om het object WebApp aan te maken en ervoor te zorgen dat meerdere objecten hierop in kunnen haken.
var WebApp = WebApp || {};
var content = {
    about: {
        titel: "About this app",
        description: "blabla bla"
    }
};
// Self invoking anonymous function, ervoor zorgen dat er geen conflicten ontstaan met andere scripts/libraries.
(function () {
    // Het XHR object
    WebApp.xhr = {
        trigger: function (type, url, success, data) {
            var req = new XMLHttpRequest;
            req.open(type, url, true);
            req.setRequestHeader("Content-type", "application/json");
            if (type === "POST") {
                req.send(data);
            } else {
                req.send(null);
            }
            req.onreadystatechange = function () {
                if (req.readyState === 4) {
                    if (req.status === 200 || req.status === 201) {
                        success(req.responseText);
                    }
                }
            }
        }
    };
    // Controller object
    WebApp.controller = {
        init: function () {
            //WebApp.contents.init();
            WebApp.router.init();
            WebApp.sections.init();
        }
    };
    // Router object
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
                },
                "*": function () {
                    console.log("je moeder");
                },
                "movies/:id": function (id) {
                    console.log("test");
                }
            });
        }
    };
    // Sections object
    WebApp.sections = {
        init: function () {
            this.about();
            this.getMovies();
            this.renderMovies();
        },
        // About render template
        about: function () {
            Transparency.render(document.querySelector("section[data-route='about']"), content.about);
        },
        // Movies object ophalen van externe locatie en dit doorpaasen aan de succes functie
        getMovies: function () {
            WebApp.xhr.trigger("GET", "http://dennistel.nl/movies", this.setMoviesLocal);
        },
        setMoviesLocal: function (movies) {
            if (localStorage.getItem("movies") === null) {
                localStorage.setItem("movies", movies);
            } else {
                localStorage.getItem("movies");
            }
        },
        // Movies render template
        renderMovies: function () {
            var moviesLocal = localStorage.getItem("movies");
            // De template engine aansturen met wat waar moet en andere eigenschappen.
            var directives = {
                bg: {
                    src: function () {
                        return this.cover;
                    },
                    alt: function () {
                        return this.title;
                    }
                },
                genres: {
                    text: function () {
                        return this.genres;
                    }
                },
                directors: {
                    text: function () {
                        // Hier loopen door de directors van de film
                        for (i = 0; i < this.directors.length; i++) {
                            return this.directors[i].name;
                        }
                    }
                },
                actors: {
                    text: function () {
                        for (i = 0; i < this.actors.length; i++) {
                            return this.actors[i].actor_name;
                        }
                    }
                }
            };
            Transparency.render(document.querySelector("section[data-route='movies']"), JSON.parse(moviesLocal), directives);
        },
        // Toggle functie tussen de content
        toggle: function (section) {
            //De toggle zoals in de opdracht, beetje vaag.
            document.querySelector("section[data-route='" + section + "']").classList.toggle("active");
        }

    };
    // Start de hele zooi
    WebApp.controller.init();
})();