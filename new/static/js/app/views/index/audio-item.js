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
            'click .audios-list-item-play':'eventClickPlay',
            'click .audios-list-item-stop':'eventClickStop',
            'click .audios-list-item-repeat':'eventClickRepeat',
            'change input[name="duration-set"]':'eventSetTime'
        },

        initialize:function(options){
            this.parent = options.parent;
        },

        eventSetTime:function(e){
            var time = e.target.value;
            this.app.playercontroller.rewind(time);
        },

        eventClickPlay:function(){
            var cid = this.model.cid;
            this.app.playercontroller.play(cid);
        },

        eventClickStop:function(){

        },

        eventClickRepeat:function(e){
            if(e.target.className.indexOf('active') >= 0){
                this.app.playercontroller.repeat(false);
                $(e.target).removeClass('active');
                return this;
            }
            $(e.target).addClass('active');
            this.app.playercontroller.repeat(true);
        },

        render:function(){

            var data = this.model.toJSON();
            var html = _.template(indexTpl)(data);
            this.el.innerHTML = html;

            this.el.id = 'audio-item_' + data.aid;

            return this;
        }

    });

    return AudioItemView ;
});