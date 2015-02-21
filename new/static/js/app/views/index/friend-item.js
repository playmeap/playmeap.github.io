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
        className: 'friends-list-item',

        initialize: function (options) {
            this.parent = options.parent;

        },

        render: function () {

            var data = this.model.toJSON();
            var html = _.template(indexTpl)(data);
            this.el.innerHTML = html;

            this.el.id = 'friend-item_' + data.user_id;


            return this
        }
    });

    return FriendItemView;
});
