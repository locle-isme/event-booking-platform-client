const SpeakerDetail = {
    template:
        `<div class="row">
    <div class="col-3"><img :src="'data:image/png;base64,' + speaker.avatar" class="img-thumbnail" alt=""></div>
    <div class="col-9">
        <div class="card shadow-lg">
            <div class="card-body">
                <div class="d-flex">
                    <div class="h4 text-light title title-session">Information</div>
                </div>
                <div class="d-flex my-2">
                    <div class="session-w">Name:</div>
                    <div>{{speaker.name}}</div>
                </div>
                <div class="d-flex mb-2">
                    <div class="session-w">Link:</div>
                    <a :href="speaker.link">{{speaker.link}}</a>
                </div>
                <div class="d-flex session-description text-light title">
                    {{speaker.info}}
                </div>
                <div class="d-flex mb-2">
                    <div class="session-w">Sessions joined:</div>
                    <ul style="list-style-type: none;margin: 0;padding: 0">
                        <template v-for="session in speaker.session_joined" :key="session.id">
                            <router-link class="session-joined" tag="li"
                                         :to="{name:'session.detail', params: {oslug: session.organizer_slug, eslug: session.event_slug, sessionId: session.id.toString() }}">
                                {{session.title}}
                            </router-link>
                        </template>
                    </ul>
                
                </div>
            </div>
        </div>
    </div>
</div>
        
        `,
    data() {
        return {
            speaker: {}
        }
    },

    /**
     * Initial data current session
     */
    created() {
        this.init();
    },

    props: {
        speakerId: String,
    },

    methods: {
        init(){
            API.get(`/speaker/${this.speakerId}`)
                .then(({data}) => {
                    this.speaker = data.speaker;
                    if (!this.speaker) this.$router.push({path: '/error/404'}); //if unavailable session redirect to error 404 page
                })
                .catch((error) => {
                    this.$router.push({path: '/error/404'}); //if unavailable session redirect to error 404 page
                    console.log(error);
                })
        }
    },

    computed: {},
    watch: {
        speakerId() {
            this.init();
        },
    }


}