document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const loginData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    const messageElement = document.getElementById('message');

    try {
        const response = await fetch('http://localhost:8081/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        if (response.ok) {
            messageElement.style.color = 'green';
            messageElement.innerText = 'Login successful!';
            document.getElementById('loginForm').reset();

// සාර්ථක වුණාට පස්සේ වෙනත් පිටුවකට (Dashboard) redirect කිරීමට අවශ්‍ය නම්:
// window.location.href = 'dashboard.html';
        } else {
            messageElement.style.color = 'red';
            messageElement.innerText = 'Invalid email or password.';
        }
    } catch (error) {
        console.error('Error:', error);
        messageElement.style.color = 'red';
        messageElement.innerText = 'Error connecting to server.';
    }
});

