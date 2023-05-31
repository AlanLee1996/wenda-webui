import { defineStore } from "pinia";
export const useDocChatStore = defineStore("docChat", {
  state: () => ({
    //文档对话的知识库id
    doc_id: "",
    //文档对话的消息列表
    messageList: [
      {
        messageId: "123123",
        role: "AI",
        content:
          "你好，请上传文档，然后和我对话。我可以帮您总结文档，您也可以询问我文档中的信息！",
        time: "2023-01-02 12:00:00",
      },
    ],
  }),
  getters: {},
  actions: {
    //删除消息
    deleteMessage(messageId: string) {
      let messageList = this.messageList;
      let index = messageList.findIndex((item) => item.messageId === messageId);
      messageList.splice(index, 1);
    },
  },
});
