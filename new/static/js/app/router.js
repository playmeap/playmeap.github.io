define([
    'jquery',
    'underscore',
    'backbone',
    'app/collections/music',
    'app/collections/playlists',
    'app/collections/users',
    'app/views/index/index',
    'app/views/index'
], function ($,
             _,
             Backbone,
             MusicCollectionClass,
             PlayListsCollectionClass,
             UsersCollectionClass,
             IndexPageViewClass,
             IndexViewClass) {

    var AppRouter = Backbone.Router.extend({

        routes: {
            '': 'index',
            '#': 'index',
            'login': 'login',
            'audios:id': 'audios',
            'audios:user_id/album_id=:album_id':'album'
        },

        initialize: function () {

            this.app.collections.audios = new MusicCollectionClass();
            this.app.collections.albums = new PlayListsCollectionClass();
            this.app.collections.users = new UsersCollectionClass();

            this.app.views.index = new IndexViewClass();

        },

        login: function () {
            this.app.log('route:login');

            var self = this;
            //var scope = this.app.attributes.getScope();
            console.log('a', this.app);

            //VK.Auth.login(function (resp) {
            //    if (resp.session) {
            //        self.app.attributes.logined = true;
            //        _.extend(self.app.attributes, resp.session);
            //        self.app.router.navigate('/', {trigger: true});
            //    }
            //}, scope);

        },

        index: function () {
            this.app.log('route:index');

            if (!this.app.attributes.login) {
                return this.navigate('login', {trigger: true});
            }

            this.navigate('audios' + this.app.attributes.mid, {trigger: true});

        },

        audios: function (id) {
            this.app.log('route:audios id:' + id);

            if(!this.app.views.indexPage){
                this.app.views.indexPage = new IndexPageViewClass();
                this.app.views.index.renderView(this.app.views.indexPage);
            }

            this.app.collections.audios.collectionModel.set({owner_id:id, album_id:''});
            this.app.collections.albums.collectionModel.set({owner_id:this.app.attributes.mid});
            this.app.collections.users.collectionModel.set({user_id:this.app.attributes.mid});
        },

        album:function(user_id, album_id){
            this.app.log('route:album user_id:' + user_id + ' / album_id:' + album_id);

            if(!this.app.views.indexPage){
                this.app.views.indexPage = new IndexPageViewClass();
                this.app.views.index.renderView(this.app.views.indexPage);
            }

            this.app.collections.audios.collectionModel.set({owner_id:user_id, album_id:album_id});
            this.app.collections.albums.collectionModel.set({owner_id:this.app.attributes.mid});
            this.app.collections.users.collectionModel.set({user_id:this.app.attributes.mid});
        }

    });

    return AppRouter;
});