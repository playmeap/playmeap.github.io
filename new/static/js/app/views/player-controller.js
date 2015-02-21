/**
 * Created by ed on 19.02.15.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'app/models/player-controller',
    'text!templates/player-controller.tpl'
], function ($,
             _,
             Backbone,
             PlayerControllerModelClass,
             indexTpl) {


    var PlayerController = Backbone.View.extend({

        events:{
            'keyup .player-controller-search__input':'eventKeyupSearch',
            'click .player-controller-control__bullhorn': 'eventClickHorn'
        },

        initialize: function () {
            this.nodes = {};
            this.model = new PlayerControllerModelClass();
            this.model.view = this;
            this.app.models.playercontroller = this.model;
            //this.model.bind('change:searchName', this.changeSearchName, this);
        },

        eventKeyupSearch:function(e){
            var value = e.target.value;
            this.model.set({searchName:value});
        },

        eventClickHorn:function(e){
            $(e.target).toggleClass('active');
            if(e.target.className.indexOf('active') >=0 ){
                this.model.set({setBroadcast:true});
            }else{
                this.model.set({setBroadcast:false});
            }
        },

        rewind:function(time){
            var model = this.model.getAudioModel();
            var duration = model.get('duration');
            this.nodes.item.currentTime = time;
            this.app.log('PlayerController rewind:' + time);
        },

        next:function(){
            this.app.log('PlayerController next repeat:' + this.model.get('repeat'));

            var model = this.model.getAudioModel();
            this.app.collections.audios.setElement(model);

            if(this.model.get('repeat')){
                this.nodes.item.currentTime = 0;
                this.nodes.item.play();
                return this;
            }

            var next = this.app.collections.audios.next().getElement();
            if(next){
                this.play(next.cid);
            }
        },

        prev:function(){

        },

        repeat:function(state){
            if(state){
                this.model.set({repeat:true});
                return this;
            }

            this.model.set({repeat:false});
        },

        stop:function(){

        },

        play: function (cid) {

            this.app.log('PlayerController play:' + cid);

            var self = this;
            var model = this.model.getAudioModel(cid);
            this.app.collections.audios.setElement(model);

            var item = document.getElementById('audio-preload-' + cid);

            if (!this.nodes.cache) {
                this.nodes.cache = this.app.views.index.nodes.cache;
            }

            if (this.nodes.item) {
                this.nodes.item.pause();
                this.nodes.item.currentTime = 0;
            }

            if(item){
                this.nodes.item = item;
                this.model.set({acid:cid});
                this.nodes.item.currentTime = 0;
                this.nodes.item.play();

                item.addEventListener('ended', function(){
                    self.next();
                });

                return this;
            }
            //
            if (!item) {

                item = document.createElement('audio');
                item.id = 'audio-preload-' + cid;
                item.setAttribute('src', model.get('url'));

                this.nodes.cache.appendChild(item);
                this.nodes.item = item;
                this.model.set({acid:cid});

                item.play();

                item.addEventListener('ended', function(){
                    self.next();
                });
            }

        },

        render: function () {
            this.el.innerHTML = indexTpl;
            return this;
        }

    });

    return PlayerController;
});