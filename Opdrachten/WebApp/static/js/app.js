(function () {
    
    var content = {
        about : {
            titel: "",
            description: ""
        },
        movies : ["Shawshank Redemption","lol"]
    };
    
    var WebApp = WebApp || {};

    WebApp.controller = {
        //method
        init: function () {
            routie({
                'about': function () {
                    console.log("about pagina jongen");
                },
                'movies': function () {
                    console.log("movies pagina jongen");
                }
            });
            //console.log("draait");
        },
        test: function () {
            console.log("bier");
        }
    };
    //WebApp.controller.test();

WebApp.controller.init();
})();