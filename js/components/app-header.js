const AppHeader = {
    template: `
         <nav class="bg-dark text-light d-flex justify-content-between align-items-center py-2 px-3 shadow-lg fixed-top" style="border-bottom: 2px rgba(62,62,62,0.5) solid">
        <router-link :to="{name:'event.index'}" class="logo">Event Booking Platform</router-link>
        <div v-if="store.isAuth()">
             <span class="mx-2">{{store.getAuth().fullName}}</span>
            <button class="btn btn-outline-danger" @click="logout">Logout</button>
        </div>
        <div v-else><router-link :to="{name:'user.login'}" class="btn btn-outline-primary">Login</router-link></div>
    </nav>

`,
    data() {
        return {}
    },

    props: {},

    methods: {
        /**
         * Logout user
         */
        logout() {
            API.post(`/logout?token=${store.getAuth().token}`).then(() => {
                app.$emit('set.logout', true);
                store.removeAuth();
                store.setToast({type:'success', message:'Logout success'})
                this.$router.push({name: 'user.login'}).catch();

            })
        }
    },

    computed: {}
}