/**
 * Created by ed on 06.12.14.
 */
define('config.min', [], function () {
    return {
        
        "paths": {
            "jquery": "libs/jquery-1.11.1.min",
            "underscore": "libs/underscore.min",
            "backbone": "libs/backbone.min",
            "text": "libs/text.min",
            "appdir": "app",
            "collections": "app/collections",
            "models": "app/models",
            "views": "app/views",
            "plugins": "plugins",
            "functions": "functions",
            "templates": "../templates"
        },

        "shim": {
            "underscore": {
                "deps": ['jquery'],
                "exports": '_'
            },
            "backbone": {
                "deps": ["jquery", "underscore"],
                "exports": "Backbone"
            },
            "localstorage": {
                "deps": ["jquery", "underscore", "backbone"],
                "exports": "Backbone"
            },
            "plugins": {
                "deps": ["jquery"]
            },
            "functions": {
                "deps": ["jquery"]
            }
        },

        "waitSeconds": 200
    };
});