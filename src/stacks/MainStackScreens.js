import React, { useEffect, useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { getGeofire } from "../config/geofire"
import { StoreContext } from "../context/StoreContext";
import { getCurrentLocation } from "../utils"

import HomeScreen from "../screens/HomeScreen";
import MessageScreen from "../screens/MessageScreen";
import MessageChatScreen from "../screens/MessageChatScreen";
import PostScreen from "../screens/PostScreen";
import PeopleScreen from "../screens/PeopleScreen";
import FriendsLocationScreen from "../screens/FriendsLocationScreen";
import FriendsScreen from "../screens/FriendsScreen";
import NotificationScreen from "../screens/NotificationScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ProfileEditScreen from "../screens/ProfileEditScreen";
import ImageModalScreen from "../screens/ImageModalScreen"
import DashboardStackScreens from "./DashboardStackScreens";

const HomeStackScreens = () => {
    const HomeStack = createStackNavigator();
    return (
        <HomeStack.Navigator headerMode="none">
            <HomeStack.Screen name="Main" component={HomeScreen} />
            <HomeStack.Screen name="MessageStack" component={MessageStackScreens} />
        </HomeStack.Navigator>
    )
} 

const MessageStackScreens = () => {
    const MessageStack = createStackNavigator();
    return (
        <MessageStack.Navigator headerMode="none">
            <MessageStack.Screen name="Message" component={MessageScreen} />
            <MessageStack.Screen name="MessageChat" component={MessageChatScreen} />
        </MessageStack.Navigator>
    )
}

const PostStackScreens = () => {
    const PostStack = createStackNavigator();
    return (
        <PostStack.Navigator headerMode="none" mode="modal">
            <PostStack.Screen name="Post" component={PostScreen} />
            <PostStack.Screen name="PostImageModal" component={ImageModalScreen} />
        </PostStack.Navigator>
    )
}

const ProfileStackScreens = () => {
    const ProfileStack = createStackNavigator();
    return (
        <ProfileStack.Navigator headerMode="none">
            <ProfileStack.Screen name="Profile" component={ProfileScreen} />
            <ProfileStack.Screen name="ProfileEdit" component={ProfileEditScreen} />
            <ProfileStack.Screen name="Friends" component={FriendsScreen} />
            <ProfileStack.Screen name="FriendsLocation" component={FriendsLocationScreen} />
        </ProfileStack.Navigator>
    )
}

export default MainStackScreens = () => {
    const { user: {user} } = useContext(StoreContext);

    useEffect(() => {
        // Set/Update user location
        // get user current location
        (async()=>{
            const location = await getCurrentLocation()
            if(!!location) {
                let coordinates = {}
                coordinates[user.uid] = [location.latitude, location.longitude]
                const geofireInstance = await getGeofire()
                geofireInstance.set(coordinates)
            }
        })();
    }, [])

    const MainStack = createBottomTabNavigator();

    const tabBarOptions = {
        showLabel: false,
        style: {
            backgroundColor: "#800080",
            paddingBototm: 12,
        },
    };

    const screenOptions = ({ route }) => ({
        tabBarIcon: ({ focused }) => {
            let iconName = "ios-home";

            switch (route.name) {
                case "Home":
                    iconName = "ios-home";
                    break;

                case "MessageStack":
                    iconName = "ios-chatbox";
                    break;

                case "Notification":
                    iconName = "ios-notifications";
                    break;

                case "People":
                    iconName = "ios-people";
                    break;

                case "ProfileStack":
                    iconName = "ios-person";
                    break;

                case "Dashboard":
                    iconName = "ios-grid";
                    break;

                default:
                    iconName = "ios-home";
            }

            if (route.name === "PostStack") {
                return (
                    <Ionicons
                        name="ios-add-circle"
                        size={48}
                        color="#23a8d9"
                        style={{
                            shadowColor: "#23a8d9",
                            shadowOffset: { width: 0, height: 10 },
                            shadowRadius: 10,
                            shadowOpacity: 0.3,
                        }}
                    />
                );
            }

            return <Ionicons name={iconName} size={24} color={focused ? "#ffffff" : "#666666"} />;
        },
    });

    return (
        <MainStack.Navigator tabBarOptions={tabBarOptions} screenOptions={screenOptions}>
            <MainStack.Screen name="Home" component={HomeStackScreens} />
            <MainStack.Screen name="People" component={PeopleScreen} />
            <MainStack.Screen name="PostStack" component={PostStackScreens} />
            {/* <MainStack.Screen name="Notification" component={NotificationScreen} /> */}
            <MainStack.Screen name="Dashboard" component={DashboardStackScreens} />
            <MainStack.Screen name="ProfileStack" component={ProfileStackScreens} />
        </MainStack.Navigator>
    );
};
