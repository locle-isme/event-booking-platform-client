const SessionDetail = {
    template:
        `<div class="session-detail col">
    <div class="card shadow-lg">
        <div class="card-body">
            <div class="d-flex">
                <div class="title title-session">{{session.title}}</div>
            </div>
            <div class="d-flex description">
                {{session.description}}
            </div>
            <div class="d-flex my-2 field-box">
                <div class="session-w">Speakers:</div>
                <div v-if="session.speakers.length !== 0" class="d-flex flex-column">
                    <template v-for="speaker in session.speakers">
                        <router-link :to="{name:'speaker.detail', params: { speakerId: speaker.id.toString() }}"
                                     class="speaker" :key="speaker.id">
                                     <i aria-hidden="true" class="fa fa-user-circle"></i> 
                                     {{speaker.name}}
                        </router-link>
                    </template>
                </div>
               </div>
            <div class="d-flex mb-2 field-box">
                <div class="session-w">Start:</div>
                <div>{{session.start | date_time}}</div>
            </div>
            <div class="d-flex mb-2 field-box">
                <div class="session-w">End:</div>
                <div>{{session.end | date_time}}</div>
            </div>
            <div class="d-flex mb-2 field-box">
                <div class="session-w">Type:</div>
                <div class="text-capitalize">{{session.type}}</div>
            </div>
            <div v-if="session.type =='workshop'" class="d-flex mb-2 field-box">
                <div class="session-w">Cost:</div>
                <div>{{session.cost}}.-</div>
            </div>
        </div>
    </div>
    <router-link :to="{name:'event.agenda', params: {oslug: session.organizer_slug, eslug: session.event_slug }}" class="btn" id="back-button">
        <i class="fa fa-arrow-left" aria-hidden="true"></i>&nbsp; Back to event
    </router-link>
</div>
        
        `,
    data() {
        return {
            session: {
                speakers: []
            }
        }
    },

    /**
     * Initial data current session
     */
    created() {
        this.init();
    },

    props: {
        sessionId: String,
    },

    methods: {
        init() {
            /* get detail thong qua event detail
            API.get(`/organizers/${this.oslug}/events/${this.eslug}`)
                .then(({data}) => {
                    this.session = data.channels.map(channel => channel.rooms.map(room => room.sessions)).flat(Infinity).find(s => s.id == this.sessionId);
                    //console.log(this.session);
                    if (!this.session) this.$router.push({path: '/error/404'}); //if unavailable session redirect to error 404 page
                })
                .catch((error) => {
                    console.log(error);
                })
            */

            API.get(`/sessions/${this.sessionId}`)
                .then(({data}) => {
                    this.session = data;
                })
                .catch(({response}) => {
                    console.log(response.data);
                    this.$router.push({path: '/error/404'}); //if unavailable session redirect to error 404 page
                });
        },
    },

    computed: {},
    watch: {
        sessionId() {
            this.init();
        }
    }
}