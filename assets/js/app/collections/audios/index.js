define([
    'underscore',
    'backbone'
], function (_,
             Backbone) {
    var AudioCollection = Backbone.Collection.extend({

        options: {
            offset: 0,
            //count: 50,
            //owner_id:0,
            //album_id:0
            //audio_ids
        },

        initialize: function (options) {

            if (!options || !options.owner_id) {
                alert('error init collection');
                this.app.log({msg: 'error init collection', data: options});
                return false;
            }

            this.options = _.extend(this.options, options);

            this.bind('reset', function () {
                this.setElement(this.at(0));
            }, this);

            this.loadData();

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
        },

        loadData: function (callback) {

            var self = this;
            var data = this.options;

            data.offset = (data.page > 1) ? data.count / (data.page - 1) : 0;
            delete data.page;

            if (data.album_id) {

                var loadItems = function () {

                    data.album_id = self.app.models.index.get('play_album');
                    VK.Api.call('audio.get', data, function (r) {
                        if (r && r.response) {

                            var items = r.response.slice(1, r.response.length);
                            self.reset(items);

                            if (callback) {
                                callback(true);
                            }
                        } else {
                            alert(r.error.error_msg);
                            self.reset([]);
                            if (callback) {
                                callback(false);
                            }
                        }
                    });
                };


                var createAlbum = function (albums) {
                    var playMeAlbum = _.findWhere(albums, {title: 'playMe'});

                    if (!playMeAlbum) {

                        //TODO max albums count
                        VK.Api.call('audio.addAlbum', {title: 'playMe'}, function (r) {
                            if (r && r.response) {
                                self.app.models.index.set({play_album: r.response.album_id});
                                loadItems.apply(self);
                            } else {
                                alert('error create playme album');
                            }
                        });
                    } else {
                        self.app.models.index.set({play_album: playMeAlbum.album_id});
                        loadItems.apply(self);
                    }

                };

                var album_id = self.app.models.index.get('play_album');
                if (!album_id) {
                    VK.Api.call('audio.getAlbums', data, function (r) {

                        if (r && r.response) {
                            createAlbum(r.response.slice(1, r.response.length));
                        } else {

                        }
                    });
                } else {
                    loadItems.apply(self);
                }

            } else {

                delete data.album_id;
                VK.Api.call('audio.get', data, function (r) {
                    if (r && r.response) {

                        var items = r.response.slice(1, r.response.length);
                        self.reset(items);

                        if (callback) {
                            callback(true);
                        }
                    } else {
                        alert(r.error.error_msg);
                        self.reset([]);
                        if (callback) {
                            callback(false);
                        }
                    }
                });

            }

        }
    });

    return AudioCollection;
});