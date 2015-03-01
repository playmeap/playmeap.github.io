/**
 * Created by ed on 19.02.15.
 */
define([
    'jquery',
    'underscore',
    'backbone'
], function ($,
             _,
             Backbone) {
    var AudioItemModel = Backbone.Model.extend({

        urls:{
            'audio.add':'audio.add',
            'audio.delete':'audio.delete'
        },

        defaults:{
            play:false,
            loadprogess:0,
            playprogess:0,
            pluckFields:['artist', 'duration','genre', 'title']
        },

        audioAdd:function(){

            var self = this;
            var data = {};
            data.audio_id = this.get('aid');
            data.owner_id = this.get('owner_id');

            var url = self.urls['audio.add'];

            VK.Api.call(url, data, function (r) {

                if (r && r.response) {
                    self.set({owner_id:parseInt(self.app.attributes.mid)});
                    self.trigger('audio.add');

                } else {
                    alert(r.error.error_msg);
                }
            });

        },

        audioDelete:function(){

            var self = this;
            var data = {};
            data.audio_id = this.get('aid');
            //data.oid = this.get('owner_id');
            data.oid = this.app.attributes.mid;

            var owner_real = this.previous('owner_id');

            var url = this.urls['audio.delete'];

            VK.Api.call(url, data, function (r) {

                if (r && r.response) {

                    if(!owner_real){
                        self.collection.remove(self);
                        self.trigger('audio.delete');
                    }

                    //if(parseInt(owner_real) == data.oid){
                    //    self.collection.remove(self);
                    //    self.trigger('audio.delete');
                    //}else{
                    //
                    //    /**
                    //     * TODO need remove model from collection
                    //     * TODO
                    //     * если добавить аудиозапись то она добавляется в коллекцию пользователя у которого взята
                    //     */
                    //
                    //    self.set({owner:false, owner_id:self.previous('owner_id'), aid:self.previous('aid')});
                    //}


                } else {
                    alert(r.error.error_msg);
                }
            });

        }
    });
    return AudioItemModel;
});