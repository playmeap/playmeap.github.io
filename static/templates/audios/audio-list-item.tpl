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
    <% } else { %>
    <button class="audios-list-item-control player-controller-control fa fa-minus audios-list-item-control-minus"></button>

    <div class="audios-list-item-controls-second-remove display-none">
        <button class="audios-list-item-control player-controller-control audios-list-item-control-remove">Удалить</button>
        <button class="audios-list-item-control player-controller-control audios-list-item-control-remove-cancel">Отмена</button>
    </div>
    <% } %>
</div>


<div class="audios-list-item-progress progress <% if(!play){ %>display-none <% } %>">
    <div class="audios-list-item-progress-position progress-position" style="left:<%- playprogess %>%"></div>
    <div class="audios-list-item-progress-value progress-value" style="width:<%- loadprogess %>%"></div>
</div>