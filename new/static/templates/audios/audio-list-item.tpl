<%- title %>

<input type="hidden" value="<%- title %>" placeholder="edit title field"/>
<div>
    <label>
        duration: <%- duration %>
        <input type="text" name="duration-set" size="3"/>
    </label>
</div>


<div class="audios-list-item-controls">

    <button class="audios-list-item-control player-controller-control fa fa-play audios-list-item-play"></button>
    <button class="audios-list-item-control player-controller-control fa fa-stop audios-list-item-stop"></button>
    <button class="audios-list-item-control player-controller-control fa fa-repeat audios-list-item-repeat"></button>

</div>

<hr/>