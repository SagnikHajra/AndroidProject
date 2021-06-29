import React, { useRef, useContext, useEffect, useState } from "react";
import { Alert, Dimensions, View, StyleSheet } from 'react-native'
import ActionSheet from "react-native-actions-sheet";
import styled from "styled-components";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { observer } from 'mobx-react';
import moment from "moment";
import Text from "../components/Text";
import { StoreContext } from "../context/StoreContext";
import { FirebaseContext } from "../context/FirebaseContext";
import { Header } from "../components/Styled"
import defaultProfilePic from "../../assets/defaultProfilePhoto.jpg";
import tempData from "../../tempData";
import NavigationBar from 'react-native-navbar';
const height = Dimensions.get('window').height


const titleConfig = {
  title: 'Feed',
};

const HomeScreen = (props) => {
    const optionsRef = useRef(null)
    const commentsASRef = useRef(null)
    const {posts: { posts, isLiked }, user: {user}, comments: {comments, setComments}} = useContext(StoreContext);
    const firebase = useContext(FirebaseContext);
    const [currPostId, setCurrPostId] = useState(null)
    const [newComment, setNewComment] = useState("")
    
    useEffect(() => {
        firebase.getPosts()
    }, [])

    const editPost = () => {
        // console.log("Edit currPostId ", currPostId)
        props.navigation.navigate('PostStack',{screen: 'Post', params: {pid: currPostId} })
        optionsRef.current?.hide()
    }

    const deletePost = () => {
        // console.log("delete currPostId ", currPostId)
        Alert.alert("Delete post", "Are you sure?", [
            {
                text: 'No',
                onPress: () => {optionsRef.current?.hide()},
                style: 'cancel'
            },
            {
                text: 'Yes',
                onPress: () => {
                    firebase.deletePost(currPostId)
                    optionsRef.current?.hide()
                }
            }
        ]) 
    }

    const onPostASOpen = (postId) => {
        optionsRef.current?.setModalVisible()
        setCurrPostId(postId)
    }

    const onPostASClose = () => {

    }

    const onPostLike = (post_id, likeState) => {
        firebase.onLike(post_id, likeState)
    }

    const toggleCommentBox = (postId, comments) => {
        setComments([])
        commentsASRef.current?.setModalVisible()
        setCurrPostId(postId)
        firebase.loadComments(comments)
    }

    const onCommentsASClose = () => {
        setNewComment("")
    }

    const submitNewComment = async() => {
        const c = {
            body: newComment,
            createdAt: moment().toString(),
            modifiedAt: moment().toString(),
            timestamp: moment().unix(),
            authorID: user.uid,
            postID: currPostId
        }

        setComments([
            ...comments,
            {...c, ...user},
        ])
        setNewComment("")

        const response = await firebase.addComment(c)
        if(response) {
            // setComments([
            //     {...response, ...user},
            //     ...comments,
            // ])
            // commentsASRef.current?.hide()
        }
    }

    const renderPost = ({ item }) => {
        const userData = item.user
        return (
            <PostContainer>
                <PostHeaderContainer>
                    <PostProfilePhoto source={
                            userData.profilePhotoUrl === "default"
                                ? defaultProfilePic
                                : { uri: userData.profilePhotoUrl }} 
                    />
                    <PostInfoContainer>
                        <Text medium>{userData.username}</Text>
                        <Text tiny color="#c1c3cc" margin="4px 0 0 0">
                            {`${moment(item.createdAt).format("YYYY-MM-DD hh:mm:ss")}`}
                        </Text>
                    </PostInfoContainer>
                    {item.authorID === user.uid &&
                        <Options onPress={() => onPostASOpen(item._id)}>
                            <Entypo name="dots-three-horizontal" size={16} color="#73788b" />
                        </Options>
                    }
                </PostHeaderContainer>
                <Post>
                    <Text style={{marginBottom:10}}>{item.post}</Text>
                    {(item.images && item.images.length>0) &&
                        item.images.map((url, index) => (
                            <PostPhoto key={index} source={{ uri: url }} />
                        ))
                    }
                    <PostDetails>
                        {isLiked(item._id, user) ?
                            <PostLikes onPress={() => onPostLike(item._id, false)}>
                                <Ionicons name="ios-heart" size={24} color="#c02d2e" />
                                <Text tiny margin="0 0 0 8px">
                                    {(item.likes)?
                                        item.likes.length
                                        :
                                        0
                                    }
                                </Text>
                            </PostLikes>
                            :
                            <PostLikes onPress={() => onPostLike(item._id, true)}>
                                <Ionicons name="ios-heart-outline" size={24} color="#73788b" />
                                <Text tiny margin="0 0 0 8px">
                                    {(item.likes)?
                                        item.likes.length
                                        :
                                        0
                                    }
                                </Text>
                            </PostLikes>
                            }
                        <PostComments onPress={() => toggleCommentBox(item._id, item.comments)}>
                            <Ionicons name="ios-chatbox" size={24} color="#73788b" />
                            <Text tiny margin="0 0 0 8px">
                                {(item.comments)?
                                    item.comments.length
                                    :
                                    0
                                }
                            </Text>
                        </PostComments>
                    </PostDetails>
                </Post>
            </PostContainer>
        );
    }

    return (
	<MainContainer>
	<HeaderContainer>
	
                                    <Text style={{ fontSize: 20, color:"white", paddingTop:12 }} center medium bold>Feed</Text>
      
	  <MessageButton onPress={() => props.navigation.navigate("MessageStack")}>
                    <Ionicons name="chatbubbles" size={24} color="#87CEFA" />
                </MessageButton>
   
	</HeaderContainer>
        <Container>
		
           
            <FeedContainer>

                <Feed data={posts} renderItem={renderPost} keyExtractor={(item) => item._id.toString()} />
            </FeedContainer>
            <ActionSheet 
                ref={optionsRef} 
                closeOnPressBack={true}
                onClose={onPostASClose}>
                <ActionListView>
                    <ActionListViewItem onPress={editPost}>
                        <Entypo name="edit" size={18} color="#73788b" />
                        <Text medium style={{marginLeft: 20}}>Edit</Text>
                    </ActionListViewItem>
                    <ActionListViewItem onPress={deletePost}>
                        <Entypo name="trash" size={18} color="#73788b" />
                        <Text medium style={{marginLeft: 20}}>Delete</Text>
                    </ActionListViewItem>
                </ActionListView>
            </ActionSheet>

            {/* Comments ActionSheet */}
            <ActionSheet
                ref={commentsASRef} 
                closeOnPressBack={true}
                onClose={onCommentsASClose}
                keyboardShouldPersistTaps={"always"}
            >
                <PostCommentsWrapper style={{height: height*0.9}}>
                    <UserComments>
                        {comments.map((comment, index) => (
                            <Comment key={index}>
                                <CommentProfilePhoto source={
                                    comment.profilePhotoUrl === "default"
                                        ? defaultProfilePic
                                        : { uri: comment.profilePhotoUrl }}  />
                                <CommentWrapper>
                                    <Text medium bold>{comment.username}
                                        <Text>{`   ${moment(comment.modifiedAt).fromNow()}`}</Text>
                                    </Text>
                                    <Text>{comment.body}</Text>
                                </CommentWrapper>
                            </Comment>
                        ))}
                    </UserComments>
                    <CommentBox>
                        <CommentProfilePhoto source={
                            user.profilePhotoUrl === "default"
                                ? defaultProfilePic
                                : { uri: user.profilePhotoUrl }}  />
                        <CommentInput 
                            placeholder={'Write your comment...'} 
                            onChangeText={val => setNewComment(val)}
                            value={newComment}
                            autoCorrect={false}
                        />
                        {newComment != "" &&
                            <Ionicons name="md-send" size={24} color="#73788b" style={{paddingHorizontal: 10}} onPress={submitNewComment} />
                        }
                    </CommentBox>
                </PostCommentsWrapper>
            </ActionSheet>

            <StatusBar barStyle="dark-content" />
        </Container>
		</MainContainer>
    );
};

