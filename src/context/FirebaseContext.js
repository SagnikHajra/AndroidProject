import React, { createContext } from "react";
import { toJS } from 'mobx'

import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import moment from 'moment'
import {sortBy, findIndex, includes, intersection} from 'lodash'

import config from "../config/firebase";
import { getGeofire } from "../config/geofire"
import userStore from '../store/UserStore'
import postStore from '../store/PostsStore'
import commentStore from '../store/CommentsStore'
import friendsStore from '../store/FriendsStore'
import chatsStore from '../store/ChatsStore'

import defaultProfilePic from "../../assets/defaultProfilePhoto.jpg";

const FirebaseContext = createContext();

if (!firebase.apps.length) {
    firebase.initializeApp(config);
    userStore.setFirebaseInit(true)
}

const db = firebase.firestore();
const rtdb = firebase.database();

const Firebase = {
    onAuthStateChanged: (listener) => {
      firebase.auth().onAuthStateChanged(listener)
    },

    getCurrentUser: () => {
        return firebase.auth().currentUser;
    },

    createUser: async (user) => {
        try {
            await firebase.auth().createUserWithEmailAndPassword(user.email, user.password);
            const uid = Firebase.getCurrentUser().uid;

            let profilePhotoUrl = "default";

            await db.collection("users").doc(uid).set({
                uid,
                username: user.username,
                email: user.email,
                phonenumber: user.phonenumber,
                city: user.city,
                country: user.country,
                dob: user.dob,
                gender: user.gender,
                profilePhotoUrl,
            });

            if (user.profilePhoto) {
                profilePhotoUrl = await Firebase.uploadProfilePhoto(user.profilePhoto);
            }

            delete user.password;

            return { ...user, profilePhotoUrl, uid };
        } catch (error) {
            console.log("Error @createUser: ", error.message);
        }
    },

    updateUser: async (user) => {
        try {
            const uid = Firebase.getCurrentUser().uid;
            const prevUser = userStore.getUser()

            let profilePhotoUrl = prevUser.profilePhotoUrl;

            await db.collection("users").doc(uid).update({
                username: user.username,
                phonenumber: user.phonenumber,
                city: user.city,
                country: user.country,
                dob: user.dob,
                gender: user.gender
            });

            if (user.profilePhoto) {
                profilePhotoUrl = await Firebase.uploadProfilePhoto(user.profilePhoto);
            }

            
            userStore.setUser({ ...prevUser, ...user, profilePhotoUrl });
            return true;
        } catch (error) {
            console.log("Error @createUser: ", error.message);
        }
    },

    uploadProfilePhoto: async (uri) => {
        const uid = Firebase.getCurrentUser().uid;

        try {
            const photo = await Firebase.getBlob(uri);

            const imageRef = firebase.storage().ref("profilePhotos").child(uid);
            await imageRef.put(photo);

            const url = await imageRef.getDownloadURL();

            await db.collection("users").doc(uid).update({
                profilePhotoUrl: url,
            });

            return url;
        } catch (error) {
            console.log("Error @uploadProfilePhoto: ", error);
        }
    },

    getBlob: async (uri) => {
        return await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.onload = () => {
                resolve(xhr.response);
            };

            xhr.onerror = () => {
                reject(new TypeError("Network request failed."));
            };

            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        });
    },

    getUserInfo: async (uid) => {
        try {
            const user = await db.collection("users").doc(uid).get();

            if (user.exists) {
                return user.data();
            }
        } catch (error) {
            console.log("Error @getUserInfo: ", error);
            return null
        }
    },

    logOut: async () => {
        try {
            await firebase.auth().signOut();

            return true;
        } catch (error) {
            console.log("Error @logOut: ", error);
        }

        return false;
    },

    signIn: async (email, password) => {
        return firebase.auth().signInWithEmailAndPassword(email, password);
    },
    
    forgotPassword: async (email) => {
        return firebase.auth().sendPasswordResetEmail(email);
    },

    uploadPostImages: async (postImages, postId) => {
        return new Promise(async (resolved, rejected) => {
            let uploadBatch = []
            postImages.forEach((postImage, index) => {
                const uploadTaskPromise = new Promise(async (resolve, reject) => {
                    try {
                        const photo = await Firebase.getBlob(postImage);
                        const postImageId = postId + '_' + index
                        const imageRef = firebase.storage().ref("postPhotos").child(postImageId);
                        await imageRef.put(photo);

                        const url = await imageRef.getDownloadURL();
                        resolve(url)
                    } catch (error) {
                        console.log("Error @uploadPostImage: ", error);
                        reject(error.message || "error")
                    }
                })
                uploadBatch.push(uploadTaskPromise)
            })
            Promise.all(uploadBatch).then((values) => {
                // console.log("posts images", values)
                resolved(values)
            }, 
            (error) => {
                rejected(error)
            })
        })
    },

    createPost: async (postObj) => {
        try {
            const postsCollection = rtdb.ref().child('posts')
            const uid = Firebase.getCurrentUser().uid;
            const post = {
                post: postObj.post,
                images: [],
                likes: 0,
                comments: 0,
                createdAt: moment().toString(),
                modifiedAt: moment().toString(),
                timestamp: moment().unix(),
                authorID: uid
            }
            const newPostKey = postsCollection.push().key
            post._id = newPostKey
            await postsCollection.child(newPostKey).update(post)
            


            if(!!postObj.images && postObj.images.length > 0) {
                const finalResponse = await Firebase.uploadPostImages(postObj.images, newPostKey).then(async (files) => {
                    await postsCollection.child(newPostKey).child('/images').set(files)
                    return true
                }, error => {
                    console.log("error uplaoding images", error)
                    return false
                })
                return finalResponse
            } else {
                return true
            }
        } catch (error) {
            console.log("create post error", error)
            return false
        }
    },

    editPost: async (postObj) => {
        try {
            const postRef = rtdb.ref().child(`posts/${postObj._id}`)

            // upload newly added post images
            if(postObj.newImages.length > 0) {
                const finalResponse = await Firebase.uploadPostImages(postObj.newImages, postObj._id).then(async (files) => {
                    let prevImages = postObj.prevImages
                    delete postObj.newImages
                    delete postObj.prevImages
                    const updatedPostObj = {
                        ...postObj,
                        images: [...prevImages, ...files],
                        modifiedAt: moment().toString()
                    }
                    await postRef.set(updatedPostObj)
                    return true
                }, error => {
                    console.log("error uplaoding images", error)
                    return false
                })
                return finalResponse
            } else {
                let prevImages = postObj.prevImages
                delete postObj.newImages
                delete postObj.prevImages
                const updatedPostObj = {
                    ...postObj,
                    images: [...prevImages],
                    modifiedAt: moment().toString()
                }
                await postRef.set(updatedPostObj)
                return true
            }
        } catch (error) {
            console.log("edit post error", error)
            return false
        }
    },

    getPosts: async () => {
        // gets the latest 20 posts
        const postsRef = rtdb.ref('/posts').orderByChild('timestamp').limitToLast(20)
        postsRef.on('value', snapshot => {
            let postsUser = []
            snapshot.forEach(child => {
                const post = child.val()
                // console.log("post", post)
                const postUserPromise = new Promise(async (resolve, reject) => {
                    try {
                        const userObj = await Firebase.getUserInfo(post.authorID)
                        if(!!userObj) return resolve({...post, user: {...userObj}})

                    } catch (error) {
                        return reject(error)
                    }
                })
                postsUser.push(postUserPromise)
            })
            Promise.all(postsUser).then((values) => {
                // console.log("posts with user", values)
                // sort desc posts
                postStore.setPosts(values.reverse())
            })
        })
    },

    onLike: (post_id, add=true) => {
        const uid = userStore.user.uid
        if(!!uid === false ) return

        // gets the post object
        let p = postStore.getPost(post_id)
        if(add){
            if(p.likes) {
                if(p.likes.includes(uid) === false) {
                    p.likes.push(uid)
                }
            } else {
                p.likes = [uid]
            }
        } else {
            if(p.likes) {
                const deletedIndex = p.likes.indexOf(uid)
                p.likes = [...p.likes.slice(0, deletedIndex), ...p.likes.slice(deletedIndex+1)]
                if(p.likes.length === 0) p.likes = 0
            }
        }
        // update UI so mobx picks up
        // postStore.updatePost(post_id, {
        //     likes: p.likes
        // })

        // save to firebase
        Firebase.updatePost(post_id, p)
    },

    updatePost: (key, post) => {
        rtdb.ref(`/posts/${key}`).set(post, (error) => {
            if(error) {
                console.log("Failed to update post", error)
            } else {
                console.log("Post update successfully")
            }
        })
    },

    deletePost: async (key) => {
        const p = postStore.getPost(key)

        // Remove comments if any
        if(!!p.comments) {
            p.comments.forEach(commentKey => {
                rtdb.ref(`/comments/${commentKey}`).remove()
            })
        }

        // Remove post object
        rtdb.ref(`/posts/${key}`).remove()
    },

    addComment: async (comment) => {
        const commentsCollection = rtdb.ref().child('comments')
        const newCommentKey = commentsCollection.push().key
        comment._id = newCommentKey
        
        // gets the post object
        let p = postStore.getPost(comment.postID)
        if(p.comments) {
            p.comments.push(newCommentKey)
        } else {
            p.comments = [newCommentKey]
        }

        return await commentsCollection
        .child(newCommentKey)
        .update(comment)
        .then((error) => {
            if(error){
                console.log("error adding comment")
                return false
            }
            console.log("Comment added!")
            
            // save to firebase
            Firebase.updatePost(p._id, p)
            return comment
        })
    },

    getComment: async (cID) => {
        try {
            const comment = await rtdb.ref(`comments/${cID}`).orderByChild('timestamp').limitToLast(10).once('value');

            if (comment.exists) {
                return comment.val();
            }
        } catch (error) {
            console.log("Error @getComment: ", error);
            return null
        }
    },

    loadComments: async (comments) => {
        let promises = []
        if(!!comments) {
            comments.forEach(c => {
                const commentPromise = new Promise(async (resolve, reject) => {
                    try {
                        const cmtObj = await Firebase.getComment(c)
                        if(!!cmtObj){
                            const userObj = await Firebase.getUserInfo(cmtObj.authorID)
                            if(!!userObj)
                                return resolve({...cmtObj, ...userObj})
                        }
                    } catch (error) {
                        return reject(error)
                    }
                })
                promises.push(commentPromise)
            })
            Promise.all(promises).then((values) => {
                // console.log("comments with user", values)
                // sort desc posts
                commentStore.setComments(values)
            })
        } else {
            commentStore.setComments([])
        }
    },

    getNearByUserIds: async(location) => {
        return new Promise(async (resolve, reject) => {
            const nearby = [];
            if(!!location) {
                const geofireInstance = await getGeofire()
                const geoQuery = geofireInstance.query({
                    center: [location.latitude, location.longitude],
                    radius: 50
                })
                geoQuery.on('key_entered', async (key, location) => {
                    // if (nearby.includes(key)) return;
                    // nearby.push(key);
                    nearby[key] = {
                        key,
                        location
                    }
                })
                geoQuery.on('ready', async () => {
                    geoQuery.cancel()
                })
                setTimeout(() => {
                    // if( geoQuery !== undefined ) {
                    //     geoQuery.cancel()
                    // }
                    resolve(nearby)
                }, 2000);
            } else {
                reject()
            }
        })
    },

    peopleNearMe: async (location) => {

        let usersDocs = []
        const usersLocations = await Firebase.getNearByUserIds(location)
        const userIds = !!usersLocations? Object.keys(usersLocations) : null

        // console.log("userIds", userIds)
        if(!!userIds) {
            usersDocs = await db.collection('users').where('uid', 'in', userIds).get()
        }
        // get all users
        // const usersDocs = await db.collection('users').get();
        const uid = Firebase.getCurrentUser().uid;

        // Get current friend list
        const friendsCollection = await rtdb.ref().child(`friends/${uid}`).once('value')
        let friendsList = []
        if(await friendsCollection.exists()) {
            // let allFrnds = friendsCollection.val()
            // friendsList = allFrnds.map(fd => fd.userID)
            friendsCollection.forEach(frnd => {
                friendsList.push(frnd.key)
            })
        }
        // console.log("friendsList||", friendsList)

        let users = [];
        usersDocs.docs.forEach(userDoc => {
            let userId = userDoc.id
            let userObj = {...userDoc.data(), id: userId}
            if(userId !== uid && !includes(friendsList, userId)) users.push(userObj)
        })
        users = sortBy(users, user => user.username.toLowerCase())
        // console.log("peopleNearMe", users)
        return users
    },

    friendsNearMe: async (location) => {

        let usersDocs = []
        const usersLocations = await Firebase.getNearByUserIds(location)
        const userIds = !!usersLocations? Object.keys(usersLocations) : []
 
        // console.log("userIds", userIds)
        const uid = Firebase.getCurrentUser().uid;

        // Get current friend list
        const friendsCollection = await rtdb.ref().child(`friends/${uid}`).once('value')
        let friendsList = []
        if(await friendsCollection.exists()) {
            // let allFrnds = friendsCollection.val()
            // friendsList = allFrnds.map(fd => fd.userID)
            friendsCollection.forEach(frnd => {
                if(frnd.val().status === "ACCEPTED")
                    friendsList.push(frnd.key)
            })
        }
        // console.log("friendsList||", friendsList)

        // filter nearby friends ids
        const commonFriends = intersection(userIds, friendsList)
        
        let users = [];
        if(commonFriends.length > 0) {
            usersDocs = await db.collection('users').where('uid', 'in', commonFriends).get()
        
            usersDocs.docs.forEach(userDoc => {
                let userId = userDoc.id
                let location = usersLocations[userId].location
                let userObj = {
                        ...userDoc.data(), 
                        location: location
                    }
                if(userId !== uid) users.push(userObj)
            })
            users = sortBy(users, user => user.username.toLowerCase())
        }
        // console.log("friendsNearMe", users)
        return users
    },
    
    peopleSuggestions: async () => {
        
        let usersDocs = []
        const uid = Firebase.getCurrentUser().uid;

        // Get current friend list
        const friendsCollection = await rtdb.ref().child(`friends/${uid}`).once('value')
        let friendsList = []
        if(await friendsCollection.exists()) {
            // let allFrnds = friendsCollection.val()
            // friendsList = allFrnds.map(fd => fd.userID)
            friendsCollection.forEach(frnd => {
                friendsList.push(frnd.key)
            })
        }

        if(friendsList.length > 0) {
            // console.log("friendsList||", friendsList)
            usersDocs = await db.collection('users').where('uid', 'not-in', friendsList).get()
        } else {
            // console.log("friendsList[]", friendsList)
            usersDocs = await db.collection('users').get();
        }

        let users = [];
        usersDocs.docs.forEach(userDoc => {
            let userId = userDoc.id
            let userObj = {...userDoc.data(), id: userId}
            if(userId !== uid) users.push(userObj)
        })
        users = sortBy(users, user => user.username.toLowerCase())
        // console.log("peopleNearMe", users)
        return users
    },

    sendFriendRequest: async (userID) => {
        try {
            const uid = Firebase.getCurrentUser().uid;
            const senderFriendsCollection = rtdb.ref().child(`friends/${uid}`)
            const receiverFriendsCollection = rtdb.ref().child(`friends/${userID}`)
            
            // check if already exists
            let requests = await senderFriendsCollection.once("value")
            if(requests.exists()) {
                const allRequests = requests.val();
                // handle duplicate requests
                if(findIndex(allRequests, (req) => req.key === userID) >= 0) {
                    let response = {
                        success: false,
                        message: "Request already sent"
                    }
                    return response
                }
            }
            const reqObj1 = {
                userID,
                status: "SENT",
                createdAt: moment().toString(),
                modifiedAt: moment().toString(),
                timestamp: moment().unix()
            }
            await senderFriendsCollection.child(userID).set(reqObj1)

            // Receiver side
            requests = null;
            requests = await receiverFriendsCollection.once("value")
            if(requests.exists()){
                const allRequests = requests.val();
                
                // handle duplicate requests
                if(findIndex(allRequests, (req) => req.key === uid) >= 0 ) {
                    let response = {
                        success: false,
                        message: "Request already received"
                    }
                    return response
                }
            }
            const reqObj2 = {
                userID: uid,
                status: "RECEIVED",
                createdAt: moment().toString(),
                modifiedAt: moment().toString(),
                timestamp: moment().unix()
            }
            await receiverFriendsCollection.child(uid).set(reqObj2)
            let response = {
                success: true,
                message: "Request successfully sent"
            }
            return response
            

        } catch (error) {
            console.log("send request error", error)
            let response = {
                success: false,
                message: "Error sending request"
            }
            return response
        }
    },

    getFriendsList: async () => {
        const uid = Firebase.getCurrentUser().uid;
        // gets the latest 20 Friends
        const friendsRef = rtdb.ref(`/friends/${uid}`).orderByChild('timestamp').limitToLast(20)
        friendsRef.on('value', snapshot => {
            let friendsList = []
            snapshot.forEach(child => {
                const friend = child.val()
                const key = child.key
                // console.log("post", post)
                const userPromise = new Promise(async (resolve, reject) => {
                    try {
                        const userObj = await Firebase.getUserInfo(friend.userID)
                        if(!!userObj) return resolve({index: key, userID: friend.userID, status: friend.status, ...userObj})

                    } catch (error) {
                        return reject(error)
                    }
                })
                friendsList.push(userPromise)
            })
            Promise.all(friendsList).then((values) => {
                // console.log("friends----", values)
                // sort desc friends
                friendsStore.setFriends(values.reverse())
            })
        })
    },

    updateFriendReq: async (friendID, status) => {
        let response = null
        try {
            const uid = Firebase.getCurrentUser().uid;
            const friendObjRef = rtdb.ref().child('friends/')
            
            // update current user friend list
            await friendObjRef.child(`${uid}/${friendID}`).update({
                status,
                modifiedAt: moment().toString()
            }, (error) => {
                if(error){
                    console.log("updateFriendReq error update current user", error)
                    response = {
                        success: false,
                        message: "Failed to update"
                    }
                    return response
                }
            })

            // update friends friend list
            await friendObjRef.child(`${friendID}/${uid}`).update({
                status,
                modifiedAt: moment().toString()
            }, (error) => {
                if(error){
                    console.log("updateFriendReq error update current user", error)
                    response = {
                        success: false,
                        message: "Failed to update"
                    }
                    return response
                }
            })

            response = {
                success: true,
                message: "Accepted"
            }
            return response
            
        } catch (error) {
            console.log("updateFriendReq error: ", error)
        }
    },

    rejectFriendReq: async (friendID) => {
        let response = null
        try {
            const uid = Firebase.getCurrentUser().uid;
            const friendObjRef = rtdb.ref().child('friends/')
            
            // update current user friend list
            await friendObjRef.child(`${uid}/${friendID}`).set(null, (error) => {
                if(error){
                    console.log("failed to remove friend object", error)
                    response = {
                        success: false,
                        message: "Failed to reject"
                    }
                    return response
                }
            })

            // update friends friend list
            await friendObjRef.child(`${friendID}/${uid}`).set(null, (error) => {
                if(error){
                    console.log("failed to remove current user obj from friend list", error)
                    response = {
                        success: false,
                        message: "Failed to reject"
                    }
                    return response
                }
            })

            response = {
                success: true,
                message: "delete"
            }
            return response
            
        } catch (error) {
            console.log("rejectFriendReq error: ", error)
        }
    },

    addUserLocation: async (location) => {
        const uid = Firebase.getCurrentUser().uid;
        await rtdb.ref().child('/locations').child(uid).set(location)
    },

    sendChatMessage: async (text, sender, receiver) => {
        // create thread key
        const key = (sender < receiver)? sender+receiver : receiver+sender
        const chatCollection = rtdb.ref().child('chats')
        const chatObj = {
            text,
            sender,
            receiver,
            timestamp: moment().unix()
        }
        await chatCollection.child(`/${key}`).push(chatObj)
    },

    getChatUsers: async () => {
        const uid = Firebase.getCurrentUser().uid;
        
        const chatsRef = rtdb.ref('/chats')
        
        chatsRef.on('value', async (snapshot) => {
            let chatUsers = []
            let chatRecent = []
            snapshot.forEach(child => {
                const chatkey = child.key
                const chat = child.val()
                // console.log("chat===", chat)
                if(chatkey.includes(uid)) {
                    const otherUserId = chatkey.replace(uid, "")
                    chatUsers.push(otherUserId)

                    const lastChatKey = Object.keys(chat)[Object.keys(chat).length-1]
                    chatRecent.push(chat[lastChatKey])
                }
            })
            if(chatUsers.length > 0) {
                // collect users documents
                // console.log("All other users", chatUsers)
                const otherusers = await db.collection('users').where('uid', 'in', chatUsers).get()
                let users = [];
                otherusers.docs.forEach(userDoc => {
                    users.push({...userDoc.data()})
                })
                // console.log("All other users", chatRecent)
                chatsStore.setChatUsers(users, chatRecent)
            }
        })
    },

    getUsersChat: async (chatId) => {
        const uid = Firebase.getCurrentUser().uid;
        const otherUserId = chatId.replace(uid, "")
        const usersChatRef = rtdb.ref(`/chats/${chatId}`)

        const otherUserData = await Firebase.getUserInfo(otherUserId)
        const loggedInUser = userStore.getUser()
        
        usersChatRef.limitToLast(30).on('value', async (snapshot) => {
            let chats = []
            snapshot.forEach(child => {
                // console.log("usersChatRef", child.val())
                const chatData = child.val()
                const chatSender = (chatData.sender === loggedInUser.uid) ? loggedInUser : otherUserData
                // sample chat object
                let chatObj = {
                    _id: child.key,
                    text: chatData.text,
                    createdAt: moment.unix(chatData.timestamp).format("YYYY-MM-DD hh:mm:ss"),
                    user: {
                      _id: chatSender.uid,
                      name: chatSender.username,
                      avatar: chatSender.profilePhotoUrl === "default" ? defaultProfilePic: chatSender.profilePhotoUrl ,
                    },
                  }
                chats.push(chatObj)
            })
            // console.log(chats)
            chatsStore.setChats(chats.reverse())
        })
    },
    
    	
	addListing: async (values) => {
        try {
            const postsCollection = rtdb.ref().child(values.place);
            const uid = Firebase.getCurrentUser().uid;
            const newPostKey = postsCollection.push().key
            values.add._id = newPostKey
            values.add.authorID = uid
            await postsCollection.child(newPostKey).update(values.add)
            
            if(!!values.image && values.image.length > 0) {
                const finalResponse = await Firebase.uploadListImages(values.image, newPostKey).then(async (files) => {
                    await postsCollection.child(newPostKey).child('images').set(files)
                    return true
                }, error => {
                    console.log("error uplaoding images", error)
                    return false
                })
                return finalResponse
            } else {
                return true
            }
        } catch (error) {
            console.log("Add Listing error", error)
            return false
        }

    },

    uploadListImages: async (postImages, postId) => {
        return new Promise(async (resolved, rejected) => {
            let uploadBatch = []
            postImages.forEach((postImage, index) => {
                const uploadTaskPromise = new Promise(async (resolve, reject) => {
                    try {
                        const photo = await Firebase.getBlob(postImage);
                        const postImageId = postId + '_' + index
                        const imageRef = firebase.storage().ref("/listImages").child(postImageId);
                        await imageRef.put(photo);

                        const url = await imageRef.getDownloadURL();
                        resolve(url)
                    } catch (error) {
                        console.log("Error @uploadPostImage: ", error);
                        reject(error.message || "error")
                    }
                })
                uploadBatch.push(uploadTaskPromise)
            })
            Promise.all(uploadBatch).then((values) => {
                // console.log("posts images", values)
                resolved(values)
            }, 
            (error) => {
                rejected(error)
            })
        })
    },
    getListing: async ({feature}) => {
        // gets the latest 20 posts
        const postsRef =  await rtdb.ref('/'+feature).orderByChild('rating').limitToLast(20);
        // console.log(postsRef);
        let postsUser = [];
        postsRef.on('value', snapshot => {
            snapshot.forEach(child => {
                const post = child.val()
                postsUser.push(post)
            })
        })

        return postsUser;
    },
//     getListing: async ({ feature }) => {
//         // gets the latest 20 posts
//         const postsRef = rtdb.ref(`'/${feature}'`).orderByChild('rating').limitToLast(10)
//         postsRef.on('value', snapshot => {
//             let postsUser = []
//             snapshot.forEach(child => {
//                 const post = child.val()
//                 // console.log("post", post)
//                 const postUserPromise = new Promise(async (resolve, reject) => {
//                     try {
//                         const userObj = await Firebase.getUserInfo(post.authorID)
//                         if(!!userObj) return resolve({...post, ...userObj})

//                     } catch (error) {
//                         return reject(error)
//                     }
//                 })
//                 postsUser.push(postUserPromise)
//             })
//             Promise.all(postsUser).then((values) => {
//                 // console.log("posts with user", values)
//                 postStore.setPosts(values.reverse())
//             })
//         })
//     },

};

const FirebaseProvider = (props) => {
    return <FirebaseContext.Provider value={Firebase}>{props.children}</FirebaseContext.Provider>;
};

export { FirebaseContext, FirebaseProvider };
