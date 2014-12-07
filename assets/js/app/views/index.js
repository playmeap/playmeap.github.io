/**
 * Created by ed on 05.12.14.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'views/player-controller/index.min',
    'text!templates/index.html'
], function ($,
             _,
             Backbone,
             PlayerControllerView,
             indexTpl) {

    var AppIndexView = Backbone.View.extend({

        tagName: 'div',
        className: 'appindexView preload',

        initialize: function () {
            this.$el.removeClass('preload');
            this.children = {};

            this.render();
        },

        renderNavigate: function (name) {
            var $node = $(name);
            $('.appNavigation a').not($node).removeClass('active');
            $node.addClass('active');
            //console.log('renderNavigate', name, $node);
            //console.log('n', name, $node);
        },

        render: function () {
            var data = {};
            data.mid = this.app.attributes.mid;
            this.el.innerHTML = _.template(indexTpl)(data);
            $('body').html(this.el).removeClass('preload');

            this.children.playerController = new PlayerControllerView({el:$('.playerController')});
            this.app.views.playerController = this.children.playerController;
        }
    });

    return AppIndexView;
});