define([
    'jquery',
    'underscore',
    'backbone',
    'views/audios/audiolist.min',
    'views/friends/friendslist.min',
    'views/audios/favorites.min',
    'text!templates/three-cols.html'
], function ($,
             _,
             Backbone,
             AudioListView,
             FriendsListView,
             FavoritesAudioView,
             indexTpl) {

    var AudiosIndexView = Backbone.View.extend({

        name: 'AudiosIndexView',
        tagName: 'div',
        className: 'row audiosView',
        navSelector: '#getAudiosPage',

        initialize: function (options) {

            this.options = options;
            this.$elWrap = $('.appContentNode');
            this.children = {};

            this.children.appContentCol1 = new AudioListView({
                nodeSelector: '.appContentCol1',
                parent: this,
                createCollections: options.createCollections,
                title: '<h2>Music list</h2>'
            });

            this.children.appContentCol2 = new FavoritesAudioView({
                nodeSelector: '.appContentCol2',
                parent: this,
                createCollections: options.createCollections,
                title: '<h2>Favorite playlist</h2>'
            });

            this.children.appContentCol3 = new FriendsListView({
                nodeSelector: '.appContentCol3',
                parent: this,
                createCollections: options.createCollections,
                title: '<h2>Friends list</h2>'
            });

            this.render();
        },

        reload: function (data) {
            if (data.childs) {
                for (var n in data.childs) {
                    document.querySelector('.' + data.childs[n]).classList.add('preload');
                }
            }
        },

        render: function () {

            this.el.innerHTML = '';
            this.el.innerHTML = indexTpl;
            this.$elWrap.html(this.el);
            this.app.views.index.renderNavigate(this.navSelector);

            _.each(this.children, function (view, node) {
                var nodeItem = this.el.querySelector('.' + node);
                nodeItem.innerHTML = '';
                nodeItem.innerHTML += view.options.title;

                nodeItem.appendChild(view.el);
                view.trigger('node:ready');
            }, this);

        }

    });

    return AudiosIndexView;
});