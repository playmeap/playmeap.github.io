define([
    'jquery',
    'underscore',
    'backbone',
    'app/router',
    'config'
], function ($,
             _,
             Backbone,
             RouterClass,
             config) {

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

    var App = {
        views:{},
        models:{},
        collections:{}
    };

    App.config = _.extend(config, {});
    App.options = _.extend(App.config.defaultOptions, {});

    App.attributes = {};
    App._attributes = {};

    App.fn = {};
    App.fn.getScope = function(){
        return App.options.scope.intValues.reduce(function (prev, current) {
            return parseInt(prev) + parseInt(current);
        });
    };

    /**
    * App log functions
    * print to console errors or messages
    * @param data
    */
    App.log = function (data) {
        if (App.options.debug) {

            if(typeof data === 'string'){
                console.log('>> ' + data);
            }

            if (data.data) {
                console.log(data.data);
                console.log('');
            }
        }
    };

    App.fn.initialize = function(){

        App.log('[App.fn.initialize]');

    };


    App.fn.start = function () {
        App.log('App.fn.start');

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


    if(document.location.href.indexOf('local') >= 0){
        App.options.debug = true;
    }

    App.options.apiIds.active = (App.options.debug)? App.options.apiIds.test : App.options.apiIds.prod;

    VK.init({
        apiId: App.options.apiIds.active
    });


    VK.Auth.getLoginStatus(function (resp) {

        if (resp.session) {

            App.log('app.js VK.Auth.getLoginStatus : login = true');

            App.attributes.login = true;;
            _.extend(App.attributes, App.options.defaultOptions, resp.session);
            App.fn.start();

            // FIX TODO
            sessionStorage.setItem('respsession', JSON.stringify(resp.session));

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

        }else{
            App.log('app.js VK.Auth.getLoginStatus : login = false');
            _.extend(App.attributes, App.options.defaultOptions);
            App.fn.start();
            //App.start();
        }

    });



    return App;
});