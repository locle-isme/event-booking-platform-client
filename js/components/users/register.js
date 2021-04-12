const UserRegister = {
    template: `<div class="col-md-6 ml-auto mr-auto">
    <div class="card">
        <div class="card-body">
            <form>
                <div class="form-row">
                    <div class="form-group col-md-6">
                        <label for="inputLastName">Lastname</label>
                        <input v-model="form.lastname"
                               :class="{'is-invalid': arrayError.lastname, 'form-control': true}"
                               type="text" id="inputLastName" placeholder="Enter lastname">
                        <div v-if="arrayError.lastname" class="invalid-feedback"> {{arrayError.lastname | error}}.</div>
                    </div>
                    <div class="form-group col-md-6">
                        <label for="inputFirstName">Firstname</label>
                        <input v-model="form.firstname" type="text"
                               :class="{'is-invalid': arrayError.firstname, 'form-control': true}" id="inputFirstName"
                               placeholder="Enter firstname">
                        <div v-if="arrayError.firstname" class="invalid-feedback"> {{arrayError.firstname | error}}.</div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="inputUsername">Username</label>
                    <input v-model="form.username" type="text"
                           :class="{'is-invalid': arrayError.username, 'form-control': true}" id="inputUsername"
                           placeholder="Enter username">
                    <div v-if="arrayError.username" class="invalid-feedback"> {{arrayError.username | error}}.</div>
                </div>

                <div class="form-group">
                    <label for="inputEmail">Email</label>
                    <input v-model="form.email" type="email"
                           :class="{'is-invalid': arrayError.email, 'form-control': true}" id="inputEmail"
                           placeholder="Enter email">
                    <div v-if="arrayError.email" class="invalid-feedback"> {{arrayError.email | error }}.</div>
                </div>

                <div class="form-group">
                    <label for="inputPassword">Password</label>
                    <input v-model="form.password" type="password"
                           :class="{'is-invalid': arrayError.password, 'form-control': true}" id="inputPassword"
                           placeholder="Enter password">
                    <div v-if="arrayError.password" class="invalid-feedback"> {{arrayError.password | error }}.</div>
                </div>
                <div class="form-group">
                    <label for="inputRePassword">Re-enter password</label>
                    <input v-model="rePassword" type="password"
                           :class="{'is-invalid': arrayError.rePassword, 'form-control': true}" id="inputRePassword"
                           placeholder="Enter re-enter password">
                    <div v-if="arrayError.rePassword" class="invalid-feedback"> {{arrayError.rePassword | error}}.</div>
                </div>

                <button @click.prevent="register()" type="submit" class="btn btn-primary">Sign up</button>
                <div class="no-account">Already have an account?&nbsp;<router-link :to="{name:'user.login'}"
                                                                                   class="register">
                    Sign in!
                </router-link>
                </div>
            </form>
        </div>
    </div>
</div>
    
    `,
    data() {
        return {
            form: {
                lastname: '',
                firstname: '',
                username: '',
                email: '',
                password: ''
            },
            rePassword: '',
            arrayError: {}

        }
    },

    props: {},

    methods: {
        /**
         * Check validation
         */
        checkValidation() {
            const {form} = this;
            this.arrayError = {};

            if (!form.firstname) {
                this.arrayError["firstname"] = ['First name is required'];
            }

            if (!form.lastname) {

                this.arrayError['lastname'] = ['Last name is required'];
            }

            if (!form.username) {
                this.arrayError['username'] = ['Username is required'];
            }

            if (!this.isValidEmail(form.email)) {
                this.arrayError['email'] = ['Email invalid'];
            }

            if (!this.isValidPassword(form.password)) {
                this.arrayError['password'] = ['Password must be greater than 8 characters and contain at least 1 uppercase character'];
            }

            if (form.password !== this.rePassword) {
                this.arrayError['rePassword'] = ['Re-password not correct'];
            }


            if (this.isObjectEmpty(this.arrayError)) {
                return true;
            }
        },

        /**
         * function from https://vuejs.org/v2/cookbook/form-validation.html#Using-Custom-Validation
         * @param email
         * @returns {boolean}
         */
        isValidEmail(email) {
            let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },

        /**
         * check validation password
         * @param password
         * @returns {boolean}
         */
        isValidPassword(password) {
            if (!password) return false;
            if (password.length < 8) return false;
            let isLowerCase = password.split("").every(c => c == c.toLowerCase());
            return !isLowerCase;
        },


        /**
         * check empty object
         */
        isObjectEmpty(obj) {
            return Object.keys(obj).length == 0;
        },

        /**
         * register user
         */
        register() {
            if (!this.checkValidation()) return;
            API.post('/register', this.form)
                .then(({data}) => {
                    store.setToast({type: 'success', message: 'Register success'});
                    this.$router.push({name: 'user.login'});
                })

                .catch(({response}) => {
                    const {errors} = response.data;
                    this.arrayError = errors;
                    // store.setToast({type: 'danger', message: response.data.message});
                })
        },


    },

    computed: {}
}