/**
 * Created by ed on 19.02.15.
 */
define([
    'jquery',
    'underscore',
    'backbone'
], function ($,
             _,
             Backbone) {
    var AudioItemModel = Backbone.Model.extend({

        urls:{
            'audio.add':'audio.add'
        },

        defaults:{
            play:false,
            loadprogess:0,
            playprogess:0
        },

        audioAdd:function(){

            var self = this;
            var data = {};
            data.audio_id = this.get('aid');
            data.owner_id = this.get('owner_id');

            var url = this.urls['audio.add'];

            VK.Api.call(url, data, function (r) {

                if (r && r.response) {

                    self.set({aid: r.response});
                    self.trigger('audio.add');

                } else {
                    alert(r.error.error_msg);
                }
            });

        }
    });
    return AudioItemModel;
});