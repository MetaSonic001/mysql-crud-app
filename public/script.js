const API_URL = 'http://localhost:3000/users';
let editingUserId = null;

// Fetch all users
async function fetchUsers() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch users');
        const users = await response.json();
        displayUsers(users);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch users');
    }
}

// Display users
function displayUsers(users) {
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';

    users.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        userCard.innerHTML = `
            <div class="user-info">
                <strong>${user.name}</strong> (${user.age} years)
                <br>
                <small>${user.email}</small>
            </div>
            <div class="user-actions">
                <button class="edit-btn" onclick="editUser(${user.id})">Edit</button>
                <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
            </div>
        `;
        userList.appendChild(userCard);
    });
}

// Handle form submission for creating new user
async function handleSubmit(event) {
    event.preventDefault();
    
    const userData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        age: parseInt(document.getElementById('age').value)
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) throw new Error('Failed to create user');

        document.getElementById('userForm').reset();
        fetchUsers();
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to create user');
    }
}

// Edit user
async function editUser(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error('Failed to fetch user');
        
        const user = await response.json();
        editingUserId = id;
        
        document.getElementById('edit-name').value = user.name;
        document.getElementById('edit-email').value = user.email;
        document.getElementById('edit-age').value = user.age;
        
        document.getElementById('edit-form').style.display = 'block';
        document.getElementById('create-form').style.display = 'none';
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch user for editing');
    }
}

// Handle update
async function handleUpdate(event) {
    event.preventDefault();
    
    const userData = {
        name: document.getElementById('edit-name').value,
        email: document.getElementById('edit-email').value,
        age: parseInt(document.getElementById('edit-age').value)
    };

    try {
        const response = await fetch(`${API_URL}/${editingUserId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) throw new Error('Failed to update user');

        cancelEdit();
        fetchUsers();
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to update user');
    }
}

// Delete user
async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete user');

        fetchUsers();
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete user');
    }
}

// Cancel edit mode
function cancelEdit() {
    editingUserId = null;
    document.getElementById('edit-form').style.display = 'none';
    document.getElementById('create-form').style.display = 'block';
    document.getElementById('editForm').reset();
}

// Initial load
document.addEventListener('DOMContentLoaded', fetchUsers);