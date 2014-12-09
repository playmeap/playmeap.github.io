/**
 * Created by ed on 06.12.14.
 */
define([
    'underscore',
    'appdir/app.min'
], function (_,
             App) {

    App.defaultOptions = {
        version: "0.0.2",
        debug: true,
        apiId: 4664170,
        proxySever:'http://playmeap.appspot.com/?',
        cacheAudio:10,
        scope: {
            textValues: ['friends', 'audio', 'status', 'groups'],
            intValues: [2, 8, 1024, 262144]
        }
    };

    App.defaultOptions.getScope = function(){
        return this.attributes.scope.intValues.reduce(function (prev, current) {
            return parseInt(prev) + parseInt(current);
        });
    }.bind(App);


    if (window.location.origin.indexOf('.local') >= 0) {
        App.defaultOptions.apiId = 4664902;
        //App.defaultOptions.proxySever = 'http://playme-server.local/?';
    }


    VK.init({
        apiId: App.defaultOptions.apiId
    });

    VK.Auth.getLoginStatus(function (resp) {

        if (resp.session) {
            App.defaultOptions.logined = true;
            _.extend(App.defaultOptions, resp.session);

            VK.Api.call('status.get', {owner_id: App.defaultOptions.mid}, function (r) {

                if (r.response && r.response.audio) {
                    App.defaultOptions.active_audio = r.response.audio;
                    App.start();
                } else {
                    App.start();
                }

            });
        }else{
            App.start();
        }
    });

});