import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
    state: () => ({
        //菜单状态
        showSide:true,
        //是否手机
        isMobile:false,
    }),
    getters: {},
    actions: {},
})