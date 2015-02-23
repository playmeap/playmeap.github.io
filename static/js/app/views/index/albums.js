/**
 * Created by ed on 19.02.15.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'app/views/index/album-item',
    'text!templates/albums/albums-index.tpl'
], function ($,
             _,
             Backbone,
             AlbumItemViewClass,
             indexTpl) {

    var AlbumsView = Backbone.View.extend({

        tagName:'ul',
        className:'preload albums-list-view',

        initialize:function(options){

            this.children = {};
            this.parent = options.parent;
            this.wrap = options.wrap;

            this.collection = this.app.collections.albums;
            this.collection.bind('reset', this.render, this);
            this.collection.collectionModel.bind('change', this.changeCollectionModel, this);
        },

        changeCollectionModel:function(){
            this.$el.addClass('preload');
        },

        render:function(){

            this.app.log('AlbumsView.render');

            var self = this;
            var data = {
                mid:this.app.attributes.mid
            };

            this.el.innerHTML = _.template(indexTpl)(data);

            this.$el.removeClass('preload');

            _.each(this.children, function(view, id){
                view.remove();
                delete this.children[id];
            }, this);

            _.each(this.collection.models, function(model){

                var view = new AlbumItemViewClass({
                    parent:self,
                    model:model
                });

                this.children[model.cid] = view;
                this.$el.append(view.render().el);

            }, this);

        }

    });

    return AlbumsView;
});