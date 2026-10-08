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

// User ගේ email එක Browser එකේ localStorage එකේ තාවකාලිකව save කර ගැනීම
            const emailInput = document.getElementById('email').value;
            localStorage.setItem('loggedInUser', emailInput);

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        }

        else {
            messageElement.style.color = 'red';
            messageElement.innerText = 'Invalid email or password.';
        }
    } catch (error) {
        console.error('Error:', error);
        messageElement.style.color = 'red';
        messageElement.innerText = 'Error connecting to server.';
    }
});

