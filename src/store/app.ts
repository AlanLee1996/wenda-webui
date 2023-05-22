import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
    state: () => ({
        //加载全屏loading
        loading:false,
        loadingText:'',
        //菜单状态
        showSide:true,
        //是否手机
        isMobile:false,
        //正在与文档对话
        chatDocument:false,
    }),
    getters: {},
    actions: {},
})