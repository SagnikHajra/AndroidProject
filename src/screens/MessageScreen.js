import React, { useState, useEffect, useContext } from "react";
import styled, {css} from "styled-components";
import { Entypo } from "@expo/vector-icons";
import { observer } from 'mobx-react'
import { toJS } from "mobx"
import { StyleSheet } from "react-native"

import { FirebaseContext } from "../context/FirebaseContext";
import { StoreContext } from "../context/StoreContext";
import Text from "../components/Text"
import { StatusBar, Loading } from "../components/Styled"
import defaultProfilePic from "../../assets/defaultProfilePhoto.jpg";

const friendsList = [
  {
    id: 1,
    username: 'User1',
  },
  {
    id: 2,
    username: 'User2',
  },
  {
    id: 3,
    username: 'User3',
  }
]

const MessageScreen = (props) => {
  const firebase = useContext(FirebaseContext);
  const { chats: { chatUsers, chatRecent } } = useContext(StoreContext);

  useEffect(() => {
    firebase.getChatUsers()
  }, [])

  const navigateToChatDetail = (item) => {
    props.navigation.navigate('MessageChat', {friend: {...item}})
  }

  const renderChatUsers = ({ item, index }) => {
    return (
      <PeopleContainer onPress={() => navigateToChatDetail(item) }>
        <PeopleContent>
          <PeopleAvatar source={
                            item.profilePhotoUrl === "default"
                                ? defaultProfilePic
                                : { uri: item.profilePhotoUrl }} />
          <PeopleDetails>
            <Text medium >{item.username}</Text>
              <Text small color="#8e93a1" >{chatRecent[index].text}</Text>
          </PeopleDetails>
          <Entypo name="chevron-right" size={20} color="black" />
        </PeopleContent>
      </PeopleContainer>
    )
  }

  return (
    <MainContainer>
     <TextContainer>
        <Text large semi center style={styles.title}>Messages</Text>
        {/* <Empty></Empty> */}
     </TextContainer>
	 
	 <Container>
		<Content>
			<Friends data={toJS(chatUsers)} renderItem={renderChatUsers} keyExtractor={(item) => item.uid.toString()} ListEmptyComponent={<EmptyFriendList />} />
		</Content>
		<StatusBar barStyle="light-content" />
     </Container>  
	 </MainContainer>
  );
};

export default observer(MessageScreen)

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
	color: '#FFFFFF',
	fontWeight : 'bold'
  }});

const EmptyFriendList = () => (
  <EmptyFlatList>
    <Text large bold color="#ccc">No Recent Chats</Text>
  </EmptyFlatList>
)


const MainContainer = styled.View`
  background-color: #FFFFFF;
  width: 100%
  height: 100%
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 0 10px;
`
const BackButton = styled.TouchableOpacity`
  position: absolute;
  left: 0;
  padding: 20px;
`

const Content = styled.View`
  padding: 20px 10px;
  margin: 10px;
  background-color: #fff;
  flex: 1;
`;

const Friends = styled.FlatList``;

const  EmptyFlatList = styled.View`
  align-items: center;
  justify-content: center
`

const PeopleContainer = styled.TouchableOpacity`
  margin-bottom: 10px;
  border-bottom-width: 1px;
  border-color: #ccc;
  border-radius: 4px;
  padding: 10px;
`;

const PeopleContent = styled.View`
  flex-direction: row;
  align-items: center;
`
const PeopleAvatar = styled.Image`
  width: 48px;
  height: 48px;
  border-radius: 24px;
`;

const PeopleDetails = styled.View`
  flex: 1;
  margin-left: 10px;
`;

const ButtonIcon = styled.TouchableOpacity`
  padding: 10px;
  height: 48px;
`;

const ActionBtn = styled.View`
  flex-direction: column;
`

const TextContainer = styled.View`
  padding-top: 64px
  background-color: #9370DB;
  width: 100%
  height:30%
  `;
const Container = styled.View`
  
  background-color: #FFFFFF;
  width: 100%
  height: 70%
`;
