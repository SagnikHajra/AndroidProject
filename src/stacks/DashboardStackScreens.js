import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// import BlogStackScreens from './BlogStackScreens';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import HospitalScreen2 from '../screens/Dashboard/HospitalsScreens/HospitalScreen2';
import HospitalDetail2 from '../screens/Dashboard/HospitalsScreens/HospitalDetail2';
import RestaurantsScreen from '../screens/Dashboard/RestaurantScreen/RestaurantsScreen';
import RestaurantDetailScreen from '../screens/Dashboard/RestaurantScreen/RestaurantDetailScreen';
import MotelsScreen from '../screens/Dashboard/MotelsScreen/MotelsScreen';
import MotelDetailScreen from '../screens/Dashboard/MotelsScreen/MotelDetailScreen';
import SchoolsScreen from '../screens/Dashboard/SchoolsScreen/SchoolsScreen';
import SchoolDetailScreen from '../screens/Dashboard/SchoolsScreen/SchoolDetailScreen';
// import LocationScreen from '../screens/Dashboard/LocationScreen';
// import FriendsLocationScreen from '../screens/FriendsLocationScreen';
import AddListing from '../screens/Dashboard/AddListing';
import FormItems from '../screens/Dashboard/FormItems';
// import UserScreen from '../screens/Dashboard/UserLocation';

export default DashboardStackScreens = () => {

    const MainStack = createStackNavigator();

    return (
        <MainStack.Navigator headerMode="none">
            <MainStack.Screen name="Dashboard" component={DashboardScreen}/>
            <MainStack.Screen name="Hospitals" component={HospitalScreen2} />
            <MainStack.Screen name="HospitalDetail" component={HospitalDetail2} />
            <MainStack.Screen name="Restaurants" component={RestaurantsScreen} />
            <MainStack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
            <MainStack.Screen name="Motels" component={MotelsScreen} />
            <MainStack.Screen name="MotelDetail" component={MotelDetailScreen} />
            <MainStack.Screen name="Schools" component={SchoolsScreen} />
            <MainStack.Screen name="SchoolDetail" component={SchoolDetailScreen} />
            {/* <MainStack.Screen name="Location" component={LocationScreen} /> */}
            <MainStack.Screen name="AddListing" component={AddListing} />
            <MainStack.Screen name="FormItems" component={FormItems} />
            {/* <MainStack.Screen name="FriendsLocation" component={FriendsLocationScreen} /> */}
            {/* <MainStack.Screen name="Feed" component={BlogStackScreens} /> */}
        </MainStack.Navigator>
    );
};
