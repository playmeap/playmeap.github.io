define([
    'jquery',
    'underscore',
    'backbone',
    'app/views/index/audio-item'
], function ($,
             _,
             Backbone,
             AudioItemViewClass) {

    var AudiosView = Backbone.View.extend({

        className:'preload audios-list-view',
        tagName:'ul',

        initialize:function(options){

            this.children = {};
            this.parent = options.parent;
            this.wrap = options.wrap;
            this.collection = this.app.collections.audios;
            this.collection.bind('reset', this.render, this);
            //this.collection.bind('fake:reset', this.removePreload, this);
            //this.collection.bind('add', this.addItem, this);

            this.collection.collectionModel.bind('change', this.changeCollectionModel, this);
            this.render();

        },

        changeCollectionModel:function(){
            this.$el.addClass('preload');
        },

        //addItem:function(item){
        //    var view = new AudioItemViewClass({
        //        parent:self,
        //        model:item
        //    });
        //
        //    this.children[item.cid] = view;
        //    this.$el.append(view.render().el);
        //},

        render:function(){

            this.app.log('AudiosView.render');

            var self = this;
            this.el.innerHTML = '';
            this.$el.removeClass('preload');

            _.each(this.children, function(view, id){
                view.remove();
                delete this.children[id];
            }, this);

            _.each(this.collection.models, function(model){

                var view = new AudioItemViewClass({
                    parent:self,
                    model:model
                });

                this.children[model.cid] = view;
                this.$el.append(view.render().el);

            }, this);
        }

    });

    return AudiosView;
});