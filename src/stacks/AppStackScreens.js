import React, { useContext, useEffect } from "react";
import { LogBox } from "react-native"
import { createStackNavigator } from "@react-navigation/stack";
import { observer } from 'mobx-react'

// import { UserContext } from "../context/UserContext";
import { StoreContext } from "../context/StoreContext";
import { FirebaseContext } from "../context/FirebaseContext";

import AuthStackScreens from "./AuthStackScreens";
import MainStackScreens from "./MainStackScreens";
import LoadingScreen from "../screens/LoadingScreen";

const AppStackScreens = () => {
    const AppStack = createStackNavigator();
    // const [user] = useContext(UserContext);
    const {user: { user, isFirebaseInit, setUser }} = useContext(StoreContext);
    const firebase = useContext(FirebaseContext);

    useEffect(() => {
        // console.disableYellowBox = true;
        LogBox.ignoreAllLogs(true)
        if(isFirebaseInit) firebase.onAuthStateChanged(onAuthStateChanged)
    }, [isFirebaseInit])

    const onAuthStateChanged = async (authUser) => {
        // console.log("aaaa", authUser)
        if (authUser != null) {
            // console.log("onAuthStateChanged", authUser.uid)
            if(authUser.uid) {
                const userInfo = await firebase.getUserInfo(authUser.uid)
                setUser({
                    ...userInfo,
                    username: userInfo.username,
                    email: userInfo.email,
                    uid: authUser.uid,
                    profilePhotoUrl: userInfo.profilePhotoUrl,
                    dob: userInfo.dob || '',
                    gender: userInfo.gender || '',
                    phonenumber: userInfo.phonenumber || '',
                    isLoggedIn: true,
                })
          } else {
            setUser({ username: "", email: "", uid: "", isLoggedIn: false, profilePhotoUrl: "default" });
          }
        } else {
          setUser({ username: "", email: "", uid: "", isLoggedIn: false, profilePhotoUrl: "default" });
        }
    };

    return (
        <AppStack.Navigator headerMode="none">
            {user.isLoggedIn === null ? (
                <AppStack.Screen name="Loading" component={LoadingScreen} />
            ) : user.isLoggedIn ? (
                <AppStack.Screen name="Main" component={MainStackScreens} />
            ) : (
                <AppStack.Screen name="Auth" component={AuthStackScreens} />
            )}
        </AppStack.Navigator>
    );
};

export default observer(AppStackScreens)