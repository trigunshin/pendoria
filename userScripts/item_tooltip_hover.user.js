// ==UserScript==
// @name Pendoria Tooltip Hover
// @namespace https://github.com/trigunshin/pendoria
// @description Add tooltip on hover to Pendoria Items.
// @homepage https://trigunshin.github.com/pendoria
// @version 1
// @downloadURL https://trigunshin.github.io/pendoria/userScripts/item_tooltip_hover.user.js
// @updateURL https://trigunshin.github.io/pendoria/userScripts/item_tooltip_hover.user.js
// @include https://pendoria.net/game
// ==/UserScript==

$(document).on('mouseover', 'a[data-item-id]', function (event) {
    event.stopPropagation();
    var display_item = $('.display-item');
    var display_left = $(this).offset().left;
    var display_top = $(this).offset().top;

    ajaxPost("/inventory/equipment/preview/"+$(this).data("item-id"), function(data) {
        display_item.html(data);

        display_item.css({
            width: 'auto',
            left: display_left + 'px',
            top: display_top - $('.display-item').height() - 40 + 'px'
        }).show();
    });
});
