import api from './api';

export const userApi = {
  login : (loginForm) => api.post('user/login',
    { 'email' : loginForm.userEmail,
      'password' : loginForm.userPassword
     }
  ),
}