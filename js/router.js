const router = new VueRouter({
    routes: [
        {
            path: '/',
            name: 'event.index',
            component: EventIndex
        },
        {
            path: '/organizers/:oslug/events/:eslug',
            name: 'event.agenda',
            component: EventAgenda,
            props: true
        },
        {
            path: '/organizers/:oslug/events/:eslug/registration',
            name: 'event.registration',
            component: EventRegistration,
            props: true,
            meta: {
                auth: true
            }
        },
        {
            path: '/session/:sessionId',
            name: 'session.detail',
            component: SessionDetail,
            props: true
        },
        {
            path: '/users/login',
            name: 'user.login',
            component: UserLogin,
            props: true,
            meta: {
                auth: true,
                title: 'Login',
            }
        },
        {
            path: '/users/register',
            component: UserRegister,
            name: 'user.register',
            props: true,
            meta: {
                auth: true,
                title: 'Register'
            }
        },
        {
            path: '/history',
            component: HistoryList,
            name: 'history.list',
            props: true,
            meta: {
                auth: true,
                title: 'History'
            }
        },
        {
            path: '/history/event/:event_id',
            component: HistoryDetail,
            name: 'history.detail',
            props: true,
            meta: {
                auth: true,
                title: 'Detail registration'
            }
        },
        {
            path: '/speakers/:speakerId',
            component: SpeakerDetail,
            name: 'speaker.detail',
            props: true,
        },
        {
            path: '*',
            name: 'error.404',
            component: Error404,
            props: true
        }
    ]
})

/**
 * middleware router
 */
router.beforeEach((to, from, next) => {
    // if (from.name == 'user.login' && to.name == 'user.register' && store.isAuth()) {
    //
    // }
    if (to.meta.auth) {
        const LIST_AUTH_CONTINUE = ['history.list', 'history.detail'];
        if (to.name == 'user.login' && store.isAuth()) {
            next({name: 'event.index'});
        } else if (to.name == 'user.register' && store.isAuth()) {
            next({name: 'event.index'});
        } else if (to.name == 'event.registration' && !store.isAuth()) {
            store.setToast({type: 'danger', message: 'You must login to join this event'});
            next({name: 'user.login'});
        } else if (LIST_AUTH_CONTINUE.indexOf(to.name) > -1 && !store.isAuth()) {
            store.setToast({type: 'danger', message: 'You must login to continue'});
            next({name: 'user.login'});
        } else {
            next();
        }
    } else {
        next();
    }
})