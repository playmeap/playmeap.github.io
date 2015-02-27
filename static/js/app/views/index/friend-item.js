/**
 * Created by ed on 21.02.15.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/friends/friend-list-item.tpl'
], function ($,
             _,
             Backbone,
             indexTpl) {

    var FriendItemView = Backbone.View.extend({

        tagName: 'li',
        className: 'preload friends-list-item',

        initialize: function (options) {
            this.parent = options.parent;
            this.nodes = {};
        },

        render: function () {

            var self = this;
            var data = this.model.toJSON();
            var html = _.template(indexTpl)(data);
            this.el.innerHTML = html;

            this.el.id = 'friend-item_' + data.user_id;
            this.nodes.$link = this.$el.children('.friends-list-item-link');
            this.nodes.$photo = this.$el.find('.friends-list-item-photo');

            var photo_50 = new Image();
            photo_50.onload = function () {
                self.$el.removeClass('preload');
            };

            photo_50.onerror = function(){
                self.$el.removeClass('preload');
                self.nodes.$photo.attr('src', self.model.defaultAttributes.photo_50);
            };

            photo_50.src = data.photo_50;

            return this
        }
    });

    return FriendItemView;
});
