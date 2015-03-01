/**
 * Created by ed on 01.03.15.
 */
define([
    'jquery',
    'underscore',
    'backbone'
], function ($,
             _,
             Backbone) {

    /**
     * Backbone.View extend
     * recursively remove child views (nodes and events) if parent view remove
     * @type {Function|Backbone.View.remove}
     */
    var DefaultRemove = Backbone.View.prototype.remove;
    Backbone.View.prototype.remove = function () {

        if (this.nodes) {
            for (var m in this.nodes) {

                if (m.indexOf('$') >= 0) {
                    this.nodes[m].remove();
                }

                //if(m === 'item'){
                //    //this.nodes[m].removeEventListener('ended');
                //    //this.nodes[m].removeEventListener('progress');
                //}
            }
        }

        if (this.children) {
            for (var n in this.children) {
                if (this.children[n].remove) {
                    this.children[n].remove();
                }
            }
        }
        return DefaultRemove.call(this, arguments);
    };


    /**
     * Backbone collection prototype
     * @returns {*}
     */

    var DefaultInitCollection = Backbone.Collection.prototype.initialize;

    Backbone.Collection.prototype.initialize = function(){
        this.setElement(this.at(0));
        return DefaultInitCollection.call(this, arguments);
    };

    Backbone.Collection.prototype.getElement = function () {
        return this.currentElement;
    };

    Backbone.Collection.prototype.setElement = function (model) {
        this.currentElement = model;
    };

    Backbone.Collection.prototype.next = function () {
        this.setElement(this.at(this.indexOf(this.getElement()) + 1));
        return this;
    };

    Backbone.Collection.prototype.prev = function () {
        this.setElement(this.at(this.indexOf(this.getElement()) - 1));
        return this;
    };

    /**
     * Backbone collection cache
     */

    Backbone.Collection.prototype.cache = {};
    Backbone.Collection.prototype.cache.items = [];

    Backbone.Collection.prototype.cache.get = function(data){

        data = _.pick(data, 'owner_id');

        var itemsObj =  _.find(this.items, function(item){
            return parseInt(data.owner_id) == parseInt(item.data.owner_id);
        });

        if(!itemsObj){
            return false;
        }

        return itemsObj.items;

    };

    Backbone.Collection.prototype.cache.save = function(obj){

        data = _.pick(obj.data, 'owner_id');

        if(this.get(data)){
            return this.update(obj);
        }

        obj.data = data;
        return this.items.push(obj);
    };

    Backbone.Collection.prototype.cache.update = function(obj){

        data = _.pick(obj.data, 'owner_id');

        var cacheItems = this.get(data);
        var items = obj.items;

        return _.map(items, function(item){

            var cacheItem = _.findWhere(cacheItems, {aid:item.aid, owner_id:item.owner_id});
            if(cacheItem){
                _.extend(cacheItem, item);
            }

            return item;

        });

    };

    /**
     * # Backbone collection cache
     */


});