/**
 * Created by ed on 06.12.14.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/audios/list-item.html'
], function ($,
             _,
             Backbone,
             indexTpl) {

    var AudioItemView = Backbone.View.extend({

        tagName: 'li',
        className: 'col-sm-12 audioListItem disable',

        events: {
            'click .favorite': 'addToFavorite',
            'click .play':'playItem',
            'click .pause':'pauseItem',
            'click .progress':'rewind'
        },

        initialize:function(){

            var play = function(){
                this.el.querySelector('.playcontrol').classList.add('glyphicon-pause', 'pause');
                this.el.querySelector('.playcontrol').classList.remove('glyphicon-play','play');
            }.bind(this);

            var stop = function(){
                this.el.querySelector('.playcontrol').classList.remove('glyphicon-pause', 'pause');
                this.el.querySelector('.playcontrol').classList.add('glyphicon-play','play');
            }.bind(this);

            var pause = function(){
                this.el.querySelector('.playcontrol').classList.remove('glyphicon-pause', 'pause');
                this.el.querySelector('.playcontrol').classList.add('glyphicon-play','play');
            }.bind(this);

            this.$el.on('play', play);
            this.$el.on('stop', stop);
            this.$el.on('pause', pause);
        },

        playItem:function(){
            this.app.views.playerController.play(this.model.get('aid'));
        },

        pauseItem:function(){
            this.app.views.playerController.pause(this.model.get('aid'));
        },

        rewind:function(e){
            var x = e.offsetX==undefined?e.layerX:e.offsetX;
            var width = this.$nodeProgress.width();
            var process = x / width * 100;
            this.app.views.playerController.rewind(process);
        },

        addToFavorite: function () {

            var self = this;
            var data = {};
            data.album_id = this.app.models.index.get('play_album');
            data.audio_ids = [this.model.get('aid')];

            var userData = {};
            userData.owner_id = this.app.attributes.mid;

            //BIG TODO
            if(this.model.get('owner_id') !== this.app.attributes.mid){

                VK.Api.call('audio.get', userData, function (r) {

                    if (r && r.response) {

                        var cloneItems = _.where(r.response, {
                            artist:self.model.get('artist'),
                            duration:self.model.get('duration'),
                            title:self.model.get('title')
                        });

                        if(cloneItems.length >= 1){

                            _.each(cloneItems, function(cloneObj){

                                VK.Api.call('audio.delete', {
                                    audio_id:cloneObj.aid,
                                    owner_id:self.app.attributes.mid
                                }, function(r){
                                    //TODO remove
                                });

                            });
                        }

                        var addData = {
                            owner_id:self.model.get('owner_id'),
                            audio_id:self.model.get('aid')
                        };

                        VK.Api.call('audio.add', addData, function (r) {
                            if(r && r.response){

                                data.audio_ids = [r.response];
                                VK.Api.call('audio.moveToAlbum', data, function (r) {
                                    if (r && r.response) {
                                        //TODO
                                        self.app.collections.audioFavorites.add(self.model);
                                    }
                                });

                            }
                        });

                    }

                });

            }else{

                VK.Api.call('audio.moveToAlbum', data, function (r) {
                    if (r && r.response) {
                        self.app.collections.audioFavorites.add(self.model);
                    }
                });

            }

        },

        render: function () {
            var data = this.model.toJSON();
            this.el.innerHTML = _.template(indexTpl)(data);
            this.$el.addClass('audio_item audio_' + data.aid);
            this.nodeProgress = this.el.querySelector('.progress');
            this.$nodeProgress = $(this.nodeProgress);
            return this;
        }
    });

    return AudioItemView;
});