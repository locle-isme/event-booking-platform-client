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
            path: '/organizers/:oslug/events/:eslug/session/:sessionId',
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
        if (to.name == 'user.login' && store.isAuth()) {
            next({name: 'event.index'});
        } else if (to.name == 'user.register' && store.isAuth()) {
            next({name: 'event.index'});
        } else if (to.name == 'event.registration' && !store.isAuth()) {
            store.setToast({type: 'danger', message: 'You must login to register'});
            next({name: 'user.login'});
        } else {
            next();
        }
    } else {
        next();
    }
})