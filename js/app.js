Vue.filter('date', (d) => {
    return new Date(d).toLocaleDateString('en-US',
        {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
})

Vue.filter('date_time', (d) => {
    return new Date(d).toLocaleTimeString('en-US',
        {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
})

Vue.filter('error', (errors) => {
    return `${errors[0]}`;
})


const app = new Vue({
    router,
    data() {
        return {
            store,
            isLogout: false
        }
    },

    created() {
        store.setToast({type: 'primary', message: 'Welcome to Event Booking Platform'});
        this.$on('set.logout', this.setLogout);
    },

    mounted() {
        window.onpopstate = (event) => { //check change on the window
            if (this.isLogout) {
                this.$router.go(1);
            }
        }
    },

    methods: {
        /**
         * set type logout status
         * @param type
         */
        setLogout(type) {
            this.isLogout = type;
        },
    },

    components: {
        AppHeader
    },

    watch: {
        $route: {
            immediate: true,
            handler(to, from) {
                document.title = to.meta.title || 'Event Booking Platform';
            }
        }
    }

}).$mount("#app")

Vue.config.devtools = true;