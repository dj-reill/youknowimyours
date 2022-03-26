export function addPerson() {
    var $tr = $('tr[id^="person"]:last');

    // Read the Number from that DIV's ID (i.e: 3 from "klon3")
    // And increment that number by 1
    var num = parseInt( $tr.prop("id").match(/\d+/g), 10 )+1;
    // disable previous button
    var $button = $($tr).find('button[name="addRemove"]:not(:disabled)').prop('disabled', true);
    $tr.clone(true).prop('id', 'person'+ num )
        .insertAfter('#reservationTable tbody>tr:nth-last-child(2)');
    fixProps($('tr[id^="person"]:last'), 'id', num);
    fixProps($('tr[id^="person"]:last'), 'for', num);
    return false;
};

function fixProps(elem, prop, cntr) {
    $(elem).find(`[${prop}]`).add(elem).each(function() {
        this[`"${prop}"`] =  this[`"${prop}"`].replace(/\d+$/, "") + cntr;
    })
}