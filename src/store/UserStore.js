import {observable, action, makeObservable, toJS} from 'mobx';

/*
-------------------------------------------------
user store
-------------------------------------------------
*/
class UserStore {
  user = {
    username: "",
    email: "",
    uid: "",
    isLoggedIn: null,
    profilePhotoUrl: "default",
  };

  isFirebaseInit = false

  constructor() {
    makeObservable(this, {
      user: observable,
      isFirebaseInit: observable,
      setUser: action,
      getUser: action,
      logoutUser: action,
      setFirebaseInit: action,
    }, { deep: false })
  }


  logoutUser = () => {
    this.user = {
      username: "",
      email: "",
      uid: "",
      isLoggedIn: false,
      profilePhotoUrl: "default",
    };
  }
  setUser = (userData) => {
    this.user = userData;
  }
  getUser = () => {
    return toJS(this.user)
  }
  setFirebaseInit = (value) => {
    this.isFirebaseInit = value
  }
}

export default new UserStore();
