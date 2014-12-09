define([
    'jquery',
    'underscore',
    'backbone',
    'appdir/router.min',
    'models/index.min'
], function ($,
             _,
             Backbone,
             Router,
             IndexModelClass) {


    /**
     * Backbone.View extend
     * recursively remove child views (nodes and events) if parent view remove
     * @type {Function|Backbone.View.remove}
     */
    var DefaultRemove = Backbone.View.prototype.remove;
    Backbone.View.prototype.remove = function () {
        if (this.children) {
            for (var n in this.children) {
                if (this.children[n].remove) {
                    this.children[n].remove();
                }
            }
        }
        return DefaultRemove.call(this, arguments);
    };


    /**
     * Parent App Object
     *
     * @type {
    * {attributes: {debug: boolean},
    * defaultOptions: {},
    * router: boolean,
    * collections: {},
    * models: {},
    * views: {}
    * }}
     */
    var App = {

        attributes: {
            debug: false,
            logined:false
        },

        defaultOptions: {},
        router: false,
        collections: {},
        models: {},
        views: {}
    };

    /**
     * App log functions
     * print to console errors or messages
     * @param data
     */
    App.log = function (data) {
        if (App.attributes.debug) {
            console.info('[app log]', data.msg);
            if (data.data) {
                console.log(data.data);
                console.log('');
            }
        }
    };

    App.start = function () {

        Backbone.Router.prototype.app = App;
        Backbone.View.prototype.app = App;
        Backbone.Model.prototype.app = App;
        Backbone.Collection.prototype.app = App;

        if (document.readyState === "complete") {

            App.router = new Router();
            App.initialize();
            Backbone.history.start({pushState: false});

        } else {

            document.addEventListener("DOMContentLoaded", function () {

                window.removeEventListener('load', arguments.callee, false);
                document.removeEventListener('DOMContentLoaded', arguments.callee, false);

                App.router = new Router();
                App.initialize();
                Backbone.history.start({pushState: false});
            });

            window.addEventListener("load", function () {

                document.removeEventListener('DOMContentLoaded', arguments.callee, false);
                window.removeEventListener('load', arguments.callee, false);

                App.router = new Router();
                App.initialize();
                Backbone.history.start({pushState: false});

            }, false);
        }
    };

    App.initialize = function () {

        _.extend(App.attributes, App.defaultOptions);
        App.models.index = new IndexModelClass();
        App.log({msg: 'App init', data: App, level: 1});

    };

    return App;
});