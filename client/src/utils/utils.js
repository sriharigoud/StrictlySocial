const key = "jwt";
export const doLogin = (token) => {
    localStorage.setItem(key, token);
}

export const doLogout = () => {
    localStorage.removeItem(key);
}

export const isLogin = () => {
    if (localStorage.getItem(key)) {
        return true;
    }

    return false;
}