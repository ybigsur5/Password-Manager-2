<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Manager</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f4;
        }
        h2 {
            color: #333;
        }
        .container {
            max-width: 400px;
            margin: auto;
            padding: 20px;
            background: white;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        input[type="text"], input[type="password"] {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
        button {
            width: 100%;
            padding: 10px;
            background-color: #5cb85c;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        button:hover {
            background-color: #4cae4c;
        }
        .message {
            color: red;
            margin: 10px 0;
        }
        .platform-form {
            display: none;
            margin-top: 20px;
        }
        .platform-input {
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Password Manager</h2>
        <div id="form-container">
            <h3 id="form-title">Register</h3>
            <input type="text" id="username" placeholder="Username" required>
            <input type="password" id="password" placeholder="Password" required>
            <button id="submit-btn">Register</button>
            <div class="message" id="message"></div>
            <p id="toggle-form">Already have an account? Login</p>
        </div>

        <div id="platform-container" class="platform-form">
            <h3>Manage Passwords</h3>
            <input type="text" id="platform" class="platform-input" placeholder="Platform (e.g., LinkedIn)" required>
            <input type="password" id="platform-password" class="platform-input" placeholder="Password" required>
            <button id="add-password-btn">Add Password</button>
            <button id="generate-password-btn">Generate Random Password</button>
            <div class="message" id="platform-message"></div>
            <h4>Your Passwords:</h4>
            <ul id="password-list"></ul>
        </div>
    </div>

    <script>
        const formContainer = document.getElementById('form-container');
        const platformContainer = document.getElementById('platform-container');
        const formTitle = document.getElementById('form-title');
        const submitBtn = document.getElementById('submit-btn');
        const messageDiv = document.getElementById('message');
        const toggleForm = document.getElementById('toggle-form');
        const addPasswordBtn = document.getElementById('add-password-btn');
        const generatePasswordBtn = document.getElementById('generate-password-btn');
        const platformInput = document.getElementById('platform');
        const platformPasswordInput = document.getElementById('platform-password');
        const platformMessageDiv = document.getElementById('platform-message');
        const passwordList = document.getElementById('password-list');

        let isLoginMode = false;
        let currentUser = null;

        toggleForm.addEventListener('click', () => {
            isLoginMode = !isLoginMode;
            formTitle.textContent = isLoginMode ? 'Login' : 'Register';
            submitBtn.textContent = isLoginMode ? 'Login' : 'Register';
            toggleForm.textContent = isLoginMode ? 'Don\'t have an account? Register' : 'Already have an account? Login';
            messageDiv.textContent = '';
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            platformContainer.style.display = 'none'; // Hide platform form
        });

        submitBtn.addEventListener('click', () => {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (isLoginMode) {
                // Login logic
                const storedPassword = localStorage.getItem(username);
                if (storedPassword && storedPassword === password) {
                    messageDiv.textContent = 'Login successful!';
                    currentUser = username;
                    platformContainer.style.display = 'block'; // Show platform form
                    loadUserPasswords();
                } else {
                    messageDiv.textContent = 'Invalid username or password!';
                }
            } else {
                // Registration logic
                if (localStorage.getItem(username)) {
                    messageDiv.textContent = 'Username already exists!';
                } else {
                    localStorage.setItem(username, password);
                    messageDiv.textContent = 'Registration successful! You can now login.';
                }
            }
        });

        addPasswordBtn.addEventListener('click', () => {
            const platform = platformInput.value;
            const password = platformPasswordInput.value;

            if (currentUser) {
                const userPasswords = JSON.parse(localStorage.getItem(currentUser + '-passwords')) || {};
                userPasswords[platform] = password;
                localStorage.setItem(currentUser + '-passwords', JSON.stringify(userPasswords));
                platformMessageDiv.textContent = 'Password added for ' + platform;
                loadUserPasswords();
                platformInput.value = '';
                platformPasswordInput.value = '';
            } else {
                platformMessageDiv.textContent = 'Please log in first.';
            }
        });

        generatePasswordBtn.addEventListener('click', () => {
            const randomPassword = generateRandomPassword(12); // Generate a password of length 12
            platformPasswordInput.value = randomPassword;
            platformMessageDiv.textContent = 'Random password generated!';
        });

        function generateRandomPassword(length) {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
            let password = '';
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * chars.length);
                password += chars[randomIndex];
            }
            return password;
        }

        function loadUserPasswords() {
            passwordList.innerHTML = ''; // Clear the list
            const userPasswords = JSON.parse(localStorage.getItem(currentUser + '-passwords')) || {};
            for (const platform in userPasswords) {
                const li = document.createElement('li');
                li.textContent = `${platform}: ${userPasswords[platform]}`;
                passwordList.appendChild(li);
            }
        }
    </script>
</body>
</html>