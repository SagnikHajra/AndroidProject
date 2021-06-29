
import React, { useState } from "react";
import {
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity
} from "react-native";
import Text from "../../components/Text";
import { MaterialIcons } from '@expo/vector-icons'; 
import { SIZES, COLORS } from '../../../constants';

const AddListing = ({ navigation }) => {
    const features = [
        {
            id: 1,
            feature: "Restaurant",
            },
        {
            id: 2,
            feature: "School",
            },
        {
            id: 3,
            feature: "Hospital",
            },
        {
            id: 4,
            feature: "Motel",
            },
    ]
    

    return (
        <View style={{flex:1, flexDirection: 'column'}}>
            <View style={{flex:0.2, paddingTop: 50, flexDirection: 'column', borderBottomWidth:1,borderLeftWidth:1, borderRightWidth:1,borderBottomStartRadius:20,borderBottomEndRadius:20}}>
                    <MaterialIcons 
                        name="arrow-back"
                        size={30}
                        onPress={() => navigation.goBack()}
                        style={{paddingLeft: 20}}
                    />
                    <View style={{flex:0.3,alignItems:'center', justifyContent: 'center'}}>
                        <Text large>Add Dashboard Items</Text>
                    </View>
            </View>
            <View style={{flex:0.8, flexDirection:'column', paddingTop:10, alignItems: 'center', justifyContent: 'center',}}>
                <FlatList 
                    data={features}
                    renderItem={({ item }) => (
                        <View>
                            
                            <TouchableOpacity 
                                style={styles.listing}
                                onPress={() => navigation.navigate("FormItems", item)}
                            >
                            <MaterialIcons
                                name="add"
                                size={30}
                                color='blue'
                            />
                            <Text large  style={styles[item.id]}>{ item.feature }</Text>
                            </TouchableOpacity>
                                    
                        </View>
                    )}
                />
                
            </View>
        </View>
    );
}
 
export default AddListing;

const styles = StyleSheet.create({
    container: {
        flex: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },

    listing:{
        flexDirection: 'column',
        padding: SIZES.padding,
        paddingBottom: SIZES.padding * 2,
        backgroundColor:  COLORS.white,
        borderRadius: SIZES.radius,
        alignItems: "center",
        justifyContent: "center",
        marginRight: SIZES.padding,
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
    modalClose:{
        marginBottom: 10,
        borderWidth:1,
        borderColor: '#f01d71',
        padding: 10,
        borderRadius: 10,
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    back: {
        flexDirection: 'row'
    },
    dashboardItems:{
        paddingTop:30,
        alignItems:'center', 
        justifyContent: 'center', 
        flexDirection:'row'
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
    1:{color: 'red'}, 
    2:{color: 'dimgrey'},
    3:{color: 'blueviolet'},
    4:{color: 'darkorange'},
})
