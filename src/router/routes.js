const routes = [
  {
    name: 'home',
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('pages/LearnPage.vue') },
      { path: 'practice', component: () => import('pages/PracticePage.vue') },
      { path: 'practice/editor', component: () => import('pages/EditorPage.vue'), meta: { session: true } },
      { path: 'profile', component: () => import('pages/ProfilePage.vue') }
    ]
  },

  {
    path: '/login',
    component: () => import('layouts/AuthLayout.vue'),
    meta: { requiresGuest: true },
    children: [
      { name: 'login', path: '', component: () => import('pages/LoginPage.vue') }
    ]
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
