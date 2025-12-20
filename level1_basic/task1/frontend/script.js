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
const modalTitle = document.getElementById('modalTitle');
const submitBtn = document.getElementById('submitBtn');

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
    const badgeStyle = user.isActive 
      ? 'background-color: #16a34a33; color: #0bbd4cff;'
      : 'background-color: #ef444441; color: #ef4444ff;';
    const badgeText = user.isActive ? 'Yes' : 'No';
    
    table += `
      <tr>
        <td>${user.id}</td>
        <td>${user.lastname || ''}</td>
        <td>${user.firstname || ''}</td>
        <td>${user.username || ''}</td>
        <td><span style="display: inline-block; padding: 2px 12px; border-radius: 8px; font-size: 10px; font-weight: 600; ${badgeStyle}">${badgeText}</span></td>
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
  const viewModal = document.getElementById('view-user-modal');
  if (viewModal) viewModal.classList.remove('show');
  pendingDeleteId = null;
});

createUserButtons.forEach(btn => btn.addEventListener('click', () => openCreateModal()));
closeModalBtn.addEventListener('click', () => toggleModal(false));

function openCreateModal() {
  editingUserId = null;
  userForm.reset();
  modalTitle.textContent = 'Create User';
  submitBtn.textContent = 'Create';
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
  userForm.isActive.value = u.isActive === false ? 'false' : 'true';
  modalTitle.textContent = 'Edit User';
  submitBtn.textContent = 'Update';
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
    if (editingUserId) {
      showToast('User updated successfully', 'success');
    } else {
      showToast('User created successfully', 'success');
    }
  } catch (err) {
    console.error(err);
    showToast('An error occurred. See console.', 'error');
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
    showToast('User deleted successfully', 'success');
  } catch (err) {
    console.error(err);
    showToast('Delete failed', 'error');
  }
});

function showViewModal(user) {
  const viewModal = document.getElementById('view-user-modal');
  const viewContent = document.getElementById('viewUserContent');
  if (!viewModal || !viewContent) return;
  
  const badgeStyle = user.isActive 
    ? 'background-color: #16a34a; color: white;'
    : 'background-color: #ef4444; color: white;';
  
  const badgeText = user.isActive ? 'Yes' : 'No';
  
  const displayText = `
    <div style="display: grid; gap: 12px;">
      <div style="display: grid; grid-template-columns: 120px 1fr; gap: 16px; align-items: center;">
        <strong>ID:</strong>
        <span>${user.id}</span>
      </div>
      <div style="display: grid; grid-template-columns: 120px 1fr; gap: 16px; align-items: center;">
        <strong>First Name:</strong>
        <span>${user.firstname || 'N/A'}</span>
      </div>
      <div style="display: grid; grid-template-columns: 120px 1fr; gap: 16px; align-items: center;">
        <strong>Last Name:</strong>
        <span>${user.lastname || 'N/A'}</span>
      </div>
      <div style="display: grid; grid-template-columns: 120px 1fr; gap: 16px; align-items: center;">
        <strong>Username:</strong>
        <span>${user.username || 'N/A'}</span>
      </div>
      <div style="display: grid; grid-template-columns: 120px 1fr; gap: 16px; align-items: center;">
        <strong>Email:</strong>
        <span>${user.email || 'N/A'}</span>
      </div>
      <div style="display: grid; grid-template-columns: 120px 1fr; gap: 16px; align-items: center;">
        <strong>Age:</strong>
        <span>${user.age || 'N/A'}</span>
      </div>
      <div style="display: grid; grid-template-columns: 120px 1fr; gap: 16px; align-items: center;">
        <strong>Field:</strong>
        <span>${user.field || 'N/A'}</span>
      </div>
      <div style="display: grid; grid-template-columns: 120px 1fr; gap: 16px; align-items: center;">
        <strong>Active:</strong>
        <span style="display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 600; ${badgeStyle}">${badgeText}</span>
      </div>
    </div>
  `.trim();
  
  viewContent.innerHTML = displayText;
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

function showToast(message, type = 'default', duration = 3000) {
  const toastContainer = document.getElementById('toast-container');
  const toast = document.createElement('div');
  
  let bgColor = '#1e293b';
  let textColor = '#e2e8f0';
  let borderColor = '#334155';
  let icon = 'ℹ';
  
  if (type === 'success') {
    bgColor = '#16a34a';
    borderColor = '#22c55e';
    icon = '✓';
  } else if (type === 'error') {
    bgColor = '#dc2626';
    borderColor = '#ef4444';
    icon = '✕';
  } else if (type === 'warning') {
    bgColor = '#f59e0b';
    borderColor = '#fbbf24';
    icon = '⚠';
  }
  
  toast.style.cssText = `
    background-color: ${bgColor};
    border: 1px solid ${borderColor};
    color: ${textColor};
    padding: 12px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-family: 'Poppins', sans-serif;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    animation: slideIn 0.3s ease-out;
  `;
  
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideOut {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }
`;
document.head.appendChild(style);

getUsers();