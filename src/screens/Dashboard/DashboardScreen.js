import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import Text from "../../components/Text";
import { icons, images, SIZES, COLORS, FONTS } from '../../../constants';

const DashboardScreen = ({navigation}) => {
    const renderDashboardItem = (item) => {
        return (
            <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate(item.name)}>
                <View style={styles.icon}>
                    <item.font />
                    <Text medium bold center color="#8022d9" >{item.name}</Text>
                </View>
            </TouchableOpacity>);
    }

    return (
        <View>
		<ScrollView>
        <View style={{ padding: SIZES.padding * 2, marginTop:40 }}>
                <Text style={{ ...FONTS.h1 }}>Dashboard</Text>
                <Text style={{ ...FONTS.h1 }}>Explore!</Text>
        </View>
        <View style={styles.Grid}>
            <TouchableOpacity
                        style={{
                            padding: SIZES.padding,
                            paddingBottom: SIZES.padding * 2,
                            backgroundColor:  COLORS.white,
                            borderRadius: SIZES.radius,
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: SIZES.padding,
                            ...styles.shadow
                        }}
                        onPress={() => {navigation.navigate("Hospitals")}}
                    >
                        <View
                            style={{
                                width: 150,
                                height: 150,
                                borderRadius: 25,
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: COLORS.lightGray,
                                ...styles.g_item
                            }}
                        >
                            <Image
                                source={images.h_icon}
                                resizeMode="contain"
                                style={{
                                    width: 100,
                                    height: 100
                                }}
                            />
                        </View>

                        <Text
                            style={{
                                marginTop: SIZES.padding,
                                color:  COLORS.black,
                                ...FONTS.body5
                            }}
                        >
                            Hospital
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            padding: SIZES.padding,
                            paddingBottom: SIZES.padding * 2,
                            backgroundColor:  COLORS.white,
                            borderRadius: SIZES.radius,
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: SIZES.padding,
                            ...styles.shadow
                        }}
                        onPress={() => {{navigation.navigate("Schools")}}}
                    >
                        <View
                            style={{
                                width: 150,
                                height: 150,
                                borderRadius: 25,
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: COLORS.lightGray,
                                ...styles.g_item
                            }}
                        >
                            <Image
                                source={images.school}
                                resizeMode="contain"
                                style={{
                                    width: 100,
                                    height: 100
                                }}
                            />
                        </View>

                        <Text
                            style={{
                                marginTop: SIZES.padding,
                                color:  COLORS.black,
                                ...FONTS.body5
                            }}
                        >
                            Schools
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            padding: SIZES.padding,
                            paddingBottom: SIZES.padding * 2,
                            backgroundColor:  COLORS.white,
                            borderRadius: SIZES.radius,
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: SIZES.padding,
                            ...styles.shadow
                        }}
                        onPress={() => {{navigation.navigate("Motels")}}}
                    >
                        <View
                            style={{
                                width: 150,
                                height: 150,
                                borderRadius: 25,
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: COLORS.lightGray,
                                ...styles.g_item
                            }}
                        >
                            <Image
                                source={images.motel}
                                resizeMode="contain"
                                style={{
                                    width: 100,
                                    height: 100
                                }}
                            />
                        </View>

                        <Text
                            style={{
                                marginTop: SIZES.padding,
                                color:  COLORS.black,
                                ...FONTS.body5
                            }}
                        >
                            Motels
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            padding: SIZES.padding,
                            paddingBottom: SIZES.padding * 2,
                            backgroundColor:  COLORS.white,
                            borderRadius: SIZES.radius,
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: SIZES.padding,
                            ...styles.shadow
                        }}
                        onPress={() => {{navigation.navigate("Restaurants")}}}
                    >
                        <View
                            style={{
                                width: 150,
                                height: 150,
                                borderRadius: 25,
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: COLORS.lightGray,
                                ...styles.g_item
                            }}
                        >
                            <Image
                                source={images.res}
                                resizeMode="contain"
                                style={{
                                    width: 100,
                                    height: 100
                                }}
                            />
                        </View>

                        <Text
                            style={{
                                marginTop: SIZES.padding,
                                color:  COLORS.black,
                                ...FONTS.body5
                            }}
                        >
                            Restaurant
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            padding: SIZES.padding,
                            paddingBottom: SIZES.padding * 2,
                            backgroundColor:  COLORS.white,
                            borderRadius: SIZES.radius,
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: SIZES.padding,
                            ...styles.shadow
                        }}
                        onPress={() => {{navigation.navigate("AddListing")}}}
                    >
                        <View
                            style={{
                                width: 150,
                                height: 150,
                                borderRadius: 25,
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: COLORS.lightGray,
                                ...styles.g_item
                            }}
                        >
                            <Image
                                source={icons.addToList}
                                resizeMode="contain"
                                style={{
                                    width: 100,
                                    height: 100
                                }}
                            />
                        </View>

                        <Text
                            style={{
                                marginTop: SIZES.padding,
                                color:  COLORS.black,
                                ...FONTS.body5
                            }}
                        >
                            Add a New 
                        </Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity	
                        style={{	
                            padding: SIZES.padding,	
                            paddingBottom: SIZES.padding * 2,	
                            backgroundColor:  COLORS.white,	
                            borderRadius: SIZES.radius,	
                            alignItems: "center",	
                            justifyContent: "center",	
                            marginRight: SIZES.padding,	
                            ...styles.shadow	
                        }}	
                        onPress={() => {{navigation.navigate("FriendsLocation")}}}	
                    >	
                        <View	
                            style={{	
                                width: 150,	
                                height: 150,	
                                borderRadius: 25,	
                                alignItems: "center",	
                                justifyContent: "center",	
                                backgroundColor: COLORS.lightGray,	
                                ...styles.g_item	
                            }}	
                        >	
                            <Image	
                                source={images.location2}	
                                resizeMode="contain"	
                                style={{	
                                    width: 100,	
                                    height: 100	
                                }}	
                            />	
                        </View>	
                        <Text	
                            style={{	
                                marginTop: SIZES.padding,	
                                color:  COLORS.black,	
                                ...FONTS.body5	
                            }}	
                        >	
                            NearBy Friends!	
                        </Text>	
                    </TouchableOpacity> */}
                </View>
			</ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    Grid:{
      flexDirection:'row',
      alignContent:'center',
      justifyContent:'center',
      flexWrap:'wrap'
    },
    gridItem:{
        flex:1,
        margin:9,
        height:90,
        width: 200,
        borderWidth: 1,
        borderColor: 'lightgrey',
        borderRadius: 10,
        marginHorizontal: 4,
        marginVertical: 6,
        justifyContent: 'center',
    },

    icon:{
        alignItems: 'center',
    },
    text:{
        marginTop:5,
        color: "black",
        fontWeight: 'bold'
    },
    shadow: {
      borderTopColor:COLORS.primary,
      marginTop:20,
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 3,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 1,
  },
  g_item:{
    width:180
  }
})


export default DashboardScreen;
