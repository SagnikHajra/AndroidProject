import {observable, action, makeObservable} from 'mobx';

/*
-------------------------------------------------
Friends store
-------------------------------------------------
*/
class FriendsStore {
  friends = []
  constructor() {
    makeObservable(this, {
      friends: observable,
      setFriends: action,
    }, { deep: false })
  }

  setFriends = (list) => {
    this.friends = list;
  }
}

export default new FriendsStore();
