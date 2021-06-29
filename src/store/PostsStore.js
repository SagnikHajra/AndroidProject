import {observable, action, makeObservable, toJS} from 'mobx';

/*
-------------------------------------------------
posts store
-------------------------------------------------
*/
class PostsStore {
  posts = []
  constructor() {
    makeObservable(this, {
      posts: observable,
      setPosts: action,
      getPost: action,
      updatePost: action,
      isLiked: action,
    }, { deep: false })
  }

  setPosts = (postData) => {
    this.posts = postData;
  }
  getPost = (postId) => {
    let postData = toJS(this.posts.filter(post => post._id === postId)[0])
    delete postData.user
    return postData
  }
  updatePost = (postId, updateObj) => {
    let postData = toJS(this.posts.filter(post => post._id === postId)[0])
    postData = {
      ...postData,
      ...updateObj
    }
    this.posts = postData
  }
  isLiked = (post_id, user) => {
    if(post_id === undefined){
      return false
    }
    // if no user
    if(!!user.uid === false){
      return false
    }
    // if no likes
    if(!toJS(this.posts).filter(post => post._id === post_id)[0].likes) {
      return false
    }
    // if liked by the current user
    if(toJS(this.posts).filter(post => post._id === post_id)[0].likes.includes(user.uid)){
      return true
    }
    return false
  }
}

export default new PostsStore();
