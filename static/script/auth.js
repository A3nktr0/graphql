export class LoginForm {
    constructor() {
        this.token = null;
        this.form = document.getElementById('loginForm')
        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.login();
        });
    }

    getData() {
        const { credentials, password } = this.form;

        this.user = {
            credentials: credentials.value,
            password: password.value
        }
    }

    async login() {
        this.getData();
        try {
            const response = await fetch('https://zone01normandie.org/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${btoa(`${this.user.credentials}:${this.user.password}`)}`
                },
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data);
                window.location.reload();
            } else {
                this._throwError('Invalid credentials.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    _throwError(error) {
        const errorContainer = document.getElementById('error-msg');
        const errMsg = document.createElement('p');
        errMsg.textContent = error;
        errorContainer.appendChild(errMsg);
        console.error('Error:', error);
    }
}