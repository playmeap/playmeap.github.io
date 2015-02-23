/**
 * Created by ed on 17.02.15.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'app/models/index',
    'text!templates/default.tpl'
], function ($,
             _,
             Backbone,
             IndexModelClass,
             indexTpl) {

    var AppIndexView = Backbone.View.extend({

        tagName: 'div',

        initialize: function () {

            this.body = $('body');
            this.nodes = {};

            this.model = new IndexModelClass();
            this.model.view = this;

            this.app.models.index = this.model;

            this.render();
        },

        renderView: function (data) {

            this.body.removeClass('preload');

            if (typeof data === 'object' && data.render) {
                this.nodes.$apppages.html(data.render().el);
                return this;
            }

            this.nodes.$apppages.html(data);

            return this;
        },

        render: function () {

            this.el.innerHTML = indexTpl;
            this.body.html(this.el);

            this.nodes.$app = this.$el.children('.app-wrap');
            this.nodes.app = this.nodes.$app[0];

            this.nodes.$cache = this.$el.children('#app-cache');
            this.nodes.cache = this.nodes.$cache[0];

            this.nodes.$apppages = this.$el.find('.app-pages-wrap');
            this.nodes.apppages = this.nodes.$apppages[0];


            return this;
        }
    });

    return AppIndexView;
});