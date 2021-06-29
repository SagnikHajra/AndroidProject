import {observable, action, makeObservable, toJS} from 'mobx';

/*
-------------------------------------------------
chats store
-------------------------------------------------
*/
class ChatsStore {
  chatUsers = []
  chatRecent = []
  chats = []
  
  constructor() {
    makeObservable(this, {
      chatUsers: observable,
      chatRecent: observable,
      chats: observable,
      setChatUsers: action,
      setChatRecent: action,
      setChats: action
    }, { deep: false })
  }

  setChatUsers = (chatUsers, recentChats=[]) => {
    this.chatUsers = chatUsers;
    if(recentChats) this.chatRecent = recentChats
  }

  setChatRecent = (chatData) => {
    this.chatRecent = chatData;
  }

  setChats = (chatData) => {
    this.chats = chatData;
  }
}

export default new ChatsStore();
