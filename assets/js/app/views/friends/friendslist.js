/**
 * Created by ed on 06.12.14.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'views/friends/list-item'
], function ($,
             _,
             Backbone,
             ListItemClass) {

    var FriendsListView = Backbone.View.extend({

        tagName: 'ul',
        className: 'row friendListView itemsList',

        initialize: function (options) {

            if (options && options.parent) {
                this.parent = options.parent;
            }

            this.options = options;

            this.bind('node:ready', function () {
                this.collection = this.app.collections.friendsList;
                this.collection.bind('reset', this.render, this);
                if (this.options.createCollections && this.options.createCollections.friends === false) {
                    this.render();
                }
            }, this);
        },

        addOne: function (item) {
            this.children[item.cid] = new ListItemClass({parent: this, model: item});
            this.$el.append(this.children[item.cid].render().el);
        },

        render: function () {

            var node = this.parent.el.querySelector(this.options.nodeSelector);
            node.classList.remove('preload');

            if (this.children) {
                for (var n in this.children) {
                    this.children[n].remove();
                }
            }

            this.children = {};
            _.each(this.collection.models, this.addOne, this);

            return this;
        }
    });

    return FriendsListView;
});