/**
 * Created by ed on 19.02.15.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/audios/audio-list-item.tpl'
], function ($,
             _,
             Backbone,
             indexTpl) {

    var AudioItemView = Backbone.View.extend({

        tagName:'li',
        className:'audios-list-item',

        events:{
            'click .audios-list-item-control-play':'eventClickPlay',
            'click .audios-list-item-control-pause':'eventClickPause',
            'click .audios-list-item-control-plus':'eventClickPlus',
            'click .audios-list-item-control-minus':'eventClickMinus',
            'click .audios-list-item-control-remove':'eventClickRemove',
            'click .audios-list-item-control-remove-cancel':'eventClickRemoveCancel',
            'change input[name="duration-set"]':'eventSetTime',
            'click .audios-list-item-progress':'eventClickSetTime'
        },

        initialize:function(options){

            this.parent = options.parent;
            this.nodes = {};
            this.nodes.controls = {};


            if(!this.model.views){
                this.model.views = {};
            }

            if(this.model.get('itemId')){
                this.model.views.item = document.getElementById(this.model.get('itemId'));
                this.nodes.item = this.model.views.item;
            }

            this.model.views.list = this;
            this.model.bind('change:play', this.changePlay, this);
            this.model.bind('change:playprogess', this.changePlayProgress, this);
            this.model.bind('change:loadprogess', this.changeLoadProgress, this);

            this.model.bind('audio.delete', this.remove, this);
            this.model.bind('audio.add', this.addcomplete, this);
        },

        /**
         * create node audio item and return
         */
        getNodeAudio:function(){

            var node = document.getElementById('' +
                'audio-preload-' +
                this.model.get('aid') + '-' +
                this.model.get('owner_id')
            );

            if(node){
                return node;
            }

            var data = this.model.toJSON();
            var item = document.createElement('audio');

            item.id = 'audio-preload-' + data.aid + '-' + data.owner_id;
            item.setAttribute('src', data.url);
            item.setAttribute('data-aid', data.aid);
            item.setAttribute('data-owner_id', data.owner_id);
            item.setAttribute('preload', 'auto');

            this.app.views.index.nodes.cache.appendChild(item);

            if(!this.model.views){
                this.model.views = {};
            }

            this.model.set({itemId:item.id});

            node = document.getElementById('' +
                'audio-preload-' +
                this.model.get('aid') + '-' +
                this.model.get('owner_id')
            );

            this.model.views.item = node;

            return node;
        },

        changePlayProgress:function(){
            var playprogess = this.model.get('playprogess');
            this.nodes.$progressPosition.css({left:playprogess + '%'});
        },

        changeLoadProgress:function(){
            var loadprogess = this.model.get('loadprogess');
            this.nodes.$progressValue.css({width:loadprogess + '%'});
        },

        changePlay:function(){

            this.app.log('AudioItemView.changePlay: ' + this.model.get('play') + ', aid:' + this.model.get('aid') + '| owner_id:' + this.model.get('owner_id') + ' CID:' + this.model.cid);

            if(this.model.get('play')){
                this.nodes.$progress.removeClass('display-none');
                this.nodes.controls.$play.addClass('display-none');
                this.nodes.controls.$pause.removeClass('display-none');
                return this;
            }

            this.nodes.$progress.addClass('display-none');
            this.nodes.controls.$play.removeClass('display-none');
            this.nodes.controls.$pause.addClass('display-none');
            return this;
        },

        eventClickSetTime:function(e){

            var x = e.offsetX == undefined ? e.layerX : e.offsetX;
            if(x == undefined){
                x = e.pageX || e.x;
                x = x -  e.target.getBoundingClientRect().left;
            }

            /**
             * TODO
             */
            var width = this.nodes.$progress.width();
            var process = x / width * 100;
            process = parseInt(this.model.get('duration')) / 100 * process;
            this.app.playercontroller.rewind(process);

        },

        eventSetTime:function(e){
            var time = e.target.value;
            this.app.playercontroller.rewind(time);
        },

        eventClickPlay:function(){
            var aid = this.model.get('aid');
            var owner_id = this.model.get('owner_id');
            this.app.playercontroller.play(aid, owner_id);
        },

        eventClickPause:function(){
            this.app.playercontroller.pause();
        },

        eventClickPlus:function(){

            this.$el.addClass('preload');
            this.model.audioAdd();

        },

        eventClickMinus:function(){
            this.nodes.controls.$remove.addClass('display-none');
            this.nodes.controls.$removeBlock.removeClass('display-none');
        },

        eventClickRemove:function(){
            this.$el.addClass('preload');
            this.model.audioDelete();
        },

        eventClickRemoveCancel:function(){
            this.nodes.controls.$remove.removeClass('display-none');
            this.nodes.controls.$removeBlock.addClass('display-none');
        },

        addcomplete:function(){
            this.$el.removeClass('preload');
        },

        render:function(){

            var html;
            var data = this.model.toJSON();

            data.plus = false;

            if(parseInt(data.owner_id) !== parseInt(this.app.attributes.mid)){
                data.plus = true;
            }

            if(data.title.length >= 50){
                data.title = data.title.split(',').join(' ').split('.').join(' ');
            }

            html = _.template(indexTpl)(data);

            this.el.innerHTML = html;

            this.el.id = 'audio-item_' + data.aid;

            this.nodes.controls.$play = this.$el.find('.audios-list-item-control-play');
            this.nodes.controls.$pause = this.$el.find('.audios-list-item-control-pause');
            this.nodes.controls.$remove = this.$el.find('.audios-list-item-control-minus');
            this.nodes.$progress = this.$el.find('.audios-list-item-progress');
            this.nodes.$progressPosition = this.$el.find('.audios-list-item-progress-position');
            this.nodes.$progressValue = this.$el.find('.audios-list-item-progress-value');
            this.nodes.controls.$removeBlock = this.$el.find('.audios-list-item-controls-second-remove');

            return this;
        }

    });

    return AudioItemView ;
});