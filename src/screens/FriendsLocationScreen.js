import React, { useEffect, useState, useContext } from 'react'
import { useWindowDimensions } from "react-native";
import styled from "styled-components"
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from "@expo/vector-icons";

import { getCurrentLocation } from "../utils"

import Text from "../components/Text"
import { FirebaseContext } from "../context/FirebaseContext";

const initialRegion = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
}

export default FriendsLocationScreen = (props) => {
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;
  const firebase = useContext(FirebaseContext);
  const [mapRegion, setMapRegion] = useState(initialRegion)
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])

  useEffect(() => {
    const { params } = props.route
    if(!!params === false) {
      getUsers()
    }
  }, [])

  const getUsers = async () => {
    setLoading(true)
    const location = await getCurrentLocation()
    if(location) {
      let usersData = await firebase.friendsNearMe(location)
      setUsers(usersData)
      let firstUser = usersData[0]
      setMapRegion({
        ...initialRegion,
        latitude: firstUser.location[0],
        longitude: firstUser.location[1],
      })
    }
    setLoading(false)
  }

  return (
    <Container>
      <Header>
        <BackButton onPress={() => props.navigation.goBack()}>
          <Ionicons name="ios-arrow-back" size={24} color="black" />
        </BackButton>
        <Text bold medium>Friends Locations</Text>
        <BackButton></BackButton>
      </Header>
      <Content>
        <MapView 
          region={mapRegion}
          style={{width: windowWidth, height: windowHeight}}>
            {users.map((user, index) => {
              const coords = {latitude: user.location[0], longitude: user.location[1]}
              return (
                <Marker 
                  key={index}
                  coordinate={coords}
                  title={`${user.username} ${user.city? `, ${user.city}`: ``}`}
                />
              )}
            )}
        </MapView>
      </Content>
      <StatusBar />
    </Container>
  )
}

const Container = styled.View`
  flex: 1;
  background-color: #ebecf3;
  padding-top: 64px;
  justify-content: center;
  align-items: center
`
const StatusBar = styled.StatusBar``;

const Header = styled.View`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100px;
  padding-top: 20px;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  background-color: #ffffff;
`

const BackButton = styled.TouchableOpacity`
  margin: 0 12px;
  padding: 0 22px;
  height: 48px;
  border-radius: 6px;
  justify-content: center;
`

const Content = styled.View`
  background-color: #fff;
  flex: 1;
  margin-top: 20px;
`;