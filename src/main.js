import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

export function togglePassword() {
    const pwd = document.getElementById('password');
    const type = pwd.type === 'password' ? 'text' : 'password';
    pwd.type = type;
}

(function() {
  'use strict';
  const form = document.getElementById('login-form');
  form.addEventListener('submit', event => {
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    }
    form.classList.add('was-validated');
  }, false);
})();


