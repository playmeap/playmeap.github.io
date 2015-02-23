/**
 * Created by ed on 19.02.15.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'app/models/play-controller',
    'app/views/index/play-controller-player',
    'text!templates/play-controller.tpl'
], function ($,
             _,
             Backbone,
             PlayControllerModelClass,
             PlayControllerPlayer,
             indexTpl) {


    var PlayerController = Backbone.View.extend({

        timers:{},

        events: {
            'keyup .player-controller-search__input': 'eventKeyupSearch',
            'click .player-controller-control__bullhorn': 'eventClickHorn',
            'click .player-controller-control__repeat': 'eventClickRepeat',
            'click .player-controller-control__play': 'play',
            'click .player-controller-control__pause': 'eventClickPause',
            'click .player-controller-control__stop': 'stop',
            'click .player-controller-control__backward': 'prev',
            'click .player-controller-control__forward': 'next'
        },

        initialize: function () {
            this.children = {};
            this.nodes = {};
            this.nodes.controls = {};
            this.model = new PlayControllerModelClass();
            this.model.view = this;
            this.app.models.playercontroller = this.model;
            //this.model.bind('change:searchName', this.changeSearchName, this);

            this.model.bind('change:repeat', this.changeRepeat, this);
        },

        eventKeyupSearch: function (e) {
            var value = e.target.value;
            this.model.set({searchName: value});
        },

        eventClickHorn: function (e) {
            $(e.target).toggleClass('active');
            if (e.target.className.indexOf('active') >= 0) {
                this.model.set({setBroadcast: true});
            } else {
                this.model.set({setBroadcast: false});
            }
        },

        eventClickRepeat: function (e) {
            var repeat = this.model.get('repeat');
            this.repeat(!repeat);
            return this;
        },

        eventClickPause: function () {
            this.pause();
        },

        /**
         * change events
         * @returns {PlayerController}
         */
        changeRepeat: function () {
            /**
             * TODO fix it
             */

            var $node = this.nodes.controls.$repeat;

            if (this.model.get('repeat')) {
                $node.addClass('active');
                return this;
            }

            $node.removeClass('active');
            return this;
        },

        /**
         * controls
         * @param time
         */

        rewind: function (time) {
            var model = this.model.getAudioModel();
            var duration = model.get('duration');
            this.nodes.item.currentTime = time;
            this.app.log('PlayerController rewind:' + time);
        },

        next: function () {
            this.app.log('PlayerController next repeat:' + this.model.get('repeat'));

            var model = this.model.getAudioModel();
            this.app.collections.audios.setElement(model);

            //if (this.model.get('repeat')) {
            //    this.nodes.item.currentTime = 0;
            //    this.nodes.item.play();
            //    return this;
            //}

            if(this.nodes.item &&  this.nodes.item.currentTime){
                this.nodes.item.currentTime = 0;
            }

            var next = this.app.collections.audios.next().getElement();
            if (next) {
                this.play(next.cid);
            }
        },

        prev: function () {
            var model = this.model.getAudioModel();
            this.app.collections.audios.setElement(model);
            var prev = this.app.collections.audios.prev().getElement();
            if (prev) {
                this.play(prev.cid);
            }
        },

        repeat: function (state) {
            if (state) {
                this.model.set({repeat: true});
                return this;
            }

            this.model.set({repeat: false});
        },

        stop: function () {

            if (!this.nodes.item) {
                return false;
            }

            var model = this.model.getAudioModel();
            model.set({play:false});

            if (this.nodes.item.currentTime) {
                this.nodes.item.currentTime = 0;
            }

            this.nodes.item.pause();

            /**
             * view changes
             */
            this.nodes.controls.$play.removeClass('display-none');
            this.nodes.controls.$pause.addClass('display-none');
            /**
             * #
             */
        },

        pause: function () {

            if (!this.nodes.item) {
                return false;
            }

            /**
             * view changes
             */
            this.nodes.item.pause();
            this.nodes.controls.$play.removeClass('display-none');
            this.nodes.controls.$pause.addClass('display-none');
            /**
             * #
             */

            //var previousCid = this.model.previous('acid');
            //var cid = this.model.get('cid');
            var model = this.model.getAudioModel();

            /**
             * set play false model
             */

                //if(previousCid && previousCid !== cid){
                //var previousModel = this.model.getAudioModel(previousCid);
                //previousModel.set({play:false});
                //}

            model.set({play: false});

        },

        /**
         * need fix it's method
         * @private
         */
        _makeItemEvents:function(){
            this.app.log('PlayerController._makeItemEvents');

            var self = this;
            var item = this.nodes.item;
            var model = this.model.getAudioModel();
            var modelData = model.toJSON();

            /**
             * remove and next error item
             */
            (function(n, m){

                setTimeout(function(){
                    if(n.buffered.length === 0){

                        n.remove();
                        if(n.getAttribute('data-cid') == self.model.getAudioModel().cid){
                            self.next();
                        }

                    }
                }, 3000);

            })(item, model);


            if (this.timers.process) {
                clearInterval(this.timers.process);
            }


            this.timers.process = setInterval(function () {

                var time = self.nodes.item.currentTime;
                var model = self.model.getAudioModel();

                var playprogess = time / parseInt(model.get('duration')) * 100;
                playprogess = Math.ceil(playprogess);

                if (playprogess > 100) {
                    playprogess = 100;
                }

                model.set({playprogess:playprogess});

            }, 1000);

            var progress = function(){

                var loadprogess = 0;
                var ranges = [];

                for (var i = 0; i < item.buffered.length; i++) {
                    ranges.push([
                        item.buffered.start(i),
                        item.buffered.end(i)
                    ]);
                }

                if (ranges && ranges[0] && ranges[0][1]) {
                    loadprogess = ranges[0][1] / modelData.duration * 100;
                }

                /**
                * BUG
                */

                loadprogess = Math.ceil(loadprogess);

                if (loadprogess > 100) {
                    loadprogess = 100;
                }

                var cid = this.getAttribute('data-cid');
                var model = self.model.getAudioModel(cid);
                model.set({loadprogess:loadprogess});

            };

            var ended = function(){
                self.next();
            };

            item.addEventListener('ended', ended);
            item.addEventListener('progress', progress);


        },

        play: function (cid) {


            if (cid && cid.target) {
                cid = false;
            }
            var self = this;

            var model;

            if (cid) {
                model = this.model.getAudioModel(cid);
            } else {
                model = this.model.getAudioModel();
                cid = model.cid;
            }


            this.app.log('PlayerController play:' + cid);
            model.set({play: true});


            this.app.collections.audios.setElement(model);

            var item = document.getElementById('audio-preload-' + cid);

            if (!this.nodes.cache) {
                this.nodes.cache = this.app.views.index.nodes.cache;
            }

            /**
             * if this.nodes.item isset and item not found
             * or this.nodes.item isset and item isset and this.nodes.item !== item
             * need set this.nodes.item time = 0, stop element
             */
            if ((this.nodes.item && !item) || (this.nodes.item && item && item !== this.nodes.item)) {

                this.app.log('PlayerController play:' + cid + ', previous item.currentTime = 0');

                this.nodes.item.pause();
                if (this.nodes.item.currentTime) {
                    this.nodes.item.currentTime = 0;
                }
            }

            /**
             * view changes
             */
            this.nodes.controls.$play.addClass('display-none');
            this.nodes.controls.$pause.removeClass('display-none');
            /**
             * #
             */

            if (item) {

                this.nodes.item = item;
                this.model.set({acid: cid});
                this.nodes.item.play();

                item.addEventListener('ended', function () {
                    self.next();
                });

            }

            if (!item) {

                item = document.createElement('audio');
                item.id = 'audio-preload-' + cid;
                item.setAttribute('src', model.get('url').split('?')[0]);
                item.setAttribute('data-cid', cid);

                this.nodes.cache.appendChild(item);
                this.nodes.item = item;
                model.views.item = item;
                this.model.set({acid: cid});

                item.play();


                /**
                 * todo
                 */
                this._makeItemEvents();
            }

            var previousCid = this.model.previous('acid');

            /**
             * set play false model
             */
            if (previousCid && previousCid !== cid) {
                var previousModel = this.model.getAudioModel(previousCid);
                previousModel.set({play: false});
            }

        },

        /**
         * render
         * @returns {PlayerController}
         */

        render: function () {

            this.el.innerHTML = indexTpl;

            this.nodes.controls.$play = this.$el.find('.player-controller-control__play');
            this.nodes.controls.$pause = this.$el.find('.player-controller-control__pause');
            this.nodes.controls.$backward = this.$el.find('.player-controller-control__backward');
            this.nodes.controls.$forward = this.$el.find('.player-controller-control__forward');
            this.nodes.controls.$stop = this.$el.find('.player-controller-control__stop');
            this.nodes.controls.$repeat = this.$el.find('.player-controller-control__repeat');
            this.nodes.controls.$broadcast = this.$el.find('.player-controller-control__bullhorn');

            this.children.player = new PlayControllerPlayer({
                parent: this,
                el: this.$el.find('.player-controller-player')
            });

            return this;
        }

    });

    return PlayerController;
});