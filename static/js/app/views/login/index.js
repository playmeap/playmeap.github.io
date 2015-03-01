define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/login/index.tpl'
], function ($,
             _,
             Backbone,
             indexTpl) {

    var LoginView = Backbone.View.extend({

        events: {
            'submit': 'eventLogin'
        },

        initialize: function () {

        },

        eventLogin: function (e) {
            e.preventDefault();

            var self = this;

            this.app.vk.Auth.login(function(resp){
                if (resp.session) {

                    self.app.fn.set('login', true);
                    self.app.fn.set(resp.session);
                    self.app.router.navigate('/', {trigger: true});
                }
            });
        },

        render: function () {
            this.el.innerHTML = indexTpl;
            return this;
        }
    });

    return LoginView;
});