const PORT = 3000;
const hostname = "localhost";
const protocol = "http";

let usersDiv = document.getElementById('users');
const blurModals = document.getElementById('blur-modals');
const form = document.getElementById('form');
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

  const users = result;
  let table = "";

  users.data.forEach(user => {
    table += `
      <tr>
        <td>${user.id}</td>
        <td>${user.lastname}</td>
        <td>${user.firstname}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.age}</td>
        <td>${user.field}</td>
      </tr>
    `;
  });

  usersDiv.innerHTML = table;
}


getUsers()

function toggleModal () {

}

blurModals.addEventListener('click', function () {
    blurModals.classList.toggle('show');
    form.classList.toggle('show');
});
