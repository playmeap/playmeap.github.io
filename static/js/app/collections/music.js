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
                this.app.log('getCacheCollection.saveCacheCollection');
            }else{

                var cacheItems = this.getCacheCollection(data);
                var mergeItems = this.mergeItems(items, cacheItems);

                this.cache = _.map(this.cache, function(cache){

                    if(_.isEqual(cache.data, data)){
                        return mergeItems;
                    }

                    return cache;

                }, this);

                this.app.log('getCacheCollection.saveCacheCollection [update-merge]');
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

            if(items){
                this.app.log('MusicCollection.getCacheCollection items:' + items.length);
                return items;
            }

            this.app.log('MusicCollection.getCacheCollection items:false');
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

        mergeItems:function(items, itemsOld){

            var self = this;
            var itemsMerge;
            var playercontroller = self.app.models.playercontroller;
            var currentAid = parseInt(playercontroller.get('aid'));

            if(!itemsOld){
                itemsOld = this.models;
            }

            itemsMerge = _.map(items, function(item){

                var data;
                var model = _.findWhere(itemsOld, {aid:item.aid, owner_id:item.owner_id});


                if(!model){
                    return item;
                }

                if(model && model.attributes){
                    return _.extend(model.toJSON(), item);
                }

                return _.extend(model, item);

            }, this);

            this.app.log('getCacheCollection.mergeItems');
            return itemsMerge;

        },

        /**
         * load new items after collection reset (cache items)
         * @param data
         */
        postLoad:function(data){

            var self = this;

            VK.Api.call(this.url, data, function (r) {

                if (r && r.response) {

                    /**
                     * TODO FIX ERROR
                     * @type {Array.<T>|string|Blob|*}
                     */

                    var items = r.response.slice(1, r.response.length);

                    var playercontroller = self.app.models.playercontroller;
                    var currentOwner_id = parseInt(playercontroller.get('owner_id'));

                    if(currentOwner_id === parseInt(data.owner_id)){

                        _.each(items, function(item){

                            var oldItem = self.findWhere({aid:item.aid, owner_id:item.owner_id});

                            if(oldItem){
                                var newItem = _.extend(item, oldItem.toJSON());
                                oldItem.set(newItem);
                            }else{
                                self.unshift(item);
                                self.trigger('unshift');
                            }

                        }, this);

                    }

                    self.app.log('MusicCollection.postLoad load set items. ' + self.length);
                }
            });

        },

        fetch: function () {

            var self = this;
            var items;
            var data = this.collectionModel.toJSON();
            var itemsCache = this.getCacheCollection(data);
            var previousAttributes = this.collectionModel.previousAttributes();

            if(!_.isEmpty(previousAttributes)){
                var previousItems = this.toJSON();
                this.saveCacheCollection(previousItems, previousAttributes);
            }

            if(itemsCache){
                items = this.mergeItems(itemsCache);
                setTimeout(function(){
                    self.reset(items);
                    self.postLoad(data);
                    self.app.log('MusicCollection.fetch load cache items. ' + self.length);
                }, 0);
                return this;
            }


            VK.Api.call(this.url, data, function (r) {

                if (r && r.response) {

                    var items = r.response.slice(1, r.response.length);
                    items = self.mergeItems(items);
                    self.reset(items);
                    self.setElement(self.at(0));

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