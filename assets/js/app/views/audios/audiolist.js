/**
 * Created by ed on 06.12.14.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'views/audios/list-item'
], function ($,
             _,
             Backbone,
             ListItemClass) {

    var AudioListView = Backbone.View.extend({

        tagName: 'ul',
        className: 'row audioListView itemsList',

        initialize: function (options) {

            if (options && options.parent) {
                this.parent = options.parent;
            }

            this.options = options;

            this.bind('node:ready', function () {
                this.collection = this.app.collections.audioList;
                this.collection.bind('reset', this.render, this);
                this.collection.bind('add', this.addOne, this);
                if (this.options.createCollections && this.options.createCollections.audio === false) {
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

    return AudioListView;
});