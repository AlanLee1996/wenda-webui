import { defineStore } from 'pinia'
import { nanoid } from "nanoid";
import dayjs from 'dayjs';
import axios from 'axios';
import { useChatStore } from "~/store/chat";
export const useDocChatStore = defineStore('docChat', {
    state: () => ({
        //文档对话的知识库id
        doc_id:"",
        //文档对话的消息列表
        messageList:[
            { messageId:'123123',role: "AI", content: '你好，请上传文档，然后和我对话。我可以帮您总结文档，您也可以询问我文档中的信息！',time: '2023-01-02 12:00:00' },
        ],
        //prompt模板
        promptTemplate: `system: 请扮演一名专业分析师，根据以下内容用中文回答问题：{{问题}}\n。如果您认为给出的内容和问题无关或没有提出问题，请忽略该数据内容再用中文回答。{{知识库}}`,
    }),
    getters: {
        
    },
    actions: {
        //删除消息
        deleteMessage(messageId: string){
            let messageList=this.messageList;
            let index=messageList.findIndex((item) => item.messageId === messageId);
            messageList.splice(index,1);
            
        },
        //发送消息
        async sendMessage(lastMsg: any){
            let chatStore = useChatStore();
            
            let sendtime=dayjs().format("YYYY-MM-DD hh:mm:ss");
            
            //中断控制
            let controller = new AbortController();
            let signal = controller.signal;
            let sendStop = () => {
                controller.abort()
                controller = new AbortController();
                signal = controller.signal;
            }
            function MyException(message:string) {
                lastMsg.content = message;
            }

            //发送消息
            try {
                
				let response = await fetch(import.meta.env.VITE_WENDA_URL+"/api/chat_stream", {
					signal: signal,
					method: 'post',
					body: JSON.stringify({
						//prompt: app.会话模式.问题 + this.finallyPrompt,
                        prompt: chatStore.finallyPrompt,
						temperature: chatStore.temperature,
						top_p: chatStore.top_p,
						max_length: chatStore.max_length,
						//history: messageList.history,
                        history:[],
						zhishiku: false
					}),
					headers: {
						'Content-Type': 'application/json'
					}
				})
				chatStore.inputMessage = '';
				const reader = response.body.getReader();
				let buffer = '';
				while (!chatStore.isAbort) {
					let { value, done } = await reader.read();
					let res = new TextDecoder("utf-8").decode(value)
					buffer += res
					while (buffer.indexOf("///") > -1) {
						if (buffer == '/././') {//应对网络问题
							done = true
							break
						}
						let bufferArr = buffer.split("///");
                        let currContent=bufferArr[bufferArr.length - 2];
                        //currContent=currContent.replace("### 来源：","<br> ***来源：***");
						lastMsg.content = currContent;
                        //console.log(currContent);
                        
						buffer = bufferArr[bufferArr.length - 1];
					}
					if (done) break
				}
                sendStop();
				
                chatStore.isSending=false;
			} catch(e) { 
                console.log(e);
                
                sendStop();
                lastMsg.content='网络错误';
                chatStore.isSending=false;
            }

            
        },

    },
})