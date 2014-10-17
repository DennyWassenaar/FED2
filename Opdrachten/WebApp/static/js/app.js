// Namespace om het object WebApp aan te maken en ervoor te zorgen dat meerdere objecten hierop in kunnen haken.
var WebApp = WebApp || {};


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
                }
            });
        }
    };
    // Sections object
    WebApp.sections = {
        init: function () {
            this.about();
            this.getMovies();
        },
        // About render template
        about: function () {
            Transparency.render(document.querySelector("section[data-route='about']"), content.about);
        },
        // Movies object ophalen van externe locatie en dit doorpaasen aan de succes functie
        getMovies: function () {
            WebApp.xhr.trigger("GET", "http://dennistel.nl/movies", this.renderMovies);
        },
        // Movies render template
        renderMovies: function (response) {
            var movies = JSON.parse(response);
            //console.log(movies);
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
                plot: {
                    text: function () {
                        if (this.plot > 25) {
                            var smallText = this.plot.substr(0, 50 - 3) + "...";
                            return smallText;
                        }
                        //var smallText = this.
                        //return this.plot;
                    }
                }
            };
            Transparency.render(document.querySelector("section[data-route='movies']"), movies, directives);
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