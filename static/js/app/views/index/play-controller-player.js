/**
 * Created by ed on 22.02.15.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/play-controller-player.tpl'
], function ($,
             _,
             Backbone,
             indexTpl) {

    var PlayControllerPlayer = Backbone.View.extend({

        initialize: function (options) {
            this.app.log('PlayControllerPlayer.initialize');

            this.nodes = {};
            this.parent = options.parent;
            this.parent.model.bind('change:aid', this.render, this);

        },

        render: function () {
            this.app.log('PlayControllerPlayer.render');

            var modelAudio = this.parent.model.getAudioModel(this.parent.model.get('aid'), this.parent.model.get('owner_id'));
            var modelController = this.parent.model;

            var data = _.extend({}, modelController.toJSON(), modelAudio.toJSON());

            this.el.innerHTML = _.template(indexTpl)(data);


            return this;
        }
    });

    return PlayControllerPlayer;
});