<div class="audios-list-item-controls">

    <div class="audios-list-item-controls-first">
        <button class="audios-list-item-control player-controller-control fa fa-pause audios-list-item-control-pause <% if(!play){ %>display-none <% } %>"></button>
        <button class="audios-list-item-control player-controller-control fa fa-play audios-list-item-control-play <% if(play){ %>display-none <% } %>"></button>
    </div>


</div>

<div class="audios-list-item__title">
    <%- title %>
</div>

<div class="audios-list-item-controls-second">
    <% if(plus){ %>
    <button class="audios-list-item-control player-controller-control fa fa-plus audios-list-item-control-plus"></button>
    <% } %>
</div>


<div class="audios-list-item-progress progress <% if(!play){ %>display-none <% } %>">
    <div class="audios-list-item-progress-position progress-position" style="left:<%- playprogess %>%"></div>
    <div class="audios-list-item-progress-value progress-value" style="width:<%- loadprogess %>%"></div>
</div>