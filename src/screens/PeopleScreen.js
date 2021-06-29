import React, { useState, useEffect, useContext } from "react"
import { ScrollView, View, StyleSheet, Image, TouchableOpacity, TextInput } from "react-native"
import { observer } from 'mobx-react';
import { AntDesign } from "@expo/vector-icons";

import { FirebaseContext } from "../context/FirebaseContext";
import { StoreContext } from "../context/StoreContext";
import { Container, StatusBar, Loading, Button } from "../components/Styled"
import Text from "../components/Text"
import defaultProfilePic from "../../assets/defaultProfilePhoto.jpg";

const AddFriendBtn = (props) => {
  const {onSentRequest, data, isLoading} = props
  const [loading, setLoading] = useState(false)

  const handlePress = () => {
    setLoading(true)
    onSentRequest(data.uid)
  }

  return (
    <>
    {(loading && isLoading) ?
      <TouchableOpacity style={styles.actionBtn}>
        <Loading color="#fff" />
      </TouchableOpacity>
      :
      <TouchableOpacity style={styles.actionBtn} onPress={handlePress}>
        <AntDesign name="adduser" size={20} color="white" />
      </TouchableOpacity>
    }
    </>
  )
}

const PeopleScreen = (props) => {
  const firebase = useContext(FirebaseContext);
  const { friends: { friends } } = useContext(StoreContext);
  const [allSuggestions, setAllSuggestions] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [sendingReq, setSendingReq] = useState(false)
  

  useEffect(() => {
    getSuggestions()
  }, [friends])

  const getSuggestions = async () => {
    setIsLoading(true)
    const users = await firebase.peopleSuggestions()
    setSuggestions(prevsug => {
      return (!!users.length)? users : []
    })
    setAllSuggestions(prevsug => {
      return (!!users.length)? users : []
    })
    setIsLoading(false)
  }

  const onSearch = (searchTxt) => {
    searchTxt = searchTxt.toLowerCase()
    if(searchTxt.length === 0){
      console.log(allSuggestions)
      setTimeout(() => {
        setSuggestions([...allSuggestions])
      }, 1000);
      return
    }

    if(searchTxt.length > 1) {
      const filterData = allSuggestions.filter(s=>{
        let username = s.username.toLowerCase()
        return username.includes(searchTxt)
      })
      setSuggestions([...filterData])
    }
  }

  const sentRequest = async (userID) => {
    setSendingReq(true)
    const response = await firebase.sendFriendRequest(userID)
    alert(response.message)
    // update suggestions
    getSuggestions()

    setSendingReq(false)
  }

  const navigateToFriendChat = (user) => {
    props.navigation.navigate('MessageStack',{screen: 'MessageChat', params: {friend: {...user}} })
  }

  const renderSuggestionCards = () => {
    return (
      <>
        {suggestions.map((user, index) => (
          <View key={index} style={styles.friendCard}>
            <View style={styles.friendCardImageCnt}>
              <Image source={
                            user.profilePhotoUrl === "default"
                                ? defaultProfilePic
                                : { uri: user.profilePhotoUrl }} style={styles.friendCardImage}  />
            </View>
            <Text center medium>{user.username}</Text>
            {(!!user.city && !!user.country) &&
              <Text small>{`${user.city}, ${user.country}`}</Text>
            }
            <View style={styles.friendCardFooter}>
              
              <AddFriendBtn onSentRequest={sentRequest} data={user} isLoading={sendingReq} />
              
              <TouchableOpacity style={styles.actionBtn} onPress={() => navigateToFriendChat(user)} >
                <AntDesign name="message1" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        {(suggestions.length%2 === 0) ? null :
          <View style={[styles.friendCard, styles.emptyFriendCard]}></View>
        }
      </>
    )
  }

  return (
    <Container>
      <Text center large>People</Text>
      <View style={styles.searchForm}>
        <TextInput style={styles.input} placeholder="Search" autoCorrect={false} onChangeText={val => onSearch(val)} />
      </View>
      <ScrollView>
        <View style={styles.listWrapper}>
          {isLoading ? 
            <Loading color="#000" />
            :
            renderSuggestionCards()
          }
        </View>
      </ScrollView>
      <StatusBar />
    </Container>
  )
}

export default observer(PeopleScreen)

const styles = StyleSheet.create({
  searchForm: {paddingHorizontal: 10, paddingVertical: 20},
  input: {borderWidth: 1, borderColor: "#cccccc", borderRadius: 25, height: 50, backgroundColor: "#ffffff", paddingHorizontal: 20, paddingVertical: 0},
  listWrapper: {paddingHorizontal: 10, paddingVertical: 20, flexDirection:"row", flexWrap:'wrap', justifyContent:'space-around'},
  emptyFriendCard: {backgroundColor:'transparent'},
  friendCard: {width: '45%', alignItems:'center', backgroundColor:'#fff', borderRadius: 10, padding:10, marginBottom: 10},
  friendCardImageCnt: {width: 100, height:100, backgroundColor:'#ebecf3', borderRadius: 50, overflow:'hidden'},
  friendCardImage: {resizeMode:'contain', width:100, height: 100},
  friendCardFooter: {flexDirection: 'row', paddingTop: 10, justifyContent:'space-around', width: '100%'},
  actionBtn: {paddingVertical: 10, paddingHorizontal:20, backgroundColor:'#8022d9', marginTop: 10, borderRadius: 4},
});
