import React, { createContext } from "react";

import userStore from '../store/UserStore';
import postsStore from '../store/PostsStore';
import commentsStore from '../store/CommentsStore';
import friendsStore from '../store/FriendsStore';
import chatsStore from '../store/ChatsStore';

const StoreContext = createContext([{}, () => {}]);

const StoreProvider = (props) => {
    const store = {
        user: userStore,
        posts: postsStore,
        comments: commentsStore,
        friends: friendsStore,
        chats: chatsStore
    }
    return <StoreContext.Provider value={store}>{props.children}</StoreContext.Provider>;
};

export { StoreContext, StoreProvider };
