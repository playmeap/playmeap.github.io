/**
 * Created by ed on 06.12.14.
 */
define('config', [], function () {
    return {

        defaultOptions:{
            version: "0.0.3",
            debug: false,
            apiIds:{
                active:0,
                prod:4664170,
                test:4664902
            },
            scope: {
                textValues: ['friends', 'audio', 'status', 'groups', 'offline'],
                intValues: [2, 8, 1024, 262144, 65536]
            }
        },

        urlArgs: "v=0.0.3",
        
        "paths": {
            "jquery": "libs/jquery-1.11.2.min",
            "underscore": "libs/underscore.min",
            "backbone": "libs/backbone.min",
            "text": "libs/text.min",
            "app": "app/",
            "libsdir":"libs/",
            "modules": "app/modules",
            "pages": "app/pages",
            "plugins": "plugins",
            "functions": "functions",
            "templates":"../templates"
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