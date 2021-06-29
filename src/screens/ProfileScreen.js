import React, { useContext, useEffect } from "react";

import { observer } from 'mobx-react';
import styled from "styled-components";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import { Alert, StyleSheet, View } from 'react-native';
// import { UserContext } from "../context/UserContext";
import { StoreContext } from "../context/StoreContext";
import { FirebaseContext } from "../context/FirebaseContext";

import Text from "../components/Text";

const ProfileScreen = (props) => {
    const {user: {user, logoutUser, setUser}, friends: {friends}} = useContext(StoreContext);
    // const [user, setUser] = useContext(UserContext);
    const firebase = useContext(FirebaseContext);

    useEffect(() => {
        firebase.getFriendsList()
      }, [])

    const logOut = async () => {
        setUser({...user, isLoggedIn: null})
        const loggedOut = await firebase.logOut();

        if (loggedOut) {
            logoutUser()
            // setUser((state) => ({ ...state, isLoggedIn: false }));
        }
    };

    return (
<MainContainer>
<Container>
<View style={styles.parent}>
     <View style={styles.child}>
          
			<ProfilePhotoContainer>
                <ProfilePhoto
                    source={
                        user.profilePhotoUrl === "default"
                            ? require("../../assets/defaultProfilePhoto.jpg")
                            : { uri: user.profilePhotoUrl }
                    }
                />
            </ProfilePhotoContainer>
			<Text medium bold margin="16px 0 0px 0" color = "#FFFFFF">
                {user.username}
            </Text><EditBtn onPress={() => props.navigation.navigate('ProfileEdit')}>
                <Entypo name="edit" size={24} color="black" />
            </EditBtn>     
			<Text margin="8px 0 32px 0" color = "#FFFFFF">
                {(user.city && user.state) &&
                    `${user.city}, ${user.state}`
                }
            </Text>
			<StatsContainer>
                <StatContainer>
                    <Text large light color = "#FFFFFF">
                        21
                    </Text>
                    <Text small bold color="#ffffff">
                        Posts
                    </Text>
                </StatContainer>
                <StatContainer>
                    <FriendsScreen onPress={() => props.navigation.navigate('Friends')}>
                        <Text large light color = "#FFFFFF">
                            {friends.length}
                        </Text>
                        <Text small bold color="#ffffff">
                            Friends
                        </Text>
                    </FriendsScreen> 
                </StatContainer>
                <StatContainer>
                    <FriendsScreen 
                        onPress={() => props.navigation.navigate('FriendsLocation')}>
                        <FontAwesome5 name="map-marked" size={24} color="#FFFFFF" style={{marginBottom: 5}} />
                        <Text small bold color="#ffffff">
                            Friends Near Me
                        </Text>
                    </FriendsScreen>
                </StatContainer>
            </StatsContainer>
	 
	</View>
</View>
</Container>
<NextContainer>
<Button onPress={logOut}>
                <Text bold center color="#ffffff">LogOut</Text>
              </Button>
       
</NextContainer>
</MainContainer>        
    );
};

export default observer(ProfileScreen)

const MainContainer = styled.View`
  background-color: #FFFFFF;
  width: 100%
  height: 100%
`;

const Container = styled.View`
  background-color: #FFFFFF;
  width: 100%
  height: 90%
`;
const NextContainer = styled.View`
  background-color: #FFFFFF;
  width: 100%
  height: 10%
`;

const Button = styled.TouchableOpacity`
  margin: 0 32px;
  height: 48px;
  align-items: center;
  justify-content: center;
  background-color: #9370DB;
  border-radius: 6px;
`;
const styles = StyleSheet.create({
    parent : {
        height : '55%',
        width : '100%',
        transform : [ { scaleX : 2 } ],
        borderBottomStartRadius : 200,
        borderBottomEndRadius : 200,
        overflow : 'hidden',
    },
    child : {
        flex : 1,
        transform : [ { scaleX : 0.5 } ],

        backgroundColor : '#9370DB',
        alignItems : 'center',
        justifyContent : 'center'
    }
});


const ProfilePhotoContainer = styled.View`
    shadow-opacity: 0.8;
    shadow-radius: 30px;
    shadow-color: #222222;
`;

const ProfilePhoto = styled.Image`
    width: 128px;
    height: 128px;
    border-radius: 64px;
`;

const StatsContainer = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin: 0 32px;
    flex: 1;
`;

const StatContainer = styled.View`
    align-items: center;
    flex: 1;
`;

const FriendsScreen = styled.TouchableOpacity`
    align-items: center;
`;

const Logout = styled.TouchableOpacity`
    margin-bottom: 32px;
`;

const EditBtn = styled.TouchableOpacity`
    margin: 0 6px;
    padding: 0 12px;
    height: 48px;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    position: absolute;
    right: 10px;
    top: 0px
`;
