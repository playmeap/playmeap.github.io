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

    var PlayControllerModel = Backbone.Model.extend({
        defaults: {
            repeat: false,
            setBroadcast: false
        },

        initialize: function () {

            this.bind('change:aid', this.changeAcid, this);
            this.bind('change:setBroadcast', this.setBroadcast, this);
        },

        getAudioModel: function (aid, owner_id) {

            if (!aid) {
                aid = this.get('aid');
            }

            if(!owner_id){
                aid = this.get('owner_id');
            }

            /**
             * bad conde
             */
            if(!owner_id){
                owner_id = this.app.attributes.mid;
            }

            aid = parseInt(aid);
            owner_id = parseInt(owner_id);

            var model = this.app.collections.audios.findWhere({aid:aid, owner_id:owner_id});

            console.log('a', model);
            if (!model) {
                model = _.first(this.app.collections.audios.models);
            }

            return model;
        },

        setBroadcast: function () {

            var data = {};
            var setBroadcast = this.get('setBroadcast');

            if (setBroadcast) {
                var model = this.getAudioModel();
                data.audio = model.get('owner_id') + '_' + model.get('aid');
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

        changeAcid: function () {

            this.setBroadcast();

        }
    });
    
    return PlayControllerModel;
});