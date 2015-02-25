define([
    'jquery',
    'underscore',
    'backbone'
], function ($,
             _,
             Backbone) {
    var UsersCollection = Backbone.Collection.extend({

        url:'friends.get',

        initialize:function(){

            this.collectionModel = new (Backbone.Model.extend());
            this.collectionModel.set({
                fields:['nickname', 'sex', 'bdate', 'photo_50', 'online', 'status', 'can_see_audio', 'online']
            }, {silent:true});

            this.collectionModel.bind('change', this.fetch, this);
            this.setElement(this.at(0));

        },

        searchByName:function(name){

            name = name.split(' ').join('').toLocaleLowerCase();

            if(!name){
                return false;
            }

            var items = _.filter(this.models, function(model){

                var first_name = model.get('first_name');
                var last_name = model.get('last_name');
                var user_id = model.get('user_id');

                var str = first_name + last_name + user_id;
                str = str.split(' ').join('').toLocaleLowerCase();

                var index = str.indexOf(name);
                if(index >= 0){
                    return true;
                }

            });

            return items;
        },

        fetch:function(){

            var self = this;
            var data = this.collectionModel.toJSON();

            VK.Api.call(this.url, data, function (r) {

                if (r && r.response) {

                    var items = _.filter(r.response, function(item){
                        return item.can_see_audio;
                    }, self);

                    self.reset(items);
                } else {
                    alert(r.error.error_msg);
                    self.reset([]);
                }
            });

        },

        getElement: function() {
            return this.currentElement;
        },

        setElement: function(model) {
            this.currentElement = model;
        },

        next: function (){
            this.setElement(this.at(this.indexOf(this.getElement()) + 1));
            return this;
        },

        prev: function() {
            this.setElement(this.at(this.indexOf(this.getElement()) - 1));
            return this;
        }
    });

    return UsersCollection ;
});