function addPerson() {
    var root = document.getElementById('reservationTable').getElementsByTagName('tbody')[0];
    var rows = root.getElementsByTagName('tr');
    var clone = rows[rows.length - 1].cloneNode(true);
    const prevAdd = document.querySelector('[name=add]');
    root.appendChild(clone);
    // fix previous row / buttons
    prevAdd.name = 'remove';
    prevAdd.id = prevAdd.id.replace('add', 'remove');
    prevAdd.textContent = '-';
    prevAdd.removeEventListener('click', addPerson);
    prevAdd.addEventListener('click', removePerson);
    //reset event listener
    const newAdd = document.querySelector('[name=add]');
    newAdd.addEventListener('click', addPerson);
    renumberRows()
}

function removePerson(event) {
    event.target.parentNode.parentNode.remove();
    event.preventDefault();
    renumberRows()
};

function renumberRows() {
    var root = document.getElementById('reservationTable').getElementsByTagName('tbody')[0];
    var rows = root.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
        fixProps(rows[i], i + 1);
    }
}

function fixProps(elem, cntr) {
    elem.id = elem.id.replace(/\d+$/, cntr);
    elem.querySelectorAll('td>[id]').forEach((e) => {
        e.id = e.id.replace(/\d+$/, cntr);
    })
    return elem;
};

function resetTable() {
    var root = document.getElementById('reservationTable').getElementsByTagName('tbody')[0];
    var rows = root.getElementsByTagName('tr');
    for (let i = rows.length-1; i >= 0; i--) {
        if (i === 0) {
            for (const td in rows[i].querySelectorAll('td')) {
                td.textContent = '';
            }
        } else {
            const button = rows[i].querySelector('button');
            button.removeEventListener('click', addPerson);
            rows[i].remove();
        }
    };
    // reset row
    const button = rows[0].querySelector('button');
    button.removeEventListener('click', removePerson);
    button.textContent = '+';
    button.name = 'add';
    button.id = button.id.replace('remove', 'add');
    button.addEventListener('click', addPerson);
}

var nodes = document.querySelectorAll('button[name="add"]');
const add = nodes[nodes.length- 1];
add.addEventListener('click', addPerson);

const resetEl = document.querySelector('input[type="reset"]');
resetEl.addEventListener('click', resetTable);
