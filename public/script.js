document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: username, password: password })
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Invalid username or password');
      }
    })
    .then(data => {
      if (data.user.role === 'admin') {
        showAdminView();
        fetchComplaints(username); // Call fetchComplaints here
      } else {
        showUserView();
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert(error.message);
    });
});

document.getElementById('complaint-form').addEventListener('submit', function(event) {
    event.preventDefault();

    let complaintType = document.getElementById('complaintType').value;
    let complaintDescription = document.getElementById('complaintDescription').value;
    let username = document.getElementById('username').value;

    fetch('/file-complaint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ complaintType: complaintType, description: complaintDescription, username: username })
    })
    .then(response => {
      if (response.ok) {
        alert('Complaint filed successfully');
        document.getElementById('complaintType').value = ''; // Clear the complaint type field
        document.getElementById('complaintDescription').value = ''; // Clear the complaint description field
        fetchComplaints(username); // Fetch complaints after filing
      } else {
        throw new Error('Failed to file complaint');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert(error.message);
    });
});

// Function to fetch complaints
function fetchComplaints(username) {
  fetch(`/complaints?username=${username}`)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to fetch complaints');
      }
    })
    .then(data => {
      let complaintsList = document.getElementById('complaints-list');
      complaintsList.innerHTML = '';

      if (data && data.complaints.length > 0) {
        data.complaints.forEach(complaint => {
          let listItem = document.createElement('li');
          listItem.textContent = `${complaint.complaintType}: ${complaint.description}`;
          complaintsList.appendChild(listItem);
        });
        document.getElementById('complaints-container').style.display = 'block';
      } else {
        complaintsList.textContent = 'No complaints found.';
        document.getElementById('complaints-container').style.display = 'block';
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert(error.message);
    });
}

// Function to show admin view
function showAdminView() {
  document.getElementById('login-container').style.display = 'none';
  document.getElementById('complaint-form-container').style.display = 'none';
  document.getElementById('complaints-container').style.display = 'block';
  document.getElementById('logout-button').style.display = 'block';
}

// Function to show user view
function showUserView() {
  document.getElementById('login-container').style.display = 'none';
  document.getElementById('complaint-form-container').style.display = 'block';
  document.getElementById('logout-button').style.display = 'block';

  // Register the logout button event listener
  document.getElementById('logout-button').addEventListener('click', function(event) {
    event.preventDefault();
    showLoginView();
  });
}

// Function to show login view
function showLoginView() {
  document.getElementById('login-container').style.display = 'block';
  document.getElementById('complaint-form-container').style.display = 'none';
  document.getElementById('complaints-container').style.display = 'none';
  document.getElementById('logout-button').style.display = 'none';

  // Clear the input fields of the login form
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
}
