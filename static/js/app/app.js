define([
    'jquery',
    'underscore',
    'backbone',
    'app/router',
    'config',
    'app/helpers/index'
], function ($,
             _,
             Backbone,
             RouterClass,
             config,
             ProtoObj) {

    var App = {
        views: {},
        models: {},
        collections: {}
    };

    App.config = _.extend(config, {});

    App.attributes = {};
    App._attributes = {};

    _.extend(App.attributes, App.config.defaultOptions);

    _.each(ProtoObj, function(Pclass, name){

        Pclass.prototype.app = this;
        this[name] = new Pclass();

    }, App);


    /**
     * App log functions
     * print to console errors or messages
     * @param data
     */
    App.log = function (data) {

        if (App.attributes.debug) {

            console.log(data);
        }
    };

    App.fn.initialize = function () {

        App.log('[App.fn.initialize]');

    };


    App.fn.start = function () {

        App.log('App.fn.start');
        App.log({data:App});

        Backbone.Router.prototype.app = App;
        Backbone.View.prototype.app = App;
        Backbone.Model.prototype.app = App;
        Backbone.Collection.prototype.app = App;

        if (document.readyState === "complete") {

            App.router = new RouterClass();
            App.fn.initialize();
            Backbone.history.start({pushState: false});

        } else {

            document.addEventListener("DOMContentLoaded", function () {

                window.removeEventListener('load', arguments.callee, false);
                document.removeEventListener('DOMContentLoaded', arguments.callee, false);

                App.router = new RouterClass();
                App.fn.initialize();
                Backbone.history.start({pushState: false});
            });

            window.addEventListener("load", function () {

                document.removeEventListener('DOMContentLoaded', arguments.callee, false);
                window.removeEventListener('load', arguments.callee, false);

                App.router = new RouterClass();
                App.fn.initialize();
                Backbone.history.start({pushState: false});

            }, false);
        }
    };

    App.vk.init({
        apiId: App.attributes.apiIds.active
    });

    App.vk.Auth.getLoginStatus(function (resp) {

        if (resp.session) {

            App.log('app.js VK.Auth.getLoginStatus : login = true');

            App.fn.set('login', true);
            App.fn.set(resp.session);

            App.fn.start();

            //VK.Api.call('status.get', {owner_id: App.defaultOptions.mid}, function (r) {
            //
            //    if (r.response && r.response.audio) {
            //        App.defaultOptions.active_audio = r.response.audio;
            //        App.start();
            //    } else {
            //        App.start();
            //    }
            //
            //});

        } else {

            App.log('app.js VK.Auth.getLoginStatus : login = false');
            App.fn.start();
            App.log({data: {msg: 'app js init', app: App}});
        }

    });


    return App;
});