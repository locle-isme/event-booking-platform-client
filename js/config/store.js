const FULL_NAME = 'store_name';
const TOKEN = 'store_token';

const store = {

    /**
     * authorization data
     */

    auth: {
        FULL_NAME: localStorage.getItem(FULL_NAME) || null,
        token: localStorage.getItem(TOKEN) || null,
    },

    /**
     * Message data
     */
    toast: {
        message: null,
        type: null,
        timer: null
    },

    /**
     * check auth available
     * @returns {boolean}
     */
    isAuth() {
        const {auth} = this;
        return !!(auth.fullName && auth.token);
    },

    /**
     *
     * @param lastname
     * @param firstname
     * @param token
     */
    setAuth({lastname, firstname, token}) {
        const {auth} = this;
        const FULL_NAME =`${lastname}  ${firstname}`;
        auth.FULL_NAME = firstname;
        auth.token = token;
        localStorage.setItem(FULL_NAME, firstname);
        localStorage.setItem(TOKEN, token);
    },

    /**
     * get Auth data
     * @returns {*}
     */
    getAuth() {
        return (this.isAuth()) ? this.auth : {};
    },

    /**
     * remove Auth data
     */
    removeAuth() {
        const {auth} = this;
        auth.FULL_NAME = null;
        auth.token = null;
        localStorage.removeItem(FULL_NAME);
        localStorage.removeItem(TOKEN);
    },

    /**
     * Set toast message
     * @param type
     * @param message
     */
    setToast({type, message}) {
        const {toast} = this;
        toast.type = type;
        toast.message = message;
        clearTimeout(toast.timer);
        toast.timer = setTimeout(() => {
            toast.type = null;
            toast.message = null;
        }, 3000)
    },

    /**
     * get toast message
     * @returns {store.toast}
     */
    getToast() {
        const {toast} = this;
        return toast;
    }
}