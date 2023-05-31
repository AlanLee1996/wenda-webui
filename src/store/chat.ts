import { defineStore } from "pinia";
import { nanoid } from "nanoid";
import dayjs from "dayjs";
import axios from "axios";
export const useChatStore = defineStore("chat", {
  state: () => ({
    //当前激活的对话id
    activeConversationId: "1",
    //输入框的消息
    inputMessage: "",
    //最后问模型的问题
    finallyPrompt: "",
    //是否正在发送消息
    isSending: false,
    //是否中断
    isAbort: false,
    //会话列表
    conversationList: [
      {
        conversationId: "1",
        title: "新的对话1",
        time: "2023-01-02 12:00:00",
        msgCount: 1,
      },
    ],
    //消息列表
    messageList: [
      {
        conversationId: "1",
        history: [
          {
            messageId: "123123",
            role: "AI",
            content: "你好，有什么我能帮助您的？",
            time: "2023-01-02 12:00:00",
          },
        ],
      },
    ],
    temperature: 0.9,
    max_length: 2048,
    top_p: 0.3,
    //是否使用知识库
    zhishiku: true,
    //prompt模板
    promptTemplate: `system: 请扮演一名专业分析师，根据以下内容用中文回答问题：{{问题}}\n。如果您认为给出的内容和问题无关或没有提出问题，请忽略该数据内容再用中文回答。{{知识库}}`,
  }),
  getters: {},
  actions: {
    //获取某个会话的消息列表
    getMessageByConversationId(conversationId: string) {
      return this.messageList.find(
        (item) => item.conversationId === conversationId
      );
    },
    //新建会话
    createConversation() {
      let conversationId = nanoid();
      let time = dayjs().format("YYYY-MM-DD hh:mm:ss");

      this.conversationList.unshift({
        conversationId: conversationId,
        title: "新的会话",
        time: time,
        msgCount: 1,
      });
      this.messageList.unshift({
        conversationId: conversationId,
        history: [
          {
            messageId: nanoid(),
            role: "AI",
            content: "你好，有什么我能帮助您的？",
            time: time,
          },
        ],
      });
      this.activeConversationId = conversationId;
    },
    //删除会话
    deleteConversation(conversationId: string) {
      let index = this.conversationList.findIndex(
        (item) => item.conversationId === conversationId
      );
      this.conversationList.splice(index, 1);
      this.messageList.splice(index, 1);
      //如果删除的是最后一个会话,则新建一个会话
      if (this.conversationList.length === 0) {
        this.createConversation();
      }
      //激活第一个会话
      this.activeConversationId = this.conversationList[0].conversationId;
    },
    //删除消息
    deleteMessage(messageId: string) {
      let messageList = this.getMessageByConversationId(
        this.activeConversationId
      );
      let index = messageList.history.findIndex(
        (item) => item.messageId === messageId
      );
      messageList.history.splice(index, 1);
    },

    async send_raw(prompt: any, onmessage: any) {
      let result = "";
      await new Promise((resolve) => {
        let apiUrl = import.meta.env.VITE_WENDA_URL;
        let ws: any;
        if (apiUrl == "/") {
          ws = new WebSocket(location.href.replace("http", "ws") + "ws");
        } else {
          ws = new WebSocket(apiUrl.replace("http", "ws") + "/ws");
        }

        ws.onmessage = (event: any) => {
          result = event.data;
          //console.log(this.isAbort);
          if (!this.isAbort) {
            onmessage(result);
          } else {
            console.log("中断");

            ws.close();
          }
        };
        ws.onopen = () => {
          ws.send(
            JSON.stringify({
              prompt: prompt,
              keyword: "",
              temperature: this.temperature,
              top_p: this.top_p,
              max_length: this.max_length,
              history: [],
            })
          );
        };
        ws.onclose = function () {
          resolve("success");
        };
      });
      onmessage("{{successEnd}}");
      return result;
    },

    //发送消息
    async sendMessage(lastMsg: any) {
      let sendtime = dayjs().format("YYYY-MM-DD hh:mm:ss");

      //中断控制
      let controller = new AbortController();
      let signal = controller.signal;
      let sendStop = () => {
        controller.abort();
        controller = new AbortController();
        signal = controller.signal;
      };
      function MyException(message: string) {
        lastMsg.content = message;
      }

      //发送消息
      this.inputMessage = "";
      this.send_raw(this.finallyPrompt, (data: any) => {
        //console.log(data);
        if (data != "{{successEnd}}") {
          lastMsg.content = data;
        } else {
          this.isSending = false;
        }
      });
    },
    //存储文本进知识分区
    async uploadToRtst(memory_name: string, title: string, txt: any) {
      return new Promise((resolve, reject) => {
        axios
          .post(import.meta.env.VITE_WENDA_URL + "/api/upload_rtst_zhishiku", {
            memory_name: memory_name,
            title: title,
            txt: txt,
          })
          .then(function (response) {
            resolve(response.data);
          })
          .catch(function (error) {
            reject(error);
          });
      });
    },
  },
});
