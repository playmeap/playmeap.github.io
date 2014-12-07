define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/three-cols.html'
], function ($,
             _,
             Backbone,
             indexTpl) {

    var FriendsIndexView = Backbone.View.extend({

        name: 'FriendsIndexView',
        tagName: 'div',
        className: 'row friendsView',
        navSelector: '#geFriendsPage',

        initialize: function (options) {

            this.options = options;
            this.$elWrap = $('.appContentNode');
            this.render();
        },

        render: function () {
            this.el.innerHTML = indexTpl;
            this.$elWrap.html(this.el);
            this.app.views.index.renderNavigate(this.navSelector);
        }

    });

    return FriendsIndexView;
});