/**
 * Created by ed on 25.02.15.
 */
define([
    'jquery',
    'underscore',
    'backbone'
], function ($,
             _,
             Backbone) {

    var UserProfileModel = Backbone.Model.extend({

        urls:{
            'users.get':'users.get'
        },

        defaultAttributes:{
            'photo_50':'static/images/default_photo_50.png'
        },

        loadData:{
            user_ids:[],
            fields:['nickname', 'sex', 'bdate', 'photo_50', 'online', 'status', 'can_see_audio', 'online']
        },

        initialize:function(){

        },

        fetch:function(){

            var self = this;
            this.loadData.user_ids = [this.get('user_id')];

            VK.Api.call(this.urls['users.get'], self.loadData, function (r) {

                if (r && r.response) {
                    var user = _.first(r.response);
                    //self.clear({silent:true});
                    self.set(user);
                } else {
                    //context.clear();
                }
            });

        }

    });

    return UserProfileModel;
});