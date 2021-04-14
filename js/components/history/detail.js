const HistoryDetail = {
    template: `<div class="col">
    <div class="card">
        <div class="card-header bg-info"><span class="text-light h4">Detail registration</span></div>
    </div>
    <div class="card">
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-bordered table-striped">
                    <tbody>
                    <tr>
                        <td>Registration ID</td>
                        <td><strong class="text-primary"><strong>######</strong></strong></td>
                        <td>Registration time</td>
                        <td><span class="font-weight-bold">{{registration.registration_time | date_time}}</span></td>
                    </tr>
                    <tr>
                        <td>Event</td>
                        <td colspan="4"><router-link :to="{name: 'event.agenda', params:{oslug: organizer.slug, eslug: event.slug}}" tag="span" class="font-weight-bold text-warning" style="cursor: pointer">{{event.name}}</router-link></td>
                    </tr>
                    <tr>
                        <td>Status</td>
                        <td colspan="4"><strong class="font-weight-bold"><span v-if="isUpcoming == true">Upcoming</span><span class="font-weight-bold" v-else>Passed</span></strong></td>
                    </tr>
                    <tr>
                    <td>Date</td>
                        <td><span class="font-weight-bold">{{event.date | date}}</span></td>
                        <td>Organizer</td>
                        <td><span class="font-weight-bold">{{organizer.name}}</span></td>
                    </tr>
                    <tr>
                    <td>Ticket</td>
                        <td><span class="font-weight-bold">{{ticket.name}}</span></td>
                        <td>Description</td>
                        <td><span class="font-weight-bold">{{ticket.description || "..."}}</span></td>
                    </tr>
                    <tr>
                        <td>Additional workshops</td>
                        <td colspan="4">
                        <ul style="list-style-type: none; margin: 0px; padding: 0px;">
                        <div v-if="workshops.length > 0">
                        <template v-for="session in workshops" :key="session.id">
                                <router-link class="session-joined font-weight-bold" tag="li"
                                             :to="{name:'session.detail', params: {sessionId: session.id.toString() }}">
                                    {{session.title}}
                                </router-link>
                            </template>
</div>
<div v-else>(Empty)</div>
                        </ul>
                        </td>
                    </tr>
                    <tr><td>Total cost</td><td colspan="4"><span class="font-weight-bold">{{total_cost}} .-</span></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <router-link :to="{name:'history.list'}" class="btn btn-dark" id="back-button"><i class="fa fa-arrow-left" aria-hidden="true"></i>&nbsp; to registrations list page</router-link>
</div>
    `,
    data() {
        return {
            registration: {
                event: {},
                workshops: [],
                registration_time: null
            },
            workshops: []
        }
    },

    created() {
        this.init();
    },

    props: {
        event_id: Number
    },
    mounted() {
        //console.log(this.$route);
    },
    methods: {

        init() {
            API.get(`/registrations?token=${store.getAuth().token}`)
                .then(({data}) => {
                    const registrations = data.registrations;
                    this.registration = registrations.find(r => r.event.id == this.event_id);
                })
                .then(() => {
                    if (this.registration) {
                        return API.get(`/organizers/${this.organizer.slug}/events/${this.event.slug}`);
                    } else {
                        throw "oh no";
                    }
                })
                .then(({data}) => {
                    const {session_ids} = this.registration;
                    this.workshops = data.channels.map(channel => channel.rooms.map(room => room.sessions)).flat(Infinity).filter(s => session_ids.indexOf(s.id) > -1);
                })
                .catch(() => {
                    this.$router.push({path: '/error/404'}); //if unavailable session redirect to error 404 page
                })
        },

        sortTime(arrays) {
            return arrays.sort((a, b) => {
                return new Date(a).getTime() - new Date(b).getTime();
            })
        },
    },

    computed: {
        event() {
            const {event} = this.registration;
            return event || {};
        },

        organizer() {
            const {organizer} = this.event;
            return organizer || {};
        },

        ticket() {
            const {ticket} = this.registration;
            return ticket || {};
        },

        isUpcoming() {
            const {event} = this.registration;
            return (new Date(event.date).getTime() - new Date().getTime()) > 0 ? true : false;
        },

        total_cost() {
            const {workshops, ticket} = this;
            let total = workshops.reduce((accumulator, item) => parseInt(item.cost) + accumulator, 0) + parseInt(ticket.cost);
            return total;
        },


    },

    watch:{
        event_id(){
            this.init();
        }
    }
}