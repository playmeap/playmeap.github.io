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

        timers: {},

        events: {
            'keyup .player-controller-search__input': 'eventKeyupSearch',
            'click .player-controller-control__bullhorn': 'eventClickHorn',
            'click .player-controller-control__repeat': 'eventClickRepeat',
            'click .player-controller-control__play': 'play',
            'click .player-controller-control__pause': 'eventClickPause',
            'change .player-controller-search__search-type': 'eventChangeSearchGlobal',
            'click .player-controller-control__stop': 'stop',
            'click .player-controller-control__backward': 'prev',
            'click .player-controller-control__forward': 'next',
            'click .player-controller-controls-volume-wrap':'eventClickVolume'
        },

        initialize: function () {
            this.children = {};
            this.nodes = {};
            this.nodes.controls = {};
            this.model = new PlayControllerModelClass();
            this.model.view = this;
            this.app.models.playercontroller = this.model;

            this.models = {};
            this.items = {};

            //this.model.bind('change:searchName', this.changeSearchName, this);

            this.model.bind('change:repeat', this.changeRepeat, this);
            this.model.bind('change:volume', this.changeVolume, this);
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
            var repeat = (e.target.className.indexOf('active') >= 0);
            this.repeat(!repeat);
            return this;
        },

        eventClickPause: function () {
            this.pause();
        },

        eventChangeSearchGlobal:function(e){
            this.model.set({searchGlobal: e.target.checked});
        },

        eventClickVolume:function(e){

            var volumewidth = this.nodes.$volumewrap.width();
            //var volumepos = parseInt(this.nodes.controls.$volume.css('left').replace('%', ''));

            var value;

            var x = e.offsetX == undefined ? e.layerX : e.offsetX;
            if(x == undefined){
                x = e.pageX || e.x;
                x = x -  e.target.getBoundingClientRect().left;
            }

            /**
             * TODO
             */

            value = x / volumewidth;
            if(value < 0){
                value = 0;
            }

            if(value > 1){
                value = 1;
            }

            this.model.set({volume:value});

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

        changeVolume:function(){

            var volume = this.model.get('volume');
            var cssvol = volume * 100;
            this.nodes.controls.$volume.css('left', cssvol + '%');
            this.setvol(volume);
        },

        /**
         * controls
         * @param time
         */

        setvol:function(value){

            if(!this.nodes.item){
                return false;
            }

            this.nodes.item.volume = value;

        },

        rewind: function (time) {
            var model = this.model.getAudioModel(this.model.get('aid'), this.model.get('owner_id'));
            var duration = model.get('duration');
            this.nodes.item.currentTime = time;
            this.app.log('PlayerController rewind:' + time);
        },

        next: function () {
            this.app.log('PlayerController next repeat:' + this.model.get('repeat'));

            var model = this.model.getAudioModel(this.model.get('aid'), this.model.get('owner_id'));
            this.app.collections.audios.setElement(model);

            //if (this.model.get('repeat')) {
            //    this.nodes.item.currentTime = 0;
            //    this.nodes.item.play();
            //    return this;
            //}

            if (this.nodes.item && this.nodes.item.currentTime) {
                this.nodes.item.currentTime = 0;
            }

            var next = this.app.collections.audios.next().getElement();
            if (next) {
                this.play(next.get('aid'), next.get('owner_id'));
            }
        },

        prev: function () {
            var model = this.model.getAudioModel(this.model.get('aid'), this.model.get('owner_id'));
            this.app.collections.audios.setElement(model);
            var prev = this.app.collections.audios.prev().getElement();

            if (prev) {
                this.play(prev.get('aid'), prev.get('owner_id'));
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

            var model = this.model.getAudioModel(this.model.get('aid'), this.model.get('owner_id'));
            model.set({play: false});

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
            var model = this.model.getAudioModel(this.model.get('aid'), this.model.get('owner_id'));

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
        _makeItemEvents: function () {
            this.app.log('PlayerController._makeItemEvents');

            var self = this;
            var item = this.nodes.item;
            var model = this.model.getAudioModel(this.model.get('aid'), this.model.get('owner_id'));
            var modelData = model.toJSON();


            if (this.timers.process) {
                clearInterval(this.timers.process);
            }


            this.timers.process = setInterval(function () {

                var time = self.nodes.item.currentTime;
                var model = self.model.getAudioModel(self.model.get('aid'), self.model.get('owner_id'));

                var playprogess = time / parseInt(model.get('duration')) * 100;
                playprogess = Math.ceil(playprogess);

                if (playprogess > 100) {
                    playprogess = 100;
                }

                model.set({playprogess: playprogess});

            }, 1000);

            var progress = function () {

                var loadprogess = 0;
                var ranges = [];

                for (var i = 0; i < this.buffered.length; i++) {
                    ranges.push([
                        this.buffered.start(i),
                        this.buffered.end(i)
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

                var aid = this.getAttribute('data-aid');
                var owner_id = this.getAttribute('data-owner_id');
                var model = self.model.getAudioModel(aid, owner_id);
                model.set({loadprogess:loadprogess});

                if(this.buffered.length > 0
                    && this.paused
                    && parseInt(aid) == self.model.get('aid')
                    && parseInt(owner_id) == self.model.get('owner_id')){

                    /**
                     * PLAY ITEM
                     */
                    this.play();
                }

            };

            var ended = function () {

                if(self.model.get('repeat')){
                    self.play(self.model.get('aid'), self.model.get('owner_id'))
                    return this;
                }
                self.next();
            };

            item.addEventListener('ended', ended);
            item.addEventListener('progress', progress);


            /**
             * remove and next error item
             */
            (function (n, m, pFunc, eFunc) {

                setTimeout(function () {

                    if (
                        n.buffered.length === 0
                        && m.get('aid') == self.model.get('aid')
                        && m.get('owner_id') == self.model.get('owner_id')) {

                        if(n.currentTime){
                            n.currentTime = 0;
                        }

                        n.removeEventListener('ended', eFunc);
                        n.removeEventListener('progress', pFunc);
                        n.pause();
                        n.remove();
                        self.nodes.item.remove();
                        self.play(m.get('aid'), m.get('owner_id'));
                    }

                }, 8000);

            })(item, model, progress, ended);

        },

        play: function (aid, owner_id) {


            if (aid && aid.target) {
                aid = false;
            }

            var model;

            if (aid && owner_id) {
                model = this.model.getAudioModel(aid, owner_id);
            } else {
                model = this.model.getAudioModel();
                if(!model){
                    alert('please wait.... items not load');
                    return false;
                }

                aid = model.get('aid');
                owner_id = model.get('owner_id');
            }


            this.app.log('PlayerController play aid:' + aid + ' | owner_id:' + owner_id);
            model.set({play: true});

            if(this.models.current){
                this.models.prev = this.models.current;
            }

            if(this.models.prev){
                this.models.prev.set({play:false});
            }

            this.models.current = model;

            this.app.collections.audios.setElement(model);

            /**
            * view changes
            */
            this.nodes.controls.$play.addClass('display-none');
            this.nodes.controls.$pause.removeClass('display-none');
            /**
            * #
            */

            var events = false;
            var item = document.getElementById('' +
                'audio-preload-' +
                model.get('aid') + '-' +
                model.get('owner_id')
            );

            if(!item){
                events = true;
            }

            item = model.views.list.getNodeAudio();

            /**
            * if this.nodes.item isset and item not found
            * or this.nodes.item isset and item isset and this.nodes.item !== item
            * need set this.nodes.item time = 0, stop element
            */
            if (this.nodes.item && item && item !== this.nodes.item) {

                this.app.log('PlayerController play:' + aid + ', previous item.currentTime = 0');

                this.nodes.item.pause();
                if (this.nodes.item.currentTime) {
                    this.nodes.item.currentTime = 0;
                }
            }

            /**
             * TODO
             * @type {HTMLElement}
             */
            this.nodes.item = item;
            this.nodes.item.volume = this.model.get('volume');
            this.model.set({aid: parseInt(aid), owner_id: parseInt(owner_id)});

            //var previousAid = this.model.previous('aid');
            //var previousOwner_id = this.model.previous('owner_id');

            if(events){
                this._makeItemEvents();
            }else{
                /**
                 * TODO play active item
                 */
                this.nodes.item.play();
            }

            /**
             * set play false model
             */
            if(this.models.prev){
                this.models.prev.set({play:false});
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
            this.nodes.$volumewrap = this.$el.find('.player-controller-controls-volume');
            this.nodes.controls.$volume = this.$el.find('.player-controller-controls-volume__value');

            this.children.player = new PlayControllerPlayer({
                parent: this,
                el: this.$el.find('.player-controller-player')
            });

            return this;
        }

    });

    return PlayerController;
});