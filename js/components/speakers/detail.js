const SpeakerDetail = {
    template:
        `<div class="speaker-detail col">
    <div class="row">
        <div class="col-sm-12 col-md-3">
        <img :src="speaker.avatar" class="img-thumbnail" alt=""></div>
        <div class="col-sm-12 col-md-9">
            <div class="card shadow-lg">
                <div class="card-body">
                    <div class="d-flex">
                        <div class="title">{{speaker.name}}</div>
                    </div>
                    <div class="d-flex flex-wrap mb-2 field-box">
                        <div class="session-w">Social linking:</div>
                        <a target="_blank" :href="speaker.social_linking">{{speaker.social_linking}}</a>
                    </div>
                    <div class="d-flex description">
                        {{speaker.description}}
                    </div>
                    <div class="d-flex mb-2 field-box">
                        <div class="session-w">Sessions joined:</div>
                        <div class="box-session-joined">
                            <template v-for="session in speaker.session_joined" :key="session.id">
                                <router-link class="session-joined" tag="span"
                                             :to="{name:'session.detail', params: {oslug: session.organizer_slug, eslug: session.event_slug, sessionId: session.id.toString() }}">
                                    {{session.title}}
                                </router-link>
                            </template>
</div>
                    </div>
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
        init() {
            API.get(`/speakers/${this.speakerId}`)
                .then(({data}) => {
                    this.speaker = data;
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