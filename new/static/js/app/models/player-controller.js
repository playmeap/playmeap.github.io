/**
 * Created by ed on 20.02.15.
 */
define([
    'jquery',
    'underscore',
    'backbone'
], function ($,
             _,
             Backbone) {

    var PlayerControllerModel = Backbone.Model.extend({
        defaults:{
            repeat:false,
            setBroadcast:false
        },

        initialize:function(){

            this.bind('change:acid', this.changeAcid, this);
            this.bind('change:setBroadcast', this.setBroadcast, this);
        },

        getAudioModel:function(cid){
            if(!cid){
                cid = this.get('acid');
            }

            var model = this.app.collections.audios.get(cid);
            if(!model){
                model = _.first(this.app.collections.audios.models);

            }
            return model;
        },

        setBroadcast:function(){

            var data = {};
            var setBroadcast = this.get('setBroadcast');

            if(setBroadcast){
                data.audio = this.app.attributes.mid + '_' + this.getAudioModel().get('aid');
            }

            VK.Api.call('audio.setBroadcast', data, function (r) {
                if (r && r.response) {
                    /**
                     * true
                     */

                } else {
                    alert(r.error.error_msg);
                }
            });

            this.app.log('PlayerControllerModel.setBroadcast: ' + setBroadcast);
        },

        changeAcid:function(){

            this.setBroadcast();

        }
    });
    return PlayerControllerModel;
});