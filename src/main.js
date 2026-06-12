import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createStore } from 'vuex'
import router from './router'

const store = createStore({
    state(){
        return{
            author: 'danny',
            likes: 0,
            width: 0,
            height: 0
        }
    },
    mutations: {
        increaseLike(state){
            state.likes++
        },
        updateWidth(state, width){
            state.width = width
        },
        resetScore(state){
            state.score = 0
        },
        updateHeight(state, height){
            state.height = height
        },
        resetHeight(state){
            state.height = 0
        }
    }
})

const app = createApp(App)
app.use(store)
app.use(router)
app.mount('#app')
