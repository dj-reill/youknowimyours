function addPerson() {
    var root = document.getElementById('reservationTable').getElementsByTagName('tbody')[0];
    var rows = root.getElementsByTagName('tr');
    var clone = rows[rows.length - 1].cloneNode(true);
    const prevAdd = rows[rows.length - 1].querySelector('[name=add]');
    var num = parseInt( prevAdd.id.match(/\d+/g), 10) ;
    clone = fixProps(clone, num + 1);
    root.appendChild(clone);
    // fix previous row / buttons
    prevAdd.name = 'remove';
    prevAdd.id = `removePerson.${num}`
    prevAdd.textContent = '-';
    prevAdd.addEventListener('click', removePerson(prevAdd));
}

function removePerson($row) {
    try {
        var table = document.getElementById(reservationTable);
        var rowCount = table.rows.length;
        for (var i = 0; i < rowCount; i++) {
            var row = table.rows[i];
            /*var chkbox = row.cells[0].childNodes[0];*/
            /*if (null != chkbox && true == chkbox.checked)*/

            if (row==$row) {
                if (rowCount <= 1) {
                    alert("Cannot delete all the rows.");
                    break;
                }
                table.deleteRow(i);
                rowCount--;
                i--;
            }
        }
    } catch (e) {
        alert(e);
    }
    //getValues();
};

function fixProps(elem, cntr) {
    elem.id = elem.id.replace(/\d+$/, cntr);
    elem.querySelectorAll('td>[id]').forEach((e) => {
        e.id = e.id.replace(/\d+$/, cntr);
    })
    return elem;
};

var nodes = document.querySelectorAll('button[name="add"]');
const add = nodes[nodes.length- 1];
add.addEventListener('click', addPerson);