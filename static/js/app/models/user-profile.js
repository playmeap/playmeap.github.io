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

        initialize:function(){

        },

        loadUserData:function(user_id){

            var data;
            var self = this;
            var id = parseInt(user_id);

            var loadData = {
                user_ids:[id],
                fields:['nickname', 'sex', 'bdate', 'photo_50', 'online', 'status', 'can_see_audio', 'online']
            };

            if(!id){
                this.clear();
                return false;
            }

            var model = this.app.collections.users.findWhere({user_id:id});
            if(model){
                data = model.toJSON();
                this.set(data);
                return this;
            }

            VK.Api.call(this.urls['users.get'], loadData, function (r) {

                if (r && r.response) {

                    var user = _.first(r.response);
                    self.clear({silent:true});
                    self.set(user);

                } else {
                    self.clear();
                }
            });

        }

    });

    return UserProfileModel;
});