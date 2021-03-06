define([
    'jquery',
    'underscore',
    'backbone',
    'app/models/user-profile'
], function ($,
             _,
             Backbone,
             UserProfileModelClass) {

    var UsersCollection = Backbone.Collection.extend({

        url: 'friends.get',
        model:UserProfileModelClass,

        initialize: function () {

            this.collectionModel = new (Backbone.Model.extend());
            this.collectionModel.set({
                fields: ['nickname', 'sex', 'bdate', 'photo_50', 'online', 'status', 'can_see_audio', 'online']
            }, {silent: true});

            this.collectionModel.bind('change', this.fetch, this);
            this.setElement(this.at(0));

        },

        searchByName: function (name) {

            name = name.split(' ').join('').toLocaleLowerCase();

            if (!name) {
                return false;
            }

            var items = _.filter(this.models, function (model) {

                var first_name = model.get('first_name');
                var last_name = model.get('last_name');
                var user_id = model.get('user_id');

                var str = first_name + last_name + user_id;
                str = str.split(' ').join('').toLocaleLowerCase();

                var index = str.indexOf(name);
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

                    //console.log(JSON.stringify(r.response));

                    var items = _.filter(r.response, function (item) {
                        return item.can_see_audio;
                    }, self);

                    self.reset(items);
                    self.setElement(self.at(0));

                } else {
                    alert(r.error.error_msg);
                    self.reset([]);
                }
            });

        }
    });

    return UsersCollection;
});