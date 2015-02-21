define([
    'jquery',
    'underscore',
    'backbone'
], function ($,
             _,
             Backbone) {
    var LoginView = Backbone.View.extend({

        events: {
            'click #login_button': 'eventLogin'
        },

        initialize: function () {

        },
        eventLogin: function () {

        },
        render: function () {
            return this;
        }
    });

    return LoginView;
});