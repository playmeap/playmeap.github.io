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
            'click .favorite-add': 'addToFavorite',
            'click .favorite-remove': 'removeFromFavorite',
            'click .play': 'playItem',
            'click .pause': 'pauseItem',
            'click .progress': 'rewind',
            'click .download':'downloadItem'
        },

        initialize: function () {

            this.play = function () {

                var model = this.app.collections.audioFavorites.findWhere({aid:this.model.get('aid')});
                var item = this.el.querySelector('.favorite-add');

                if(model && item){
                    item.className = 'glyphicon glyphicon-remove-sign favorite-remove';
                    item.setAttribute('title', 'Удалить из избранного');
                }

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

        downloadItem:function(){

            var url;
            var serverUrl = this.app.attributes.proxySever;
            var itemUrl = this.model.get('url');
            itemUrl = itemUrl.split('?')[0];
            var name = this.model.get('title') + ' - ' + this.model.get('artist');
            name = name.split(' ').join('_');

            var exp = itemUrl.substr(itemUrl.lastIndexOf('.'), itemUrl.length);

            url = serverUrl;
            url += 'url=' + itemUrl;
            url += '&name=' + name + exp;
            url = url.replace('https', 'http');
            console.log(url);
            window.open(url, '_blank');
        },

        playItem: function () {
            this.app.views.playerController.play(this.model.get('aid'));
        },

        pauseItem: function () {
            this.app.views.playerController.pause(this.model.get('aid'));
        },

        rewind: function (e) {

            var x = e.offsetX == undefined ? e.layerX : e.offsetX;
            if(x == undefined){
                x = e.pageX || e.x;
                x = x -  e.target.getBoundingClientRect().left;
            }

            var width = this.$nodeProgress.width();
            var process = x / width * 100;
            this.app.views.playerController.rewind(process);
        },

        addToFavorite: function (e) {

            var self = this;
            var data = {};
            data.album_id = this.app.models.index.get('play_album');
            data.audio_ids = [this.model.get('aid')];

            var userData = {};
            userData.owner_id = this.app.attributes.mid;


            var item = self.el.querySelector('.favorite-add');
            var model = this.app.collections.audioFavorites.findWhere({aid:this.model.get('aid')});

            if(model){
                item.className = 'glyphicon glyphicon-remove-sign favorite-remove';
                item.setAttribute('title', 'Удалить из избранного');
                e.preventDefault();
                return false;
            }

            item.className = 'glyphicon glyphicon-remove-sign favorite-remove';
            item.setAttribute('title', 'Удалить из избранного');

            //BIG TODO
            if (this.model.get('owner_id') !== this.app.attributes.mid) {

                VK.Api.call('audio.get', userData, function (r) {

                    if (r && r.response) {

                        var cloneItems = _.where(r.response, {
                            artist: self.model.get('artist'),
                            duration: self.model.get('duration'),
                            title: self.model.get('title')
                        });

                        if (cloneItems.length >= 1) {

                            _.each(cloneItems, function (cloneObj) {

                                VK.Api.call('audio.delete', {
                                    audio_id: cloneObj.aid,
                                    owner_id: self.app.attributes.mid
                                }, function (r) {
                                    //TODO remove
                                });

                            });
                        }

                        var addData = {
                            owner_id: self.model.get('owner_id'),
                            audio_id: self.model.get('aid')
                        };

                        VK.Api.call('audio.add', addData, function (r) {
                            if (r && r.response) {

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

            } else {

                VK.Api.call('audio.moveToAlbum', data, function (r) {
                    if (r && r.response) {
                        self.app.collections.audioFavorites.add(self.model);
                    }
                });

            }

        },

        removeFromFavorite:function(){

            var self = this;
            var data = {};
            data.mid = this.app.attributes.mid;
            data.album_id = 0;
            data.audio_ids = [this.model.get('aid')];

            var model = self.app.collections.audioFavorites.findWhere({aid:this.model.get('aid')});
            if(model){

                VK.Api.call('audio.moveToAlbum', data, function (r) {
                    if (r && r.response){
                        model.collection.remove(model);
                        var item = self.el.querySelector('.favorite-remove');
                        if(item){
                            item.className = 'glyphicon glyphicon-ok-sign favorite-add';
                            item.setAttribute('title', 'Добавить в избранное');
                        }

                    }
                });
            }
        },

        render: function () {

            var data = this.model.toJSON();
            data.favorite = false;
            if(this.app.collections.audioFavorites.where({aid:data.aid}).length >= 1){
                data.favorite = true;
            }

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