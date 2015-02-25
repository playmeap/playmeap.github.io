define([
    'jquery',
    'underscore',
    'backbone',
    'app/collections/music',
    'app/collections/playlists',
    'app/collections/users',
    'app/views/index/index',
    'app/views/login/index',
    'app/views/index'
], function ($,
             _,
             Backbone,
             MusicCollectionClass,
             PlayListsCollectionClass,
             UsersCollectionClass,
             IndexPageViewClass,
             LoginPageViewClass,
             IndexViewClass) {

    var AppRouter = Backbone.Router.extend({

        routes: {
            '': 'index',
            '#': 'index',
            'login': 'login',
            'logout':'logout',
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

            if(this.app.views.indexPage){
                this.app.views.indexPage.remove();
            }

            if(this.app.playercontroller){
                this.app.playercontroller.remove();
            }

            if(this.app.views.login){
                this.app.views.login.remove();
            }

            this.app.views.login = new LoginPageViewClass();
            this.app.views.index.renderView(this.app.views.login);

        },

        logout:function(){
            VK.Auth.logout();
            this.navigate('login', {trigger: true});
        },

        index: function () {
            this.app.log('route:index');

            if (!this.app.attributes.login) {
                return this.navigate('login', {trigger: true});
            }

            if(this.app.views.login){
                this.app.views.login.remove();
            }

            this.navigate('audios' + this.app.attributes.mid, {trigger: true});

        },

        audios: function (id) {
            this.app.log('route:audios id:' + id);

            if(this.app.views.login){
                this.app.views.login.remove();
            }

            if(!this.app.views.indexPage){
                this.app.views.indexPage = new IndexPageViewClass();
                this.app.views.index.renderView(this.app.views.indexPage);
            }

            //this.app.collections.audios.collectionModel.clear({silent:true});
            //this.app.collections.albums.collectionModel.clear({silent:true});
            //this.app.collections.users.collectionModel.clear({silent:true});

            this.app.collections.audios.collectionModel.set({owner_id:id, album_id:''});
            this.app.collections.albums.collectionModel.set({owner_id:this.app.attributes.mid});
            this.app.collections.users.collectionModel.set({user_id:this.app.attributes.mid});
        },

        album:function(user_id, album_id){
            this.app.log('route:album user_id:' + user_id + ' / album_id:' + album_id);

            if(this.app.views.login){
                this.app.views.login.remove();
            }

            if(!this.app.views.indexPage){
                this.app.views.indexPage = new IndexPageViewClass();
                this.app.views.index.renderView(this.app.views.indexPage);
            }

            //this.app.collections.audios.collectionModel.clear({silent:true});
            //this.app.collections.albums.collectionModel.clear({silent:true});
            //this.app.collections.users.collectionModel.clear({silent:true});

            this.app.collections.audios.collectionModel.set({owner_id:user_id, album_id:album_id});
            this.app.collections.albums.collectionModel.set({owner_id:this.app.attributes.mid});
            this.app.collections.users.collectionModel.set({user_id:this.app.attributes.mid});
        }

    });

    return AppRouter;
});