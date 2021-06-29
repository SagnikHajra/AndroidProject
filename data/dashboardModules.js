import React from 'react'; 
import { FontAwesome, Fontisto, MaterialIcons } from 'react-native-vector-icons';

export const dashboardItems = [{
    id:"1",
    name: "Feed",
    font: () => {
        return(
            <FontAwesome 
                name="feed"
                size={30} 
                color="#ee82ee"
            />
        )
    }
},
{
    id:"2",
    name: "Hospitals",
    font: () => {
        return(
            <Fontisto 
                name="first-aid-alt"
                size={30} 
                color="hotpink"
            />
        )
    }
},
{
    id:"3",
    name: "Restaurants",
    font: () => {
        return(
            <MaterialIcons 
                name="restaurant"
                size={30} 
                color="salmon"
            />
        )
    }
},
{
    id:"4",
    name: "Schools",
    font: () => {
        return(
            <MaterialIcons 
                name="school"
                size={30} 
                color="chocolate"
            />
        )
    }
},
{
    id:"5",
    name: "Location",
    font: () => {
        return(
            <MaterialIcons 
                name="location-on"
                size={30} 
                color="gray"
            />
        )
    }
},
{
    id:"6",
    name: "Motels",
    font: () => {
        return(
            <MaterialIcons 
                name="hotel"
                size={30} 
                color="skyblue"
            />
        )
    }
}];
