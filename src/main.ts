import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/modules/auth/store/authStore'
import { useMessageStore } from '@/shared/store/messageStore'
import {
  setAuthTokenGetter,
  setLogoutHandler,
  setMessageStore
} from '@/shared/services/http'
import '@/assets/main.css'
import maskDirective from '@/shared/directives/mask'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)

const auth = useAuthStore()
auth.loadFromStorage()

setAuthTokenGetter(() => auth.token)
setLogoutHandler(() => auth.logout?.())
setMessageStore(useMessageStore())

app.directive('mask', maskDirective)

app.mount('#app')
