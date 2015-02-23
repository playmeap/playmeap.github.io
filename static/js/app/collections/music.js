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

        initialize: function () {
            this.collectionModel = new (Backbone.Model.extend());
            this.collectionModel.bind('change', this.fetch, this);
            this.setElement(this.at(0));
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

        fetch: function () {

            var self = this;
            var data = this.collectionModel.toJSON();

            VK.Api.call(this.url, data, function (r) {

                if (r && r.response) {

                    var items = r.response.slice(1, r.response.length);

                    items = _.map(items, function(item){
                        var model = self.findWhere({aid:item.aid, owner_id:item.owner_id});
                        if(!model){
                            return item;
                        }

                        data = _.extend(item, model.toJSON());

                        /**
                         * FIX model to view link
                         * and node
                         */
                        return data;

                    }, this);

                    self.reset(items);

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