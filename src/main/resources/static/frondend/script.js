document.getElementById('registrationForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const userData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    const messageElement = document.getElementById('message');

    try {
        const response = await fetch('http://localhost:8081/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            messageElement.style.color = 'green';
            messageElement.innerText = 'Registration successful!';
            document.getElementById('registrationForm').reset();
        } else {
            messageElement.style.color = 'red';
            messageElement.innerText = 'Registration failed. Please try again.';
        }
    } catch (error) {
        console.error('Error:', error);
        messageElement.style.color = 'red';
        messageElement.innerText = 'Error connecting to server.';
    }
});
