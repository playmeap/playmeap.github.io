/**
 * Created by ed on 06.12.14.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/friends/list-item.html'
], function ($,
             _,
             Backbone,
             indexTpl) {

    var FriendItemListView = Backbone.View.extend({

        tagName: 'li',
        className: 'col-xs-2 col-md-1 col-lg-1 friendListItem',

        events: {
            'click .userListItemLink': 'getUserAudios'
        },

        initialize: function () {

            var self = this;
            var Img = new Image();
            Img.src = this.model.get('photo_50');
            Img.onload = function () {
                var img = self.el.querySelector('.user-img-src');
                img.setAttribute('src', this.src);
                img.parentNode.classList.remove('preload');
            };

        },

        getUserAudios: function (e) {

            if (!this.model.get('can_see_audio')) {
                e.preventDefault();
                alert('this user blocked audios');
                return false;
            }
            $('.friendListItem').not(this.el).removeClass('active');
            this.$el.addClass('active');
        },

        render: function () {
            var data = this.model.toJSON();
            this.el.innerHTML = _.template(indexTpl)(data);
            return this;
        }
    });

    return FriendItemListView;
});