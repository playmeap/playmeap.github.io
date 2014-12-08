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
            'click .favorite-remove': 'removeToFavorite',
            'click .play': 'playItem',
            'click .pause': 'pauseItem',
            'click .progress': 'rewind'
        },

        initialize: function () {


            this.model.collection.bind('remove', function (item) {
                if (item.cid == this.model.cid) {
                    this.remove();
                }
            }, this);

            this.play = function () {
                this.el.classList.add('active');
                this.el.querySelector('.playcontrol').classList.add('glyphicon-pause', 'pause');
                this.el.querySelector('.playcontrol').classList.remove('glyphicon-play', 'play');
            }.bind(this);

            this.stop = function () {
                this.el.classList.remove('active');
                this.el.querySelector('.playcontrol').classList.remove('glyphicon-pause', 'pause');
                this.el.querySelector('.playcontrol').classList.add('glyphicon-play', 'play');
            }.bind(this);

            this.pause = function () {
                this.el.querySelector('.playcontrol').classList.remove('glyphicon-pause', 'pause');
                this.el.querySelector('.playcontrol').classList.add('glyphicon-play', 'play');
            }.bind(this);

            this.$el.on('play', this.play);
            this.$el.on('stop', this.stop);
            this.$el.on('pause', this.pause);

        },

        playItem: function () {
            this.app.views.playerController.play(this.model.get('aid'));
        },

        pauseItem: function () {
            this.app.views.playerController.pause(this.model);
        },

        rewind: function (e) {
            var x = e.offsetX == undefined ? e.layerX : e.offsetX;
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
            data.favorite = (this.app.collections.audioFavorites.where({aid:data.aid}).length >= 1)? 1 : 0;
            this.el.innerHTML = _.template(indexTpl)(data);
            this.$el.addClass('audio_item audio_' + data.aid);
            this.nodeProgress = this.el.querySelector('.progress');
            this.$nodeProgress = $(this.nodeProgress);

            var active_composition = this.app.models.index.get('active_composition');
            if(active_composition && active_composition === data.aid){
                this.play();
            }

            return this;
        }

    });

    return AudioItemView;
});