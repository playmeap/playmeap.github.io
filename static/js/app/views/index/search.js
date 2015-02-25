/**
 * Created by ed on 20.02.15.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'app/views/index/friend-item',
    'app/views/index/audio-item'
], function ($,
             _,
             Backbone,
             UserItemViewClass,
             AudioItemViewClass) {

    var SearchView = Backbone.View.extend({

        tagName: 'div',
        className: 'search-list-view',

        events:{
            'click .friends-list-item':'eventClickToFriend'
        },

        initialize: function (options) {
            this.parent = options.parent;
            this.wrap = options.wrap;
            this.children = [];
            this.nodes = {};

            this.controllerModel = this.app.models.playercontroller;
            this.controllerModel.bind('change:searchName', this.render, this);
        },

        eventClickToFriend:function(){
            this.nodes.$nodeAudios.html('');
        },

        render: function () {

            this.$el.addClass('preload');

            var self = this;
            _.each(this.children, function(child){
                child.remove();
            }, this);

            this.el.innerHTML = '';
            var value = this.controllerModel.get('searchName');



            var itemsAudio = this.app.collections.audios.searchByName(value);
            var itemsFriends = this.app.collections.users.searchByName(value);

            if(!itemsAudio && !itemsFriends){
                this.$el.removeClass('preload');
                this.el.innerHTML = '';
                return this;
            }

            if(itemsAudio.length === 0 && itemsFriends.length === 0){
                this.$el.removeClass('preload');
                this.el.innerHTML = 'Не найдено';
                return this;
            }

            this.$el.removeClass('preload');

            if(itemsFriends.length > 0){
                var $nodeFriends = $('<ul class="friends-list-view friends-list-view_search"></ul>');

                _.each(itemsFriends, function(model, num){
                    var view = new UserItemViewClass({
                        parent:self,
                        model:model
                    });

                    this.children[model.cid] = view;
                    $nodeFriends.append(view.render().el);

                    if(num == itemsFriends.length -1){
                        this.$el.append($nodeFriends);
                        this.nodes.$nodeFriends = $nodeFriends;
                    }

                }, this);
            }

            if(itemsAudio.length > 0){
                $nodeAudios = $('<ul class="audios-list-view audios-list-view_search"></ul>');

                _.each(itemsAudio, function(model, num){
                    var view = new AudioItemViewClass({
                        parent:self,
                        model:model
                    });

                    this.children[model.cid] = view;
                    $nodeAudios.append(view.render().el);

                    if(num == itemsAudio.length -1){
                        this.$el.append($nodeAudios);
                        this.nodes.$nodeAudios = $nodeAudios;
                    }

                }, this);
            }

        }

    });

    return SearchView;
});