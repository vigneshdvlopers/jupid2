import Cookies from 'js-cookie';

const TOKEN_KEY = 'jupid_token';

export const saveToken = (token: string) => {
  Cookies.set(TOKEN_KEY, token, { 
    expires: 7, 
    path: '/',
    sameSite: 'lax'
  });
};


export const getToken = () => {
  return Cookies.get(TOKEN_KEY);
};

export const removeToken = () => {
  Cookies.remove(TOKEN_KEY);
};

export const isLoggedIn = () => {
  return !!getToken();
};

export const getUser = () => {
  const token = getToken();
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent((typeof window !== 'undefined' ? atob(base64) : Buffer.from(base64, 'base64').toString('binary')).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};
