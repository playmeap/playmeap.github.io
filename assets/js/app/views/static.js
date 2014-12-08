/**
 * Created by ed on 08.12.14.
 */
define([
    'jquery',
    'underscore',
    'backbone'
], function ($,
             _,
             Backbone) {

    var AppStaticView = Backbone.View.extend({

        initialize:function(options){

            this.options = options;
            var self = this;
            if(options.tpl){
                require(['text!templates/' + options.tpl], function(indexTpl){
                    self.indexTpl = indexTpl;
                    self.render();
                });
            }

        },

        render:function(){
            if(!this.options.data){
                this.options.data = {};
            }

            this.el.innerHTML = _.template(this.indexTpl)(this.options.data);
            if(this.options.node){
                $(this.options.node).html(this.el);
            }else{
                $('body').html(this.el);
            }

            this.app.views.index.renderNavigate(this.options.navSelector);
        }
    });

    return AppStaticView;
});