const AppHeader = {
    template: `
         <nav class="navbar navbar-expand-md navbar-dark flex-md-row fixed-top bg-dark align-items-md-center align-items-start" style="border-bottom: 2px rgba(62,62,62,0.5) solid">
    <router-link :to="{name:'event.index'}" class="navbar-brand d-none d-md-block" href="">Event Booking Platform</router-link>
<!--    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse"-->
<!--            aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">-->
<!--        <span class="navbar-toggler-icon"></span>-->
<!--    </button>-->
<!--    <div class=" collapse navbar-collapse" id="navbarCollapse">-->
   
        <ul class="navbar-nav mr-md-auto">
            <li class="nav-item active">
                <router-link :to="{name:'event.index'}" class="nav-link" href="#">Home</router-link>
            </li>
<!--            <li class="nav-item">-->
<!--                <a class="nav-link" href="#">Tin tức</a>-->
<!--            </li>-->
<!--            <li class="nav-item">-->
<!--                <a class="nav-link" href="#">Về chúng tôi</a>-->
<!--            </li>-->
<!--            <li class="nav-item">-->
<!--                <a class="nav-link" href="#">Liên hệ</a>-->
<!--            </li>-->
        </ul>
        <ul v-if="store.isAuth()" class="navbar-nav">
            <li class="nav-item dropdown">
                <a class="nav-item nav-link dropdown-toggle mr-md-2" href="#" id="bd-versions"
                   data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Hi {{store.getAuth().fullName}}
                </a>
                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="bd-versions">
                    <router-link :to="{name:'history.list'}" class="dropdown-item">Registrations</router-link>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-item" @click="logout">Logout</div>
                </div>
            </li>
        </ul>
        
        <router-link v-else :to="{name:'user.login'}" class="btn btn-outline-primary text-light mr-4">Login</router-link>
    
<!--    </div>-->
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
                store.setToast({type: 'success', message: 'Logout success'})
                this.$router.push({name: 'user.login'}).catch();
            }).catch(() => {
                app.$emit('set.logout', true);
                store.removeAuth();
                store.setToast({type: 'success', message: 'Logout success'})
                this.$router.push({name: 'user.login'}).catch();
            })
        }
    },

    computed: {},


};


