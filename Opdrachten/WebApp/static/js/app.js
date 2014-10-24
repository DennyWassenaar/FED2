// Namespace om het object WebApp aan te maken en ervoor te zorgen dat meerdere objecten hierop in kunnen haken.
var WebApp = WebApp || {};
var content = {
    about: {
        titel: "About this app",
        description: "blabla bla"
    }
};
var movieAPI = "http://dennistel.nl/movies";
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
                "movies/genre/?:genre": function (genre) {
                    console.log("gesorteerd op genre")
                    WebApp.sections.toggle(localStorage.getItem("movies"), genre);
                },
                "movies/rating/?:order": function (order) {
                    console.log("gesorteerd op review (rating)")
                    app.sections.movies(localStorage.getItem("movies"), order);
                },
                "movies/date/?:order": function (order) {
                    console.log("gesorteerd op datum")
                    app.sections.movies(localStorage.getItem("movies"), order);
                },
                "movie/:movieTitle": function (movieTitle) {
                    console.log("gesorteerd op film titel")
                    app.sections.toggle("movie-detail");
                    app.sections.detail(localStorage.getItem("movies"), movieTitle);
                },
                "*": function () {
                    console.log("in case everything fails :)");
                    WebApp.sections.toggle("movies");
                }
            });
        }
    };
    // Sections object
    WebApp.sections = {
        init: function () {
            this.renderAbout();
            this.getMovies();
            this.renderMovies();
            this.filterMovies();
        },
        // About render template
        renderAbout: function () {
            Transparency.render(document.querySelector("section[data-route='about']"), content.about);
        },
        // Movies object ophalen van externe locatie en dit doorpaasen aan de succes functie
        getMovies: function () {
            WebApp.xhr.trigger("GET", movieAPI, this.setMoviesLocal);
        },
        setMoviesLocal: function (movies) {
            //if (localStorage.getItem("movies") === null) {
            localStorage.setItem("movies", movies);
            //}
        },
        filterMovies: function () {
            var movies = JSON.parse(localStorage.getItem("movies"));
            /* _.map(movies, function (movie, i) {
                movie.reviews = _.reduce(movie.reviews, function (memo, review) {
                    return memo + review.score;
                }, 0) / movie.reviews.length;
            });
            _.filter(movies, function(movie, i){
                console.log(movie.genres);
            });*/
            _.filter(
                _.map(movies, function (movie, i) {
                    movie.reviews = _.reduce(movie.reviews, function (memo, review) {
                        return memo + review.score;
                    }, 0) / movie.reviews.length;
                    movie.directors = _.reduce(movie.directors, function (memo, director) {
                        return memo + director.name + ' ';
                    }, '');
                    movie.actors = _.reduce(movie.actors, function (memo, actor) {
                        return memo + actor.actor_name + ', ';
                    }, '');
                    return movies;
                }),
                function (movie) {
                    return _.contains(movie.genres, 'Drama');
                });
            localStorage.setItem("movies", JSON.stringify(movies));
        },
        // Movies render template
        renderMovies: function () {
            var movies = JSON.parse(localStorage.getItem("movies"));
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
                }
            };
            Transparency.render(document.querySelector("section[data-route='movies']"), movies, directives);
        },
        detail: function (obj, movieTitle) { // Detail page section
            var obj = JSON.parse(obj);
            _.map(obj, function (movie) { // Use underscore.js to map each value in a list..
                movie.reviews = _.reduce(movie.reviews, function (totalScore, review) { // .. then combine those values..
                    return totalScore + review.score;
                }, 0) / _.size(movie.reviews); // .. and divide by total reviews to get the average review score.
            });
            _.map(obj, function (movie) {
                movie.genres = movie.genres.toString(); // Transforms the genre array to a string
            });
            var title = movieTitle;
            title = title.replace(/-/g, ' '); // Replaces the dashes with spaces
            title = title.replace(/\b./g, function (m) { // Capitalize each word
                return m.toUpperCase();
            });
            obj = _.filter(obj, function (movie) { // Filters the obj..
                return movie.title === title; // .. and shows only movies with matching title.
            });
            Transparency.render(document.getElementById('detail'), obj, app.content.directives); // Displays the element with ID 'detail' with the content from 'obj'.
        },
        // Toggle functie om te schakelen tussen de content.
        toggle: function (section) {
            // Selecteer alle sections
            var activeSections = document.querySelectorAll("section");
            // Loop door de sections en verwijder de class active.
            for (var i = 0; i < activeSections.length; i++) {
                activeSections[i].classList.remove("active");
            }
            // Voeg de class active toe aan het element dat de gebruiker wil zien.
            document.querySelector("section[data-route='" + section + "']").classList.add("active");
        }

    };
    // Start de hele zooi
    WebApp.controller.init();
})();