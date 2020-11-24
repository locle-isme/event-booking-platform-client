const UserLogin = {
    template: `<div class="card">
    <div class="card-body">
        <form>
                        
            <div class="form-group">
                <label for="inputUsername">Username</label>
                <input v-model="form.username" type="text" class="form-control" id="inputUsername"
                       placeholder="Username">
            </div>


            <div class="form-group">
                <label for="inputPassword">Password</label>
                <input v-model="form.password" type="password" class="form-control" id="inputPassword"
                       placeholder="Password">
            </div>
            <button type="submit" class="btn btn-primary" @click.prevent="login">Login</button>
            <div class="no-account">Don't have account?&nbsp;<router-link :to="{name:'user.register'}" class="register">
                Sign up!
            </router-link>
            </div>

        </form>
    </div>
</div>
    
    `,
    data() {
        return {
            form: {
                username: '',
                password: ''
            },
        }
    },

    props: {},
    mounted() {
        //console.log(this.$route);
    },
    methods: {
        /**
         * login user
         */
        login() {
            API.post('/login', this.form)
                .then(({data}) => {
                    //console.log(data);
                    store.setToast({type: 'success', message: 'Login success'});
                    app.$emit('set.logout', false);
                    store.setAuth(data);
                    this.$router.go(-1);
                })
                .catch(error => {
                    store.setToast({type: 'danger', message: 'Username or password not correct'});
                })
        }
    },

    computed: {}
}