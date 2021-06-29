import React, { useState, useEffect, useMemo, useContext, useCallback } from "react";
import styled, {css} from "styled-components";
import { Entypo } from "@expo/vector-icons";
import { GiftedChat } from 'react-native-gifted-chat'
import { observer } from 'mobx-react'
import { toJS } from "mobx"

import { StoreContext } from "../context/StoreContext";
import { FirebaseContext } from "../context/FirebaseContext";
import defaultProfilePic from "../../assets/defaultProfilePhoto.jpg";

import Text from "../components/Text"
import { Container, StatusBar, Loading, Header, BackButton } from "../components/Styled"

const MessageChatScreen = (props) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user: {user}, chats: { chats } } = useContext(StoreContext);
  const firebase = useContext(FirebaseContext);

  useEffect(() => {
    // setMessages([
    //   {
    //     _id: 1,
    //     text: 'Hello developer',
    //     createdAt: new Date(),
    //     user: {
    //       _id: 2,
    //       name: 'React Native',
    //       avatar: 'https://placeimg.com/140/140/any',
    //     },
    //   },
    // ])
  }, [])

  useEffect(() => {
    const { params } = props.route
    // console.log("props.route", params.friend.uid)
    setMessages([])
    setLoading(true)

    const user1 = params.friend.uid
    const user2 = user.uid
    const chatId = (user1 < user2)? user1+user2 : user2+user1
    firebase.getUsersChat(chatId)

  }, [props.route?.params.friend.uid])

  useEffect(() => {
    if(chats.length) {
      setMessages(toJS(chats))
      setLoading(false)
    }
  }, [chats])

  const friend = useMemo(() => {
    const { params } = props.route
    return params.friend || null
  }, [props.route?.params.friend.uid])

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    firebase.sendChatMessage(messages[0].text, user.uid, friend.uid)
  }, [props.route?.params.friend.uid])

  return (
    <Container>
      <Header>
        <BackButton onPress={() => props.navigation.navigate('Message')}><Entypo name="chevron-left" size={24} color="black" /></BackButton>
        <Text large semi center>{friend.username}</Text>
      </Header>
      <Content>
        <ChatContainer>
          <GiftedChat
            styled
            renderLoading={() => <Loading />}
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
              _id: user.uid,
              name: user.username || '',
              avatar: user.profilePhotoUrl === "default"? defaultProfilePic : user.profilePhotoUrl 
            }}
          />
        </ChatContainer>
      </Content>
      <StatusBar />
    </Container>    
  )
}

export default observer(MessageChatScreen)

const Content = styled.View`
  flex: 1;
  flex-direction: column;
  padding-top: 20px

`
const ChatContainer = styled.View`
  flex: 1;
  background-color: #fffffe
`