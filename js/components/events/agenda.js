const EventAgenda = {
    template:
        `
<div class="card shadow-lg">
    <div class="card-body m-2">
        <div class="row justify-content-between">
            <div class="h4 text-light title" :class="{'bg-success': checkRegistered, 'bg-dark': !checkRegistered}">{{event.name}}</div>
            <router-link :to="{name:'event.registration', params: {oslug: oslug, eslug: eslug }}"
                         class="btn btn-outline-primary" id="register">Register
            </router-link>
        </div>
        <div class="row mt-3">
            <div class="blank-time"></div>
            <div class="flex-grow-1 time">9:00</div>
            <div class="flex-grow-1 time">11:00</div>
            <div class="flex-grow-1 time">13:00</div>
            <div class="flex-grow-1 time">15:00</div>
        </div>
        <div v-for="channel in event.channels" class="row border">
            <div :key="channel.id" class="channel">
                {{channel.name}}
            </div>
            <div class="flex-grow-1">
                <div v-for="room in channel.rooms" class="d-flex">
                    <div :key="room.id" class="room">
                        {{room.name}}
                    </div>
                    <div class="d-flex position-relative flex-grow-1">
                        <router-link v-for="session in room.sessions" :key="session.id"
                                     :to="{name:'session.detail', params: {oslug: oslug, eslug: eslug, sessionId: session.id.toString() }}"
                                     class="session text-truncate" :style="setStyle(session)" :title="session.title"
                                     :class="{registered: isRegistered(session)}">{{session.title}}
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
    `,
    data() {
        return {
            event: {}, //detail event
            registration: {} //detail registration of this event
        }
    },

    props: {
        oslug: String,
        eslug: String,
    },

    /**
     * Initial data loading
     */
    created() {
        this.init();
    },

    methods: {

        init() {
            API.get(`/organizers/${this.oslug}/events/${this.eslug}`)
                .then(({data}) => {
                    this.event = data;
                })
                .catch((error) => {
                    this.$router.push({path: '/error/404'});
                    //console.log(error);
                })
                .then(() => {
                    if (store.isAuth()) {
                        return API.get(`/registrations?token=${store.getAuth().token}`);
                    } else {
                        let obj = {};
                        return {data: {registrations: []}};
                    }
                })
                .then(({data}) => {
                    this.registration = data.registrations.find(r => r.event.id == this.event.id);
                })
        },
        /**
         * Set width and position of session
         * @param session
         * @returns {string}
         */
        setStyle(session) {
            const all = (17 - 9) * 60;
            const s = new Date(session.start);
            const e = new Date(session.end);
            const ms = s.getHours() * 60 + s.getMinutes();
            const me = e.getHours() * 60 + e.getMinutes();
            const w = (me - ms) / all * 100;
            const l = (ms - 9 * 60) / all * 100;
            return `left:${l}%; width: ${w}%`
        },

        /**
         * Check session registered
         * @param session
         * @returns {boolean}
         */
        isRegistered(session) {
            if (this.registration && this.registration.session_ids) {
                const {session_ids} = this.registration;
                if (session_ids.indexOf(session.id) > -1 || session.type == 'talk') return true;
            }
            return false;
        },


    },

    computed: {
        /**
         * Check event registered
         * @returns {boolean}
         */
        checkRegistered() {
            return (this.registration && this.registration.event) ? true : false
        },
    },

    watch: {
        oslug() {
            this.init();
        },

        eslug() {
            this.init();
        }
    }

}