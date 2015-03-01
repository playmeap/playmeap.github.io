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
            this.collection.bind('add', this.addItem, this);
            this.collection.bind('unshift', this.addPrepend, this);

            this.collection.collectionModel.bind('change', this.changeCollectionModel, this);
            this.render();

        },

        changeCollectionModel:function(){
            this.$el.addClass('preload');
        },

        addPrepend:function(){

            var item = this.collection.at(0);

            var view = new AudioItemViewClass({
                parent:self,
                model:item
            });

            if(this.children[item.cid]){
                this.children[item.cid].remove();
            }

            this.children[item.cid] = view;
            this.$el.prepend(view.render().el);

        },

        addItem:function(item, attr, options){

            var self = this;

            (function(i, a, o){

                var view = new AudioItemViewClass({
                    parent:self,
                    model:i
                });

                if(self.children[i.cid]){
                    self.children[i.cid].remove();
                }

                self.children[i.cid] = view;

                if(o
                    && ( (o.at) || (o.at === 0 || o.at === -1))
                ){

                    if(o.at < 0){
                        self.$el.prepend(view.render().el);
                        return this;
                    }

                    var before = $('.audios-list-item:nth-child(' + o.at + ')');
                    if(before.length > 0){
                        before.after(view.render().el);
                        return this;
                    }

                    return this;
                }

                self.$el.append(view.render().el);

            })(item, attr, options);


            return this;
        },

        render:function(){

            this.app.log('AudiosView.render');

            var self = this;
            this.el.innerHTML = '';

            /**
             * mega fast rendering :D
             */
            setTimeout(function(){
                self.$el.removeClass('preload');
            }, 500);

            _.each(this.children, function(view, id){
                view.remove();
                delete this.children[id];
            }, this);

            _.each(this.collection.models, this.addItem, this);

        }

    });

    return AudiosView;
});