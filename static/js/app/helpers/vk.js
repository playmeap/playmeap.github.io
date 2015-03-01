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

    var VKAPI = function(){

        var self = this;

        return {

            attributes:{},

            init:function(obj){

                self.app.log('VKAPI.init demo:' + self.app.fn.demo());

                if(self.app.fn.demo()){
                    return true;
                }

                VK.init(obj);

            },

            Auth:{

                login:function(callback){

                    var scope = self.app.fn.getScope();

                    VK.Auth.login(function (resp) {
                        if (resp.session) {
                            callback.call(this, resp);
                        }
                    }, scope);
                },

                getLoginStatus:function(callback){

                    self.app.log('VKAPI.getLoginStatus demo:' + self.app.fn.demo());

                    if(self.app.fn.demo()){

                        self.app.fn.ajax.get({
                            method:'Auth.getLoginStatus'
                        }, function(){
                            callback.call(this, arguments);
                        }, function(){
                            callback.call(this, arguments);
                        });

                        return true;
                    }

                    VK.Auth.getLoginStatus(function(resp){
                        callback.call(this, resp);
                    });

                }
            }
        }
    };


    return VKAPI;
});