const HistoryList = {
    template: `<div class="col">
    <div class="card">
        <div class="card-header bg-info"><h4 class="py-0 my-1"><span class="badge badge-secondary">{{totalUpcoming}}</span> Upcoming
        </h4></div>
    </div>
    <div v-for="(registration,index) in registrations" v-if="checkUpcoming(registration) === true" :key="index"
         class="card">
        <div class="card-body">
            <div class="d-flex flex-column">
                <router-link
                        :to="{name:'history.detail', params:{event_id: registration.event.id}}"
                        class="h4 text-primary event-name">{{registration.event.name}}
                </router-link>
                <div class="d-flex justify-content-between">
                    <div><span>{{registration.event.organizer.name}}</span>,
                        <span>{{registration.event.date | date}}</span></div>
                    <!--                    <router-link :to="{name:'event.agenda', params: {oslug: registration.event.organizer.slug, eslug: registration.event.slug }}">-->
                    <!--                        Detail-->
                    <!--                    </router-link>-->
                </div>
            </div>
        </div>
    </div>
    <div class="card">
        <div class="card-header bg-warning"><h4 class="py-0 my-1"> <span class="badge badge-secondary">{{totalPassed}}</span> Passed
        </h4></div>

    </div>
    <div v-for="(registration,index) in registrations" v-if="checkUpcoming(registration) === false" :key="index"
         class="card">
        <div class="card-body">
            <div class="d-flex flex-column">
                <router-link
                        :to="{name:'history.detail', params:{event_id: registration.event.id}}"
                        class="h4 text-primary event-name">{{registration.event.name}}
                </router-link>
                <div class="d-flex justify-content-between">
                    <div><span>{{registration.event.organizer.name}}</span>,
                        <span>{{registration.event.date | date}}</span></div>
                    <!--                    <router-link :to="{name:'event.agenda', params: {oslug: registration.event.organizer.slug, eslug: registration.event.slug }}">-->
                    <!--                        Detail-->
                    <!--                    </router-link>-->
                </div>
            </div>
        </div>
    </div>

</div>
    `,
    data() {
        return {
            events: [],
            registrations: [],
        }
    },

    created() {
        API.get('/events')
            .then(({data}) => {
                this.events = data.events;
            })
            .then(() => {
                return API.get(`/registrations?token=${store.getAuth().token}`);
            })
            .then(({data}) => {
                this.registrations = data.registrations;
                this.registrations = this.sortTime(this.registrations);
            })
            .catch(() => {
                this.$router.push({name: 'user.login'}); //if unavailable session redirect to error 404 page
            })
    },

    props: {},
    mounted() {
        //console.log(this.$route);
    },
    methods: {
        sortTime(arrays) {
            return arrays.sort((a, b) => {
                return new Date(a).getTime() - new Date(b).getTime();
            })
        },

        checkUpcoming(registration) {
            const {event} = registration;
            return (new Date(event.date).getTime() - new Date().getTime()) > 0 ? true : false;
        },


    },

    computed: {
        totalUpcoming() {
            return this.registrations.filter(r => this.checkUpcoming(r)).length;
        },

        totalPassed() {
            return this.registrations.length - this.totalUpcoming;
        }
    }
}