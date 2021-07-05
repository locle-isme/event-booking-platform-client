const EventAgenda = {
    template:
        `
<div class="col agenda">
    <div class="card shadow-lg">
        <div class="card-body">
            <div class="d-flex my-2 flex-wrap justify-content-between">
                <div class="pt-3">
                <div class="title" :class="{'type-success': checkRegistered}">
                    {{event.name}}
                </div>
</div>
                <div class="pt-3">
                    <router-link :to="{name:'event.registration', params: {oslug: oslug, eslug: eslug }}"
                                 class="btn btn-outline-primary" id="register">Register
                    </router-link>
                </div>
            </div>
            <template v-for="(scheduleTime, index) in schedule">
                <div class="table-schedules" :key="index">             
                    <div class="schedule-time day-detail">
                        <div class="blank-time"><span class="date my-2">{{scheduleTime}}</span></div>
                        <div class="time">9:00</div>
                        <div class="time">11:00</div>
                        <div class="time">13:00</div>
                        <div class="time">15:00</div>
                    </div>
                    <div v-for="channel in event.channels" v-if="isExistSessionInChannel(channel.id, scheduleTime)" class="date-detail">
                        <div :key="channel.id" class="channel">
                            {{channel.name}}
                        </div>
                        <div class="flex-grow-1">
                            <div v-for="room in channel.rooms" v-if="isExistSessionInRoom(room.id, scheduleTime)" class="d-flex">
                                <div :key="room.id" class="room">
                                    {{room.name}}
                                </div>
                                <div class="d-flex position-relative flex-grow-1">
                                    <template v-for="session in room.sessions">
                                        <router-link
                                                :key="session.id"
                                                v-if="scheduleTime == getDate(session.start)"
                                                :to="{name:'session.detail', params: {sessionId: session.id.toString() }}"
                                                class="session text-truncate" :style="setStyle(session)"
                                                :title="session.title"
                                                :class="{registered: isRegistered(session)}">{{session.title}}
                                        </router-link>
                                    </template>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>

        </div>
    </div>
</div>
    `,
    data() {
        return {
            event: {}, //detail event
            registration: {}, //detail registration of this event,
            schedule: []
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
                    let sessionTime = data.channels.map(channel => {
                        return channel.rooms.map(room => {
                            return room.sessions.map(session => {
                                let start = this.getDate(session.start);
                                return start;
                            });
                        })
                    }).flat(Infinity);

                    this.schedule = sessionTime.filter((t, index, arr) => {
                        return arr.indexOf(t) === index;
                    });

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

        getDate(time) {
            return new Date(time).toLocaleDateString('en-GB')
        },

        isExistSessionInRoom(roomId, date) {
            return this.event.channels.some(channel => {
                return channel.rooms.some(room => {
                    return room.id == roomId && room.sessions.some(session => {
                        return this.getDate(session.start) == date;
                    })
                })
            })
            // console.log(a, roomId, date);
            // return true;
        },

        isExistSessionInChannel(channelId, date) {
            return this.event.channels.some(channel => {
                return channel.rooms.some(room => {
                    return channel.id == channelId && room.sessions.some(session => {
                        return this.getDate(session.start) == date;
                    })
                })
            })
            // console.log(a, roomId, date);
            // return true;
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