export default observer(HomeScreen)

const Container = styled.View`
    background-color: #F5F5F6;
	flex:1;
  width: 100%
  height: 80%
`;

const HeaderContainer = styled.View`
    background-color: #800080;
  width: 100%
  height: 8%
`;

const MainContainer = styled.View`
    background-color: #F5F5F6;
  width: 100%
  height: 100%
`;
const FeedContainer = styled.View`
    padding-bottom: 30px;
`;

const Feed = styled.FlatList``;

const PostContainer = styled.View`
    margin: 16px 16px 0 16px;
    background-color: #ffffff;
    border-radius: 6px;
    padding: 8px;
`;

const PostHeaderContainer = styled.View`
    flex-direction: row;
    margin-bottom: 16px;
    align-items: center;
`;

const PostProfilePhoto = styled.Image`
    width: 48px;
    height: 48px;
    border-radius: 24px;
`;

const PostInfoContainer = styled.View`
    flex: 1;
    margin: 0 16px;
`;

const Options = styled.TouchableOpacity``;

const Post = styled.View`
    margin-left: 64px;
`;

const PostPhoto = styled.Image`
    width: 100%;
    height: 150px;
    border-radius: 6px;
    margin-bottom: 10px;
`;

const PostDetails = styled.View`
    flex-direction: row;
    margin-top: 8px;
`;

const PostLikes = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
`;

const PostComments = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    margin-left: 16px;
`;

const PostCommentsWrapper = styled.View`
    border-radius: 4px;
    margin-top: 5px;
    padding: 15px 10px;
    position: relative;
`;

const CommentProfilePhoto = styled.Image`
    width: 30px;
    height: 30px;
    border-radius: 10px;
    margin-right: 5px;
`;

const CommentBox = styled.View`
    flex-direction: row;
    align-items: center;
    border: 1px solid #eee;
    padding: 5px;
    padding-bottom: 15px;
    position: absolute;
    bottom: 0;
    left: 10px;
    width: 100%;
`;

const CommentInput = styled.TextInput`
    border-bottom-color: #8e93a1;
    border-bottom-width: 0.5px;
    height: 48px;
    flex: 1;
`
const UserComments = styled.ScrollView`
    flex:1;
    width: 100%;
    margin-bottom: 50px;
`
const Comment = styled.View`
    flex-direction: row;
    align-items: center;
    padding: 10px 5px;
    border-bottom-width: 1px;
    border-bottom-color: #aaa;
    width: 100%;
`;

const CommentWrapper = styled.View`
    border-radius: 6px;
    background-color: #deebf9;
    padding: 10px;
    flex:1
`

const StatusBar = styled.StatusBar``;

const ActionListView = styled.View`
    background-color: #ffffff;
    padding: 25px 10px;
`;

const ActionListViewItem = styled.TouchableOpacity`
    padding: 10px 20px;
    flex-direction: row;
`;

const MessageButton = styled.TouchableOpacity`
  position: absolute;
  right: 0;
  padding: 10px;
`

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#800080"
  }
  });