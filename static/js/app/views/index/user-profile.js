/**
 * Created by ed on 25.02.15.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'app/models/user-profile',
    'text!templates/index/user-profile.tpl'
], function ($,
             _,
             Backbone,
             UserProfileModelClass,
            indexTpl) {

    var UserProfileView = Backbone.View.extend({

        tagName:'div',
        className:'userprofile-list-view',

        initialize:function(options){

            this.children = {};
            this.parent = options.parent;
            this.wrap = options.wrap;

            this.nodes = {};

            this.model = new UserProfileModelClass();
            this.model.bind('change', this.render, this);

            this.app.playercontroller.model.bind('change:owner_id', this.updateData, this);
        },

        updateData:function(){

            this.$el.addClass('preload');
            var user_id = this.app.playercontroller.model.get('owner_id');

            this.model.clear({silent:true});
            this.model.set({user_id:user_id}, {silent:true});
            this.model.fetch();

        },

        render:function(){

            var self = this;
            var data = this.model.toJSON();
            this.el.innerHTML = _.template(indexTpl)(data);

            this.nodes.$photo_50 = this.$el.find('.userprofile-list-view-head-image');

            var photo_50 = new Image();
            photo_50.onload = function () {
                this.setAttribute('class', 'userprofile-list-view-head-img');
                self.nodes.$photo_50.append(this);
                self.nodes.$photo_50.removeClass('preload');
            };

            photo_50.src = data.photo_50;

            this.$el.removeClass('preload');

            return this;
        }

    });

    return UserProfileView;
})