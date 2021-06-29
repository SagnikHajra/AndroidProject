import React, { useState, useEffect, useContext } from "react";
import styled, {css} from "styled-components";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { toJS } from 'mobx';
import { observer } from 'mobx-react';

import { FirebaseContext } from "../context/FirebaseContext";
import { StoreContext } from "../context/StoreContext";
import Text from "../components/Text"
import { Container, StatusBar, Loading } from "../components/Styled"
import defaultProfilePic from "../../assets/defaultProfilePhoto.jpg";

const FriendsScreen = (props) => {
  const firebase = useContext(FirebaseContext);
  const { friends: { friends } } = useContext(StoreContext);
  const [friendsList, setFriendsList] = useState([...toJS(friends)])
  const [loading, setLoading] = useState(false)

  // useEffect(() => {
  //   firebase.getFriendsList()
  // }, [])

  useEffect(() => {
    setFriendsList(toJS(friends))
  }, [friends])

  const onSearch = (searchTxt) => {
    searchTxt = searchTxt.toLowerCase()
    if(searchTxt.length === 0){
      setTimeout(() => {
        setFriendsList([...friends])
      }, 1000);
      return
    }

    if(searchTxt.length > 1) {
      const filterData = friends.filter(s=>s.username.includes(searchTxt))
      setFriendsList([...filterData])
    }
  }

  const acceptReq = async (item) => {
    setLoading(true)
    let response = await firebase.updateFriendReq(item.index, "ACCEPTED")
    if(response) {
      setLoading(false)
      if(response.success === false) alert(response.message)
    }
  }

  const rejectReq = async (item) => {
    setLoading(true)
    let response = await firebase.rejectFriendReq(item.index)
    if(response) {
      setLoading(false)
      if(response.success === false) alert(response.message)
    }
  }

  const navigateToFriendChat = (user) => {
    props.navigation.navigate('MessageStack',{screen: 'MessageChat', params: {friend: {...user}} })
  }

  const renderFriendItem = ({item}) => {
    return (
      <PeopleContainer onPress={() => props.navigation.navigate("FriendsLocation")}>
        <PeopleContent>
          <PeopleAvatar source={
                            item.profilePhotoUrl === "default"
                                ? defaultProfilePic
                                : { uri: item.profilePhotoUrl }} />
          <PeopleDetails>
            <Text medium >{item.username}</Text>
            <Text small>{`${item.gender? item.gender:''}`}</Text>
            {(!!item.city && !!item.country) &&
              <Text small>{`${item.city}, ${item.country}`}</Text>
            }
          </PeopleDetails>
          {item.status === 'SENT' &&
            <StatusButton info>
              <Text color="#fff" bold>Awaiting</Text>
            </StatusButton>
          }
          {item.status === 'RECEIVED' &&
            <ActionBtn>
              <StatusButton success onPress={() => {!loading ? acceptReq(item): null}}>
                <Text color="#fff" bold>Accept</Text>
              </StatusButton>
              <StatusButton danger onPress={() => {!loading ? rejectReq(item): null}}>
                <Text color="#fff" bold>Reject</Text>
              </StatusButton>
            </ActionBtn>
          }
          {item.status === 'ACCEPTED' &&
          <StatusButton onPress={() => navigateToFriendChat(item)} >
            <AntDesign name="message1" size={20} color="white" />
          </StatusButton>
          }
        </PeopleContent>
      </PeopleContainer>
    )
  }

  return (
    <Container>
      <Header>
        <BackButton onPress={() => props.navigation.goBack()}><Entypo name="chevron-left" size={24} color="black" /></BackButton>
        <Text large semi center>Friends</Text>
        {/* <Empty></Empty> */}
      </Header>
      <SearchForm>
        <Input placeholder="Search" autoCorrect={false} onChangeText={val => onSearch(val)} />
      </SearchForm>
      <Content>
        <Friends data={friendsList} renderItem={renderFriendItem} keyExtractor={(item) => item.index.toString()} ListEmptyComponent={<EmptyFriendList />} />
      </Content>
      <StatusBar barStyle="light-content" />
    </Container>
  );
};

export default observer(FriendsScreen)

const EmptyFriendList = () => (
  <EmptyFlatList>
    <Text large bold color="#ccc">Empty Friends List</Text>
  </EmptyFlatList>
)


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

const SearchForm = styled.View`
  padding: 20px 10px;
`
const Input = styled.TextInput`
  border-width: 1px;
  border-color: #cccccc;
  border-radius: 25px;
  height: 50px;
  background-color: #ffffff; 
  padding: 0 20px;
`

const Friends = styled.FlatList``;

const  EmptyFlatList = styled.View`
  align-items: center;
  justify-content: center
`

const PeopleContainer = styled.TouchableOpacity`
  margin-bottom: 10px;
  border-width: 1px;
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

const StatusButton = styled.TouchableOpacity`
  padding: 5px 10px;
  background-color: #28a745;
  border-radius: 4px;
  margin-left: 10px;
  ${props => props.info && css`
    background-color: #6c757d;
  `}
  ${props => props.danger && css`
    background-color: #dc3545;
    margin-top: 10px;
  `}
`;

// box-shadow: 0px 1px 1px rgba(0,0,0,0.25);
