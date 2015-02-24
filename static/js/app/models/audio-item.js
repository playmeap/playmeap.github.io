/**
 * Created by ed on 19.02.15.
 */
define([
    'jquery',
    'underscore',
    'backbone'
], function ($,
             _,
             Backbone) {
    var AudioItemModel = Backbone.Model.extend({
        defaults:{
            play:false,
            loadprogess:0,
            playprogess:0
        }
    });
    return AudioItemModel;
});