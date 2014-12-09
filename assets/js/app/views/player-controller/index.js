define([
    'jquery',
    'underscore',
    'backbone'
], function ($,
             _,
             Backbone) {

    var PlayerController = Backbone.View.extend({

        optoions: {
            audio_restart: 0
        },
        timers: {},
        play_data: {},

        events:{
            'keyup .searchUser':'getSearchUser'
        },

        initialize: function () {
            var audioListNode = document.createElement('div');
            audioListNode.id = 'audioList';
            this.el.appendChild(audioListNode);
            this.audioListNode = audioListNode;
        },

        getSearchUser:function(e){

            var self = this;
            var target = e.target;

            if(this.timers.searchUserInput){
                clearTimeout(this.timers.searchUserInput);
            }

            if(this.timers.searchUserInputDone){
                clearTimeout(this.timers.searchUserInputDone);
            }

            this.timers.searchUserInput = setTimeout(function(){

                if(target != document.activeElement){
                    clearTimeout(self.timers.searchUserInput);
                    return false;
                }


                var link = target.value;

                if(link.indexOf('/') > 0){
                    link = link.substr(link.lastIndexOf('/') + 1, link.length);
                }

                if(link == ''){
                    return false;
                }

                var data = {};
                data.user_ids = [link];
                var node = self.el.querySelector('.error-block-user');

                VK.Api.call('users.get', data, function (r) {

                    if (r && r.response) {

                        var uid = r.response[0].uid;
                        self.app.router.navigate('#/id_' + uid + '/audios/list', {trigger:true});
                        node.classList.add('hidden');
                        target.value = '';
                        target.classList.add('done');
                        self.timers.searchUserInputDone = setTimeout(function(){
                            target.classList.remove('done');
                        }, 500);


                    } else {
                        node.classList.remove('hidden');
                        node.innerHTML = r.error.error_msg;
                    }
                });

            }, 500);
        },

        _playModel: function (model) {

            var self = this;
            var addItem = false;
            var data = model.toJSON();

            var length = this.audioListNode.childNodes.length;
            var item = this.audioListNode.querySelector('#audio_item_' + data.aid);

            _.each(this.audioListNode.childNodes, function (child, i) {

                if (length > self.app.attributes.cacheAudio) {
                    var deleteCount = length - self.app.attributes.cacheAudio;
                    if (i < deleteCount && child.id !== 'audio_item_' + data.aid) {
                        child.remove();
                    }

                }
            });

            if (!item) {
                addItem = true;
                var node = document.createElement('audio');
                var source = document.createElement('source');
                source.src = data.url.split('?')[0];
                node.appendChild(source);
                node.id = 'audio_item_' + data.aid;
                item = this.audioListNode.appendChild(node);
            }

            if (item) {

                if (!this.play_data.model && item.currentTime) {
                    //item.currentTime = 0;
                }

                //TODO
                if (item && !this.play_data.node || item && !this.play_data.node.currentTime) {
                    $('.audio_' + data.aid + ' .progress-position').css({
                        left: '0'
                    });
                }

                if (this.play_data && this.play_data.node) {
                    this.play_data.node.pause();
                    if (this.play_data.node.currentTime) {
                        //this.play_data.node.currentTime = 0;
                    }

                    this.play_data = {};
                }

                this.play_data.played = false;
                this.play_data.model = model;
                this.play_data.data = data;
                this.play_data.node = item;
                this.play_data.collection = model.collection;
                this._startPlay();
                this._makeEvents(addItem);
            }

        },

        _makeEvents: function (addItem) {

            var self = this;

            if (this.timers.process) {
                clearInterval(this.timers.process);
            }

            if (this.timers.loaded) {
                clearTimeout(this.timers.loaded);
            }

            this.timers.loaded = setTimeout(function () {
                if (self.play_data.node.buffered.length === 0) {
                    $('.audio_' + self.play_data.data.aid).addClass('error');
                    self.forward();
                }
            }, 3000);

            this.timers.process = setInterval(function () {

                var time = self.play_data.node.currentTime;
                var process = time / self.play_data.data.duration * 100;
                process = Math.ceil(process);
                if (process > 100) {
                    process = 100;
                }

                $('.audio_' + self.play_data.data.aid + ' .progress-position').css({
                    left: process + '%'
                });

            }, 1000);

            var progress = function () {

                var progress = 0;
                var ranges = [];

                for (var i = 0; i < self.play_data.node.buffered.length; i++) {
                    ranges.push([
                        self.play_data.node.buffered.start(i),
                        self.play_data.node.buffered.end(i)
                    ]);
                }

                if (ranges && ranges[0] && ranges[0][1]) {
                    progress = ranges[0][1] / self.play_data.data.duration * 100;
                }

                if (progress > 100) {
                    progress = 100;
                }

                $('.audio_' + self.play_data.data.aid + ' .progress-value').css({
                    width: progress + '%'
                });

            };

            var ended = function () {
                self.forward();
            };

            if (this.play_data && this.play_data.node && !addItem) {
                this.play_data.node.removeEventListener('progress', progress);
                this.play_data.node.removeEventListener('ended', ended);
            }

            if (addItem) {
                this.play_data.node.addEventListener('progress', progress);
                this.play_data.node.addEventListener('ended', ended);
            }

        },

        rewind: function (value) {
            if (this.play_data.data) {
                var time = this.play_data.data.duration;
                var newTime = Math.ceil(time / 100 * value);
                this.play_data.node.currentTime = newTime;

                $('.audio_' + this.play_data.data.aid + ' .progress-position').css({
                    left: value + '%'
                });

            }
        },

        _startPlay: function () {

            var data = this.play_data.model.toJSON();
            var $itemsOff = $('.audio_item').not('.audio_' + data.aid);
            var $items = $('.audio_' + data.aid);

            this.app.models.index.set({'active_composition': data.aid});
            this.play_data.model.collection.setElement(this.play_data.model);

            $itemsOff.removeClass('active');

            $items.addClass('active');
            $items.trigger('play');

            $itemsOff.trigger('stop');

            this.play_data.node.play();
        },

        play: function (id) {

            var model;

            if (parseInt(id)) {

                if (this.play_data.model && this.play_data.model.collection) {
                    model = this.play_data.model.collection.findWhere({aid: id});
                }

                if (!model) {
                    model = this.app.collections.audioList.findWhere({aid: id});
                    if (!model) {
                        model = this.app.collections.audioFavorites.findWhere({aid: id});
                    }
                }
            }

            if (id && id.attributes) {
                model = id;
            }

            if (model) {
                this._playModel(model);
            }
        },

        stop:function(){
            if (this.play_data && this.play_data.node) {
                this.play_data.node.pause();
                this.play_data.node.currentTime = 0;
                var $items = $('.audio_' + this.play_data.data.aid);
                $items.trigger('stop');
            }
        },

        pause: function () {
            if (this.play_data && this.play_data.node) {
                this.play_data.node.pause();
                var $items = $('.audio_' + this.play_data.data.aid);
                $items.trigger('pause');
            }
        },

        forward: function () {
            var model = this.play_data.model.collection.next().getElement();
            this.play(model);
        },

        backward: function () {
            var model = this.play_data.model.collection.prev().getElement();
            this.play(model);
        }

    });

    return PlayerController;
});