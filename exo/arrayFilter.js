function filter() {
    const array = getArray();
    console.log(array)

    const filter = getFilter();
    console.log(filter)

    document.getElementById('filtredArray').innerHTML = "";
    for (let i = 0; i < array.length; i++) {
        if (array[i].email.includes(filter)) {
            document.getElementById('filtredArray').innerHTML += `<tr>
                <td>${array[i].email}</td>
                <td>${array[i].password}</td>
            </tr>`;
        }
    }
}

function getArray() {
    const array = [];
    for (let i = 1; i < 5; i++) {
        array.push({ "email": document.getElementById('email'+i).value, "password": document.getElementById('password'+i).value })
    }
    return array;
}

function getFilter() {
    return document.getElementById('filter').value;
}