const EventIndex = {
    template: `    
    <div>
        <div v-for="event in events" class="card mb-4 event">
            <div class="card-body">
                <div class="d-flex flex-column">
                    <router-link :to="{name:'event.agenda', params: {oslug: event.organizer.slug, eslug: event.slug }}"
                                 class="h4 text-primary event-name">{{event.name}}
                    </router-link>
                    <div><span>{{event.organizer.name}}</span>, <span>{{event.date | date}}</span></div>

                </div>
            </div>
        </div>
    </div>`,
    data() {
        return {
            events: []
        }
    },


    props: {},

    /**
     * Initial data list event
     */
    created() {
        API.get('/events')
            .then(({data}) => {
                this.events = data.events;
            })
    },

    methods: {},

    computed: {}
}