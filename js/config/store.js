const FULLNAME = '10_fullname';
const TOKEN = '10_token';

const store = {

    /**
     * authorization data
     */

    auth: {
        fullName: localStorage.getItem(FULLNAME) || null,
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
        return (auth.fullName && auth.token) ? true : false;
    },

    /**
     *
     * @param lastname
     * @param firstname
     * @param token
     */
    setAuth({lastname, firstname, token}) {
        const {auth} = this;
        const fullName =`${lastname}  ${firstname}`;
        auth.fullName = fullName;
        auth.token = token;
        localStorage.setItem(FULLNAME, fullName);
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
        auth.fullName = null;
        auth.token = null;
        localStorage.removeItem(FULLNAME);
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