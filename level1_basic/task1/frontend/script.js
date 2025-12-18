const PORT = 3000;
const hostname = "localhost";
const protocol = "http";

let usersDiv = document.getElementById('users');
let users = [];

function construct_url (id) {
    if (id < 0) return;
    if (id == null) {
        return `${protocol}://${hostname}:${PORT}`;
    }
    return `${protocol}://${hostname}:${PORT}/${id}`;
}

async function getUsers () {
    const res = await fetch(construct_url());
    const result = await res.json();
    console.log(result);
    users = result
    //usersDiv.innerText = JSON.stringify(users)
}

getUsers()