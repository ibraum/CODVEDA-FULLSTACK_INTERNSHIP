const PORT = 3000;
const hostname = "localhost";
const protocol = "http";

const usersDiv = document.getElementById('users');
const blurModals = document.getElementById('blur-modals');
const formModal = document.getElementById('form');
const userForm = document.getElementById('userForm');
const createUserButtons = document.querySelectorAll('.create-user');
const closeModalBtn = document.getElementById('closeModal');
const deleteModal = document.getElementById('confirm-delete-modal');
const confirmDeleteBtn = document.getElementById('confirmDelete');
const cancelDeleteBtn = document.getElementById('cancelDelete');

let users = [];
let editingUserId = null;
let pendingDeleteId = null;

function construct_url(id) {
  if (id == null) return `${protocol}://${hostname}:${PORT}`;
  return `${protocol}://${hostname}:${PORT}/${id}`;
}

async function getUsers() {
  try {
    const res = await fetch(construct_url());
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const result = await res.json();
    users = result.data || [];
    renderUsers();
  } catch (err) {
    console.error('getUsers error', err);
    usersDiv.innerHTML = '<tr><td colspan="8">Unable to load users</td></tr>';
  }
}

function renderUsers() {
  if (!users.length) {
    usersDiv.innerHTML = '<tr><td colspan="8">No users found</td></tr>';
    return;
  }

  let table = '';
  users.forEach(user => {
    table += `
      <tr>
        <td>${user.id}</td>
        <td>${user.lastname || ''}</td>
        <td>${user.firstname || ''}</td>
        <td>${user.username || ''}</td>
        <td>${user.email || ''}</td>
        <td>${user.age || ''}</td>
        <td>${user.field || ''}</td>
        <td>
          <div class="actions-icons">
            <i class="fa-solid fa-eye view-btn" data-id="${user.id}" style="color:#005eff;cursor:pointer" title="View"></i>
            <i class="fa-solid fa-pen-clip edit-btn" data-id="${user.id}" style="color:#ffc800;cursor:pointer" title="Edit"></i>
            <i class="fa-solid fa-trash-can delete-btn" data-id="${user.id}" style="color:#ca1616;cursor:pointer" title="Delete"></i>
          </div>
        </td>
      </tr>
    `;
  });

  usersDiv.innerHTML = table;
  attachActionListeners();
}

function attachActionListeners() {
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      const u = users.find(x => x.id === id);
      if (u) showViewModal(u);
    });
  });

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => openEditModal(Number(btn.dataset.id)));
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => showDeleteModal(Number(btn.dataset.id)));
  });
}

function toggleModal(show = null) {
  if (show == null) {
    blurModals.classList.toggle('show');
    formModal.classList.toggle('show');
  } else if (show) {
    blurModals.classList.add('show');
    formModal.classList.add('show');
  } else {
    blurModals.classList.remove('show');
    formModal.classList.remove('show');
  }
}

blurModals.addEventListener('click', () => {
  toggleModal(false);
  if (deleteModal) deleteModal.classList.remove('show');
  pendingDeleteId = null;
});

createUserButtons.forEach(btn => btn.addEventListener('click', () => openCreateModal()));
closeModalBtn.addEventListener('click', () => toggleModal(false));

function openCreateModal() {
  editingUserId = null;
  userForm.reset();
  toggleModal(true);
}

function openEditModal(id) {
  const u = users.find(x => x.id === id);
  if (!u) return showMessage('User not found');
  editingUserId = id;
  userForm.firstname.value = u.firstname || '';
  userForm.lastname.value = u.lastname || '';
  userForm.username.value = u.username || '';
  userForm.email.value = u.email || '';
  userForm.age.value = u.age || '';
  userForm.field.value = u.field || '';
  userForm.role.value = u.role || '';
  userForm.isActive.value = u.isActive === false ? 'false' : 'true';
  toggleModal(true);
}

userForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(userForm);
  const payload = {
    firstname: formData.get('firstname'),
    lastname: formData.get('lastname'),
    username: formData.get('username'),
    email: formData.get('email'),
    age: Number(formData.get('age')) || null,
    field: formData.get('field'),
    role: formData.get('role') || null,
    isActive: formData.get('isActive') === 'true',
  };

  try {
    if (editingUserId == null) {
      const maxId = users.reduce((m, u) => Math.max(m, Number(u.id) || 0), 0);
      payload.id = maxId + 1;
      const res = await fetch(construct_url(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Create failed: ${res.status}`);
    } else {
      const res = await fetch(construct_url(editingUserId), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Update failed: ${res.status}`);
    }

    toggleModal(false);
    await getUsers();
  } catch (err) {
    console.error(err);
    showMessage('An error occured. See console.');
  }
});

async function deleteUser(id) {
  try {
    const res = await fetch(construct_url(id), { method: 'DELETE' });
    if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
    await getUsers();
  } catch (err) {
    console.error(err);
    showMessage('Delete failed');
  }
}

function showDeleteModal(id) {
  toggleModal(false);
  pendingDeleteId = id;
  if (deleteModal) deleteModal.classList.add('show');
  if (blurModals) blurModals.classList.add('show');
}

if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', () => {
  if (deleteModal) deleteModal.classList.remove('show');
  if (blurModals) blurModals.classList.remove('show');
  pendingDeleteId = null;
});

if (confirmDeleteBtn) confirmDeleteBtn.addEventListener('click', async () => {
  if (!pendingDeleteId) return;
  try {
    const res = await fetch(construct_url(pendingDeleteId), { method: 'DELETE' });
    if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
    if (deleteModal) deleteModal.classList.remove('show');
    if (blurModals) blurModals.classList.remove('show');
    pendingDeleteId = null;
    await getUsers();
  } catch (err) {
    console.error(err);
    showMessage('Delete failed');
  }
});

function showViewModal(user) {
  const viewModal = document.getElementById('view-user-modal');
  const viewContent = document.getElementById('viewUserContent');
  if (!viewModal || !viewContent) return;
  viewContent.textContent = JSON.stringify(user, null, 2);
  viewModal.classList.add('show');
  blurModals.classList.add('show');
}

const closeViewBtn = document.getElementById('closeView');
if (closeViewBtn) closeViewBtn.addEventListener('click', () => {
  const viewModal = document.getElementById('view-user-modal');
  if (viewModal) viewModal.classList.remove('show');
  if (blurModals) blurModals.classList.remove('show');
});

function showMessage(text, timeout = 3000) {
  const msg = document.getElementById('message');
  if (!msg) return;
  msg.textContent = text;
  msg.style.display = 'block';
  setTimeout(() => { msg.style.display = 'none'; }, timeout);
}

getUsers();