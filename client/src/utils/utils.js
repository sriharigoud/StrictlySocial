import axios from "axios";

const key = "user";

export const doLogin = (user) => {
    axios.defaults.headers.common["x-auth-token"] = user.token;
    localStorage.setItem(key, JSON.stringify(user));
}

export const doLogout = () => {
    localStorage.removeItem(key);
    delete axios.defaults.headers.common["x-auth-token"];
}

export const getUser = () => {
    if (localStorage.getItem(key)) {
        return JSON.parse(localStorage.getItem(key));
    }
    return {}
}

export const isLogin = () => {
    if (localStorage.getItem(key)) {
        return true;
    }

    return false;
}