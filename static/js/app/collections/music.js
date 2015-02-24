define([
    'jquery',
    'underscore',
    'backbone',
    'app/models/audio-item'
], function ($,
             _,
             Backbone,
             AudioItemModelClass) {

    var MusicCollection = Backbone.Collection.extend({

        model: AudioItemModelClass,
        url: 'audio.get',

        cache:[],

        initialize: function () {
            this.collectionModel = new (Backbone.Model.extend());
            this.collectionModel.bind('change', this.fetch, this);
            this.setElement(this.at(0));
        },

        saveCacheCollection:function(items, data){
            if(!this.getCacheCollection(data)){
                this.cache.push({items:items, data:data});
            }
        },

        getCacheCollection:function(data){

            var items;
            var itemsCollection = _.filter(this.cache, function(collectionData){

                return _.isEqual(collectionData.data, data);

            }, this);

            itemsCollection = _.first(itemsCollection);
            if(itemsCollection){
                items = itemsCollection.items;
            }

            return items;
        },

        searchByName: function (name) {

            name = name.split(' ').join('').toLocaleLowerCase();

            if (!name) {
                return false;
            }

            var items = _.filter(this.models, function (model) {

                var title = model.get('title');
                var artist = model.get('artist');
                var str = title + artist;
                var index = str.split(' ').join('').toLocaleLowerCase().indexOf(name);

                if (index >= 0) {
                    return true;
                }

            });

            return items;
        },

        mergeItems:function(items){

            var self = this;
            var itemsMerge;
            itemsMerge = _.map(items, function(item){

                var data;
                var model = self.findWhere({aid:item.aid, owner_id:item.owner_id});
                if(!model){
                    return item;
                }

                data = $.extend(true, {}, item, model.toJSON());

                return data;

            }, this);

            return itemsMerge;

        },

        fetch: function () {

            var self = this;
            var items;
            var data = this.collectionModel.toJSON();
            var itemsCache = this.getCacheCollection(data);

            if(itemsCache){
                items = this.mergeItems(itemsCache);

                setTimeout(function(){
                    self.reset(items);
                }, 0);
                return this;
            }


            VK.Api.call(this.url, data, function (r) {

                if (r && r.response) {

                    var items = r.response.slice(1, r.response.length);
                    items = self.mergeItems(items);
                    self.reset(items);
                    delete data.callback;
                    delete data.access_token;

                    self.saveCacheCollection(items, data);

                } else {
                    alert(r.error.error_msg);
                    self.reset([]);
                }
            });

        },

        getElement: function () {
            return this.currentElement;
        },

        setElement: function (model) {
            this.currentElement = model;
        },

        next: function () {
            this.setElement(this.at(this.indexOf(this.getElement()) + 1));
            return this;
        },

        prev: function () {
            this.setElement(this.at(this.indexOf(this.getElement()) - 1));
            return this;
        }

    });

    return MusicCollection;
});