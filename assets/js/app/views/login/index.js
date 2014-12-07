define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/login.html'
], function ($,
             _,
             Backbone,
             indexTpl) {

    var AppLoginView = Backbone.View.extend({

        tagName: 'div',
        className: 'appLoginView',

        events: {
            'click button': 'loginApp'
        },

        initialize: function () {

            VK.Auth.logout();
            this.$el.removeClass('preload');
            this.render();
        },

        loginApp: function () {

            var self = this;
            var scope = this.app.attributes.getScope();

            VK.Auth.login(function (resp) {
                if (resp.session) {
                    self.app.attributes.logined = true;
                    _.extend(self.app.attributes, resp.session);
                    self.app.router.navigate('/', {trigger: true});
                }
            }, scope);
        },

        render: function () {
            this.el.innerHTML = indexTpl;
            $('body').removeClass('preload').html(this.el);
            return this;
        }
    });

    return AppLoginView;
});