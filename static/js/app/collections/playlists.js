define([
    'jquery',
    'underscore',
    'backbone',
    'app/models/album-item'
], function ($,
             _,
             Backbone,
            AlbumItemModelClass) {

    var AlbumsCollection = Backbone.Collection.extend({

        model:AlbumItemModelClass,
        url:'audio.getAlbums',

        initialize:function(){
            this.collectionModel = new (Backbone.Model.extend());
            this.collectionModel.bind('change', this.fetch, this);
            //this.setElement(this.at(0));
        },

        //searchByName:function(name){
        //
        //    name = name.split(' ').join('').toLocaleLowerCase();
        //
        //    if(!name){
        //        return false;
        //    }
        //
        //    var items = _.filter(this.models, function(model){
        //        var index = model.get('title').split(' ').join('').toLocaleLowerCase().indexOf(name);
        //        if(index >= 0){
        //            return true;
        //        }
        //
        //        index = model.get('artist').split(' ').join('').toLocaleLowerCase().indexOf(name);
        //        if(index >= 0){
        //            return true;
        //        }
        //    });
        //
        //    return items;
        //},

        fetch:function(){

            var self = this;
            var data = this.collectionModel.toJSON();

            VK.Api.call(this.url, data, function (r) {

                if (r && r.response) {

                    var items = r.response.slice(1, r.response.length);
                    self.reset(items);
                    //self.setElement(self.at(0));

                } else {
                    alert(r.error.error_msg);
                    self.reset([]);
                }
            });


        }

    });

    return AlbumsCollection;
});