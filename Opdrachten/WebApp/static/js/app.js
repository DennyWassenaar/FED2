// Namespace om het object WebApp aan te maken en ervoor te zorgen dat meerdere objecten hierop in kunnen haken.
var WebApp = WebApp || {};
var content = {
    about: {
        title: "About",
        description: "Bij Denny's bioscoop worden uiteraard de laatste films vertoond. Maar om de filmbeleving nog groter te maken, organiseren we ook events (o.a. Ladies Night, PAC Festival, 50 Plus Bios en High Tea) en vertonen we live registraties (o.a. opera, theater of sportwedstrijden). Ook bieden we ‘on demand’ films aan via Pathé Thuis. Verder behoren pathe.nl en Pathé Facebook tot de meest bezochte online platforms in Nederland. Kortom, Pathé is méér dan film alleen!"
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
                    WebApp.sections.renderMovies(genre);
                },
                "movies/rating/?:order": function (order) {
                    console.log("gesorteerd op review (rating)")
                    WebApp.sections.renderMovies(order);
                },
                "movies/date/?:order": function (order) {
                    console.log("gesorteerd op datum")
                    WebApp.sections.renderMovies(order);
                },
                "movie/:movieTitle": function (movieTitle) {
                    console.log("gesorteerd op film titel")
                    WebApp.sections.toggle("movie-detail");
                    WebApp.sections.renderMovieDetail(movieTitle);
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
        // Movies render template
        renderMovies: function (filter) {
            var movies = JSON.parse(localStorage.getItem("movies"));
            _.map(movies, function (movie) {
                movie.reviews = _.reduce(movie.reviews, function (totalScore, review) {
                    return totalScore + review.score;
                }, 0) / _.size(movie.reviews);
            });
            switch (filter) {
                case "all":
                    WebApp.sections.toggle("movies");
                    break;
                case "horror":
                case "crime":
                case "drama":
                case "thriller":
                case "action":
                case "adventure":
                    movies = _.filter(movies, function (movie) {
                        filter = filter.charAt(0).toUpperCase() + filter.slice(1);
                        return (_.contains(movie.genres, filter) === true);
                    });
                    break;
                case "asc":
                    movies = _.sortBy(movies, function (movie) {
                        return movie.reviews;
                    });
                    break;
                case "desc":
                    movies = _.sortBy(movies, function (movie) {
                        return movie.reviews * -1;
                    });
                    break;
                case "date-asc":
                    movies = _.sortBy(movies, function (movie) {
                        return Date.parse(movie.release_date);
                    });
                    break;
                case "date-desc":
                    movies = _.sortBy(movies, function (movie) {
                        return Date.parse(movie.release_date) * -1;
                    });
                    break;
                default:
                    console.log("No filter!");
                    break;
            };
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
                reviews: {
                    text: function () {
                        if (isNaN(this.reviews)) {
                            return "No reviews available";
                        } else {
                            return this.reviews;
                        }
                    }
                },
                movie_link: {
                    href: function () {
                        var title = this.title.replace(/\s+/g, "-");
                        return "#movie/" + title;
                    }
                }
            };
            Transparency.render(document.querySelector("section[data-route='movies']"), movies, directives);
        },
        renderMovieDetail: function (movieTitle) {
            var movies = JSON.parse(localStorage.getItem("movies"));
            _.map(movies, function (movie) {
                movie.reviews = _.reduce(movie.reviews, function (totalScore, review) {
                    return totalScore + review.score;
                }, 0) / _.size(movie.reviews);
            });
            _.map(movies, function (movie) {
                movie.genres = movie.genres.toString();
            });
            var title = movieTitle;
            title = title.replace(/-/g, " ");
            title = title.replace(/\b./g, function (title) {
                return title.toUpperCase();
            });
            movies = _.filter(movies, function (movie) {
                return movie.title === title;
            });
            var directives = {
                bg: {
                    src: function () {
                        return this.cover;
                    },
                    alt: function () {
                        return this.title;
                    }
                }
            };
            Transparency.render(document.querySelector("section[data-route='movie-detail']"), movies, directives);
        },
        // Toggle functie om te schakelen tussen de content.
        toggle: function (section) {
            // Selecteer alle sections
            var activeSections = document.querySelectorAll("section");
            // Loop door de sections en verwijder de class active.
            for (var i = 0; i < activeSections.length; i++) {
                activeSections[i].classList.add("inactive");
                activeSections[i].classList.remove("active");
            }
            // Voeg de class active toe aan het element dat de gebruiker wil zien.
            var activeElement = document.querySelector("section[data-route='" + section + "']");
            activeElement.classList.remove("inactive");
            activeElement.classList.add("active");
        }

    };
    // Start de hele zooi
    WebApp.controller.init();
})();