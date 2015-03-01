require([
    'config'
], function (requireConfig) {

    /**
     * TODO LIST
     *
     * TODO
     * need fix. if user has friend audio - hidden plus
     */

    /**
     * startup config modifications
     */

    if (document.location.href.indexOf('local') >= 0) {
        requireConfig.defaultOptions.debug = true;
    }

    if(requireConfig
        && requireConfig.defaultOptions
        && requireConfig.defaultOptions.debug){

        var d = new Date();
        requireConfig.urlArgs += '-' +
            d.getHours() + '-' +
            d.getMinutes() + '-' +
            d.getSeconds() + '-' +
            d.getMilliseconds()
    }

    requireConfig.defaultOptions.apiIds.active = (requireConfig.defaultOptions.debug) ? requireConfig.defaultOptions.apiIds.test : requireConfig.defaultOptions.apiIds.prod;

    if(!requireConfig.defaultOptions.debug){
        requireConfig.defaultOptions.demo = false;
    }


    require.config(requireConfig);
    require(['app/app']);

});