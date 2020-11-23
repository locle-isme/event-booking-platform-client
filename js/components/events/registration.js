const EventRegistration = {
    template: `<div class="card shadow-lg">
    <div class="card-body">
        <div class="d-flex mt-2 mb-2">
            <div class="h4 bg-dark text-light title">{{event.name}}</div>
        </div>
        <div class="d-flex">
            <div v-for="(ticket, index) in tickets"  @click="selectTicket(index)" :key="ticket.id" class="d-flex flex-grow-1 justify-content-between ticket"
                 :class="{disabled: !ticket.available}">
                <div class="custom-control custom-radio">
                    <input ref="listItem" v-model="form.ticket_id" :value="ticket.id" type="radio" :id="'ticket' + ticket.id"
                           name="ticket_id" class="custom-control-input" :disabled="!ticket.available">
                    <label class="custom-control-label" :for="'ticket' + ticket.id">{{ticket.name}}</label>
                    <div class="ticket-description mt-2">{{ticket.description}}</div>
                </div>
                <div class="ticket-cost">{{ticket.cost}}.-</div>
            </div>
        </div>
        <div class="d-flex flex-column mt-4">
            <div class="h5">Select additional you want to book:</div>
            <div v-for="session in workshops" :key="session.id" class="custom-control custom-checkbox mt-2">
                <input v-model="form.session_ids" :value="session.id" type="checkbox" class="custom-control-input"
                       :id="'ss' + session.id">
                <label class="custom-control-label" :for="'ss' + session.id">{{session.title}}</label>
            </div>

        </div>
        <div class="d-flex align-items-end flex-column">
            <div class="d-flex justify-content-between detail-cost">
                <div>Event Ticket:</div>
                <div id="event-cost">{{event_cost}}.-</div>
            </div>
            <div class="d-flex justify-content-between detail-cost">
                <div>Additional workshops:</div>
                <div id="additional-cost">{{additional_cost}}.-</div>
            </div>
            <div class="d-flex justify-content-between detail-cost border-bottom">
            </div>
            <div class="d-flex justify-content-between detail-cost">
                <div>Total:</div>
                <div id="total-cost">{{total_cost}}.-</div>
            </div>
            <button class="btn btn-outline-danger" :disabled="!form.ticket_id" @click="purchase">Purchase</button>
        </div>
    </div>
</div>
    
    `,
    data() {
        return {
            event: {}, //detail event
            tickets: [], //list tickets of event
            workshops: [], //list sessions has type is workshop of event
            form: { //form data
                ticket_id: null,
                session_ids: []
            }
        }
    },

    props: {
        oslug: String,
        eslug: String,
    },

    created() {
        /**
         * Initital data
         */
        this.init();
    },

    methods: {
        /**
         * Initital data
         */
        init() {
            API.get(`/organizers/${this.oslug}/events/${this.eslug}`)
                .then(({data}) => {
                    this.event = data;
                    this.tickets = data.tickets;
                    this.workshops = data.channels.map(channel => channel.rooms.map(room => room.sessions.filter(s => s.type == 'workshop'))).flat(Infinity);

                })
                .catch((error) => {
                    this.$router.push({path: '/error/404'});
                })
        },

        /**
         * send form data into server to register
         */
        purchase() {
            API.post(`/organizers/${this.oslug}/events/${this.eslug}/registration?token=${store.getAuth().token}`, this.form)
                .then(({data}) => {
                    store.setToast({type: 'success', message: data.message});
                    this.$router.push({name: 'event.agenda', params: {oslug: this.oslug, eslug: this.eslug}});
                })
                .catch(({response}) => {
                    store.setToast({type: 'danger', message: response.data.message});
                })
        },

        selectTicket(index) {
            //console.log(this.$refs.listItem[index]);
            if (this.tickets[index].available == true) {
                this.$refs.listItem[index].checked = true;
                this.form.ticket_id = this.$refs.listItem[index].value;
            }
        }
    },

    mounted() {
        //console.log(this.$refs);
        //console.log(this.$refs.values);
    },

    computed: {
        /**
         * get Cost ticket
         * @returns {number}
         */
        event_cost() {
            let value = 0;
            if (this.form.ticket_id) {
                const f = this.tickets.find(t => t.id == this.form.ticket_id);
                if (f) value = parseInt(f.cost);
            }
            return value;
        },

        /**
         * Get session workshop cost
         * @returns {number}
         */
        additional_cost() {
            let value = 0;
            if (this.form.session_ids.length > 0) {
                this.form.session_ids.forEach(session_id => {
                    const f = this.workshops.find(s => s.id == session_id);
                    if (f) value += parseInt(f.cost);
                })

            }
            return value;
        },

        /**
         * get total cost
         * @returns {*}
         */
        total_cost() {
            return this.event_cost + this.additional_cost;
        }

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
