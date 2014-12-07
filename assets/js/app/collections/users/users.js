define([
    'underscore',
    'backbone'
], function (_,
             Backbone) {

    var UsersCollection = Backbone.Collection.extend({

        options: {
            user_id: 0,
            //count:
            //offset
            fields: ['photo_50', 'can_see_audio', 'status']
        },

        initialize: function (options) {

            if (!options || !options.user_id) {
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

            VK.Api.call('friends.get', data, function (r) {

                if (r && r.response) {

                    var items = _.where(r.response, {can_see_audio: 1});
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
    });

    return UsersCollection;
});