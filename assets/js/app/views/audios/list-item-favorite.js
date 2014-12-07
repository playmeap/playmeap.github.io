/**
 * Created by ed on 06.12.14.
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/audios/list-item-favorite.html'
], function ($,
             _,
             Backbone,
             indexTpl) {

    var AudioItemView = Backbone.View.extend({

        tagName: 'li',
        className: 'col-sm-12 audioListItem disable',

        events: {
            'click .favorite': 'removeToFavorite',
            'click .play':'playItem',
            'click .pause':'pauseItem',
            'click .progress':'rewind'
        },

        initialize:function(){


            this.model.collection.bind('remove', function(item){
                if(item.cid == this.model.cid){
                    this.remove();
                }
            }, this);

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
            this.app.views.playerController.pause(this.model);
        },

        rewind:function(e){
            var x = e.offsetX==undefined?e.layerX:e.offsetX;
            var width = this.$nodeProgress.width();
            var process = x / width * 100;
            this.app.views.playerController.rewind(process);
        },

        removeToFavorite: function () {

            var self = this;
            var data = {};
            data.mid = this.app.attributes.mid;
            data.album_id = 0;
            data.audio_ids = [this.model.get('aid')];

            VK.Api.call('audio.moveToAlbum', data, function (r) {
                if (r && r.response) {
                    self.app.collections.audioFavorites.add(self.model);
                    self.model.collection.remove(self.model);
                }
            });

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