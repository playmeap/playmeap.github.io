/**
 * Created by ed on 19.02.15.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'app/views/index/friend-item'
], function ($,
             _,
             Backbone,
             FriendItemViewClass) {

    var FriendsView = Backbone.View.extend({

        tagName:'ul',
        className: 'preload friends-list-view',

        initialize: function (options) {

            this.children = {};
            this.parent = options.parent;
            this.wrap = options.wrap;
            this.collection = this.app.collections.users;
            this.collection.bind('reset', this.render, this);
            this.collection.collectionModel.bind('change', this.changeCollectionModel, this);
        },

        changeCollectionModel:function(){
            this.$el.addClass('preload');
        },

        render: function () {

            this.app.log('FriendsView.render');

            var self = this;
            this.el.innerHTML = '';
            this.$el.removeClass('preload');

            _.each(this.children, function(view, id){
                view.remove();
                delete this.children[id];
            }, this);

            _.each(this.collection.models, function(model){

                var view = new FriendItemViewClass({
                    parent:self,
                    model:model
                });

                this.children[model.cid] = view;
                this.$el.append(view.render().el);

            }, this);

        }

    });

    return FriendsView;
});