define([
    'jquery',
    'underscore',
    'backbone',
    'app/models/audio-item'
], function ($,
             _,
             Backbone,
             AudioItemModelClass) {

    var AudiosCollection = Backbone.Collection.extend({

        model: AudioItemModelClass,
        url: 'audio.get',
        sortPositions:[],

        initialize: function () {

            this.collectionModel = new (Backbone.Model.extend());
            this.collectionModel.bind('change', this.fetch, this);

            this.bind('reset', this.actionReset, this);

        },

        actionReset:function(){

            var data = this.collectionModel.toJSON();
            this.cache.save({data:data, items:this.toJSON()});

        },

        postLoad:function(data){

            var self = this;

            /**
             * MAGIC RECURSION
             * @type {Array}
             */

            self.app.log('AudiosCollection.postLoad');

            var newItems = {};

            var eachItems = function(items, sort, sortId){


                if(items.length === 0){

                    /**
                     * NOW need add models to collection
                     */


                    _.each(newItems, function(group, id){

                        var afterIndex = self.indexOf(self.findWhere({aid:parseInt(id)}));
                        var groupItems = group.reverse();

                        //self.cache.save({data:data, items:groupItems});
                        _.each(groupItems, function(gitem){
                            //console.log('GITEM ADD', afterIndex, gitem);
                            self.add(gitem, {at:afterIndex -1 });
                        });

                    });

                    self.app.log('AudiosCollection.postLoad ready');
                    return;
                }


                if(!sortId){
                    sortId = sort.pop();
                }

                if(sort.length == 0 && !sortId){
                    sortId = self.at(self.length -1).get('aid');
                }

                var item = items.pop();

                if(item.aid === sortId && sort.length > 0){
                    sortId = sort.pop();
                    return eachItems(items, sort, sortId);
                }

                if(!newItems[sortId]){
                    newItems[sortId] = [];
                }

                newItems[sortId].push(item);

                return eachItems(items, sort, sortId);

            };

            VK.Api.call(this.url, data, function (r) {

                if (r && r.response) {

                    var items = r.response.slice(1, r.response.length);

                    /**
                     * remove old models
                     * bad code
                     */
                    //var ids = _.pluck(items, 'aid');
                    //_.each(self.models, function(m){
                    //    if(ids.indexOf(m.get('aid')) < 0){
                    //        m.collection.remove(m);
                    //    }
                    //});

                    /**
                     * add new items
                     */
                    eachItems(items.reverse(), self.sortPositions.slice(0).reverse());


                }
            });

        },

        fetch: function () {

            var self = this;

            var data = this.collectionModel.toJSON();
            var items = this.cache.get(data);
            var updateItems = [];

            var updateData = {};
            updateData.owner_id = parseInt(data.owner_id);

            if(data.album_id){
                updateData.album = data.album_id.toString();
            }

            if(this.length > 0){
                /**
                 * need save cache current items
                 */

                var prevData = this.collectionModel.previousAttributes();

                /**
                 * TODO
                 */
                _.each(this.models, function(m){
                    m.set({play:false, playprogress:0});
                });

                this.cache.save({data:prevData, items:this.toJSON()});

            }

            /**
             * items not found need load new
             */
            if(!items){


                /**
                 * todo create vk methods
                 */
                VK.Api.call(this.url, data, function (r) {

                    if (r && r.response) {

                        var items = r.response.slice(1, r.response.length);
                        updateItems = _.where(items, updateData);

                        self.sortPositions = _.pluck(updateItems, 'aid');

                        self.reset(updateItems);
                        self.setElement(self.at(0));

                    } else {
                        alert(r.error.error_msg);
                        self.reset([]);
                    }
                });
            }

            if(items){

                /**
                 * if album need load albums
                 */

                setTimeout(function(){

                    updateItems = _.where(items, updateData);
                    self.reset(updateItems);

                    self.app.log('AudiosCollection.fetch load cache: ' + updateItems.length);

                    self.sortPositions = _.pluck(updateItems, 'aid');

                    self.setElement(self.at(0));
                    self.postLoad(data);

                }, 0);

            }


        }
    });

    return AudiosCollection;
});