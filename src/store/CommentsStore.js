import {observable, action, makeObservable} from 'mobx';

/*
-------------------------------------------------
comments store
-------------------------------------------------
*/
class CommentsStore {
  comments = []
  constructor() {
    makeObservable(this, {
      comments: observable,
      setComments: action,
    }, { deep: false })
  }

  setComments = (commentsData) => {
    this.comments = commentsData;
  }
}

export default new CommentsStore();
