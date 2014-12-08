define([
    'underscore',
    'backbone',
    'views/login/index.min',
    'views/index.min',
    'views/audios/index.min',
    'views/friends/index.min',
    'views/static.min',
    'collections/audios/index.min',
    'collections/users/users.min'
], function (_,
             Backbone,
             LoginViewClass,
             IndexViewClass,
             AudiosViewClass,
             FriendsViewCLass,
             StaticViewClass,
             AudiosCollectionClass,
             UsersCollectionClass) {

    var Router = Backbone.Router.extend({

        routes: {
            '': 'index',
            'login': 'loginAction',
            'logout': 'logoutAction',
            'id_:id/audios/list': 'audiosAction',
            'id_:id/friends': 'friendsAction',
            '*path': 'defaultAction'
        },

        _createBaseCollections: function (data) {

            var create = {
                friends: false,
                audio: false
            };


            if (data.friends) {
                if (this.app.collections.friendsList) {

                    var optionsF = this.app.collections.audioList.options;
                    var tmpOptionsF = _.extend({}, optionsF, data.friends);

                    if (!optionsF.user_id) {
                        optionsF.user_id = tmpOptionsF.user_id;
                    }

                    if (!_.isEqual(optionsF, tmpOptionsF)) {
                        create.friends = true;
                        this.app.collections.friendsList.options = tmpOptionsF;
                        this.app.collections.friendsList.loadData();
                    }

                } else {
                    create.friends = true;
                    this.app.collections.friendsList = new UsersCollectionClass({user_id: data.friends.user_id})
                }
            }

            if (data.audio) {

                if (this.app.collections.audioList) {

                    var optionsA = this.app.collections.audioList.options;
                    optionsA.album_id = false;
                    var tmpOptionsA = _.extend({}, optionsA, data.audio);

                    if (!optionsA.user_id) {
                        optionsA.user_id = tmpOptionsA.user_id;
                    }

                    if (!_.isEqual(optionsA, tmpOptionsA)) {
                        create.audio = true;
                        this.app.collections.audioList.options = tmpOptionsA;
                        this.app.collections.audioList.loadData();
                    }

                } else {
                    create.audio = true;
                    this.app.collections.audioList = new AudiosCollectionClass({
                        owner_id: data.audio.owner_id,
                        album_id: false
                    });
                }
            }

            if (data.audioFavorites) {
                if (this.app.collections.audioFavorites) {

                    var optionsFV = this.app.collections.audioFavorites.options;
                    var tmpOptionsFV = _.extend({}, optionsFV, data.audioFavorites);

                    if (!optionsFV.owner_id) {
                        optionsFV.owner_id = tmpOptionsFV.owner_id;
                    }

                    if (!_.isEqual(optionsFV, tmpOptionsFV)) {
                        create.audioFavorites = true;
                        this.app.collections.audioFavorites.options = tmpOptionsFV;
                        this.app.collections.audioFavorites.loadData();
                    }

                } else {
                    create.audioFavorites = true;
                    this.app.collections.audioFavorites = new AudiosCollectionClass({
                        owner_id: data.audioFavorites.owner_id,
                        album_id: data.audioFavorites.album_id
                    });
                }
            }

            return create;
        },

        index: function () {

            if (!this.app.attributes.logined) {
                return this.navigate('#/login', {trigger: true});
            }

            if (!this.app.views.index) {
                this.app.views.index = new IndexViewClass();
            }

            this.navigate('#/id_' + this.app.attributes.mid + '/audios/list', {trigger:true});
        },

        audiosAction: function (id) {

            if (!this.app.attributes.logined) {
                return this.navigate('#/login', {trigger: true});
            }

            if (!this.app.views.index) {
                this.app.views.index = new IndexViewClass();
            }

            var collectionData = {
                friends: {user_id: this.app.attributes.mid},
                audio: {owner_id: id},
                audioFavorites: {owner_id: this.app.attributes.mid, album_id: true}
            };

            var creates = this._createBaseCollections(collectionData);

            if (!this.view || this.view.name !== 'AudiosIndexView') {
                this.view = new AudiosViewClass({createCollections: creates});
            } else {
                this.view.reload({
                    childs: ['appContentCol1']
                });
            }


        },

        friendsAction: function (id) {

            if (!this.app.attributes.logined) {
                return this.navigate('#/login', {trigger: true});
            }

            if (!this.app.views.index) {
                this.app.views.index = new IndexViewClass();
            }

            var collectionData = {
                friends: {user_id: id},
                audio: {owner_id: this.app.attributes.mid},
                audioFavorites: {owner_id: this.app.attributes.mid, album_id: true}
            };

            var creates = this._createBaseCollections(collectionData);

            if (!this.view || this.view.name !== 'FriendsIndexView') {
                this.view = new FriendsViewCLass({createCollections: creates});
            } else {
                console.log('reload');
            }

        },

        logoutAction: function () {
            VK.Auth.logout();
            this.navigate('login', {trigger: true});
        },

        loginAction: function () {

            if (this.view) {
                this.view.remove();
            }

            if (this.app.views.index) {
                this.app.views.index.remove();
                delete this.app.views.index;
            }

            this.view = new LoginViewClass();
        },

        defaultAction: function (action) {

            if (!this.app.attributes.logined) {
                return this.navigate('#/login', {trigger: true});
            }

            var staticActions = {
                about:{
                    tpl:'static/about.html',
                    node:'.appContentNode',
                    navSelector:'#geAboutPage'
                }
            };

            if(!staticActions[action]) {
                return this.navigate('#/', {trigger: true});
            }

            if (!this.app.views.index) {
                this.app.views.index = new IndexViewClass();
            }


            var collectionData = {
                friends: {user_id: this.app.attributes.mid},
                audio: {owner_id: this.app.attributes.mid},
                audioFavorites: {owner_id: this.app.attributes.mid, album_id: true}
            };

            this._createBaseCollections(collectionData);
            this.view = new StaticViewClass(staticActions[action]);

            this.app.log({msg: 'router > ' + action});
        }
    });

    return Router;

});