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
            var scope = this.app.fn.getScope();

            VK.Auth.login(function (resp) {
                if (resp.session) {
                    self.app.attributes.login = true;
                    _.extend(self.app.attributes, resp.session);
                    self.app.router.navigate('/', {trigger: true});
                }
            }, scope);


        },

        render: function () {
            this.el.innerHTML = indexTpl;
            return this;
        }
    });

    return LoginView;
});