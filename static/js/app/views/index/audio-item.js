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

            this.model.views.list = this;
            this.model.bind('change:play', this.changePlay, this);
            this.model.bind('change:playprogess', this.changePlayProgress, this);
            this.model.bind('change:loadprogess', this.changeLoadProgress, this);

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

            this.app.log('AudioItemView.changePlay: ' + this.model.get('play') + ', cid:' + this.model.cid);

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
            var cid = this.model.cid;
            this.app.playercontroller.play(cid);
        },

        eventClickPause:function(){
            this.app.playercontroller.pause();
        },

        render:function(){

            var data = this.model.toJSON();
            var html = _.template(indexTpl)(data);
            this.el.innerHTML = html;

            this.el.id = 'audio-item_' + data.aid;

            this.nodes.controls.$play = this.$el.find('.audios-list-item-control-play');
            this.nodes.controls.$pause = this.$el.find('.audios-list-item-control-pause');
            this.nodes.$progress = this.$el.find('.audios-list-item-progress');
            this.nodes.$progressPosition = this.$el.find('.audios-list-item-progress-position');
            this.nodes.$progressValue = this.$el.find('.audios-list-item-progress-value');

            return this;
        }

    });

    return AudioItemView ;
});