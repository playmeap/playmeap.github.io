<div class="audios-list-item-controls">

    <button class="audios-list-item-control player-controller-control fa fa-pause audios-list-item-control-pause <% if(!play){ %>display-none <% } %>"></button>
    <button class="audios-list-item-control player-controller-control fa fa-play audios-list-item-control-play <% if(play){ %>display-none <% } %>"></button>

</div>

<div class="audios-list-item__title">
    <%- title %>
</div>


<div class="audios-list-item-progress progress <% if(!play){ %>display-none <% } %>">
    <div class="audios-list-item-progress-position progress-position"></div>
    <div class="audios-list-item-progress-value progress-value"></div>
</div>