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
    prevAdd.removeEventListener('click', addPerson);
    prevAdd.addEventListener('click', removePerson);
    //reset event listener
    var rows = root.getElementsByTagName('tr');
    const newAdd = rows[rows.length - 1].querySelector('[name=add]');
    newAdd.addEventListener('click', addPerson);
}

function removePerson(event) {
    event.target.parentNode.parentNode.remove();
    event.preventDefault();
    var root = document.getElementById('reservationTable').getElementsByTagName('tbody')[0];
    var rows = root.getElementsByTagName('tr');
    var clone = rows[rows.length - 1].cloneNode(true);
    const prevAdd = rows[rows.length - 1].querySelector('[name=add]');
    var num = parseInt( prevAdd.id.match(/\d+/g), 10) ;
    clone = fixProps(clone, num + 1);
};

function fixProps(elem, cntr) {
    elem.id = elem.id.replace(/\d+$/, cntr);
    elem.querySelectorAll('td>[id]').forEach((e) => {
        e.id = e.id.replace(/\d+$/, cntr);
    })
    return elem;
};

function reset() {
    var rows = root.getElementsByTagName('tr');
    rows[rows.length - 1].forEach((row, index) => {
        if (index === 0) return;
        row.remove();
    });
}

var nodes = document.querySelectorAll('button[name="add"]');
const add = nodes[nodes.length- 1];
add.addEventListener('click', addPerson);

const resetEl = document.querySelectorAll('input[type="reset"]');
resetEl.addEventListener('click', reset);
