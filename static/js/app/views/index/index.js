/**
 * Created by ed on 17.02.15.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'app/views/index/audios',
    'app/views/index/albums',
    'app/views/index/friends',
    'app/views/index/search',
    'app/views/play-controller',
    'text!templates/index/index.tpl'
], function ($,
             _,
             Backbone,
             AudiosViewClass,
             AlbumsViewClass,
             FriendsViewClass,
             SearchViewClass,
             PlayerControllerClass,
             indexTpl) {

    var IndexPageView = Backbone.View.extend({

        initialize: function () {

            this.children = {};

            this.app.playercontroller = new PlayerControllerClass();

            this.app.views.index.nodes.$app.prepend(this.app.playercontroller.render().el);

            this.children.audios = new AudiosViewClass({
                parent:this,
                wrap:'#js_audios-list'
            });

            this.children.albums = new AlbumsViewClass({
                parent:this,
                wrap:'#js_album-list'
            });

            this.children.friends = new FriendsViewClass({
                parent:this,
                wrap:'#js_fiends-list'
            });

            this.children.search= new SearchViewClass({
                parent:this,
                wrap:'#js_search-list'
            });

        },

        render: function () {

            this.el.innerHTML = indexTpl;

            _.each(this.children, function(child){
                var wrap = this.$el.find(child.wrap);
                wrap.html(child.el);
            }, this);

            return this;
        }


    });

    return IndexPageView;
});