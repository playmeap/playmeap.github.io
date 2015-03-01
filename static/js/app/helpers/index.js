/**
 * Created by ed on 28.02.15.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'app/helpers/vk',
    'app/helpers/backbone-modification'
], function ($,
             _,
             Backbone,
            VKFuncOvj) {

    /**
     * PROTO OBJECT
     * @type {{}}
     */

    var Proto = {};

    var Fn = function(){

        var self = this;

        return {

            getScope:function () {
                return self.app.attributes.scope.intValues.reduce(function (prev, current) {
                    return parseInt(prev) + parseInt(current);
                });
            },

            demo:function(){
                return self.app.fn.get('demo');
            },

            get:function(name, type) {
                if (!type) {
                    type = 'attributes';
                }
                return self.app[type][name];
            },

            set:function(name, value, type){

                if(!type){
                    type = 'attributes';
                }

                if(typeof name === 'object'){

                    for(var n in name){
                        self.app.fn.set(n, name[n]);
                    }

                    return this;
                }

                if(!self.app[type]){
                    self.app[type] = {};
                }

                if(self.app[type][name]){

                    if(!self.app['_' + type]){
                        self.app['_' + type] = {};
                    }

                    self.app['_' + type][name] = self.app[type][name];
                }

                self.app[type][name] = value;
            },

            ajax:{

                get:function(data, success, error){

                    var url = self.app.fn.get('ajaxDemoUrl');

                    $.ajax({
                        type: 'GET',
                        url: url,
                        crossDomain: true,
                        data: data,
                        dataType: 'json',
                        success: success,
                        error: error
                    });

                },

                post:function(data, success, error, options){

                    //var url = Api.app.attributes.apiurl;
                    //
                    //if (data.action !== 'login') {
                    //    data.token = Api.app.logined().token;
                    //}
                    //
                    //if (options && options.processData === false) {
                    //    data = Api.app.functions.getFormData(data);
                    //}
                    //
                    //var AJAX = _.extend({
                    //    type: 'POST',
                    //    url: url,
                    //    crossDomain: true,
                    //    data: data,
                    //    dataType: 'json',
                    //    success: success,
                    //    error: error
                    //}, options);
                    //
                    //$.ajax(AJAX);

                }

            }
        };

    };


    Proto = {
        fn:Fn,
        vk: VKFuncOvj
    };

    return Proto;
});