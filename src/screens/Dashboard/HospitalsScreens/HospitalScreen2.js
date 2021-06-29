import { observer } from 'mobx-react';
import React, { useContext, useEffect, useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    ActivityIndicator
} from "react-native";
import { FirebaseContext } from "../../../context/FirebaseContext";
import { StoreContext } from "../../../context/StoreContext";
import { icons, images, SIZES, COLORS, FONTS } from '../../../../constants';


const HospitalScreen2 = ({ navigation }) => {
    const firebase = useContext(FirebaseContext);
    const [hospitalData, setHospitalsData] = useState(null);
    
    useEffect(() => {
        async function fetchData(){
            const data = await firebase.getListing({feature: 'hospital'});
            setHospitalsData(data);
        }
        fetchData();
    }, [])

    // const {hospital : hospital } = useContext(StoreContext);
    // Dummy Datas

    const initialCurrentLocation = {
        streetName: "Explore Hospital",
        gps: {
            latitude: 1.5496614931250685,
            longitude: 110.36381866919922
        }
    }

    const categoryData = [
        {
            id: 1,
            name: "Checkup",
            icon: icons.h_icon,
        },
        {
            id: 2,
            name: "Emergency",
            icon: icons.emer,
        },
        {
            id: 3,
            name: "Pathology",
            icon: icons.path,
        }
    ]

    // price rating
    const affordable = 1
    const expensive = 3

    const restaurantData = [
        {
            id: 1,
            name: "Texas Health Arlington hospital",
            rating: 4.8,
            categories: [1,2],
            priceRating: affordable,
            photo: "https://www.texashealth.org/-/media/Project/THR/shared/Header-Images/Header-Facility-Arlington.jpg?h=960&w=1920&hash=65709FD987ADE4BF3BC1DF94FF913767",
            duration: "Closed", //here variable can be assumed as for the open and close
            location: {
                latitude: 1.5347282806345879,
                longitude: 110.35632207358996,
            },
            courier: {
                avatar: images.avatar_1,
                name: "Amy"
            },
            menu: [
                {
                    menuId: 1,
                    name: "Texas Health Arlington hospital",
                    photo: "https://www.texashealth.org/-/media/Project/THR/shared/Widget-Images/Image-Box-Single-Column/Single-Column-Nurse-Patient-Masks-v2.jpg?h=415&w=560&hash=40694B32E64AF39041EED37E696D1C6A",
                    description: "The Texas Health Arlington hospital serves the communities of Arlington, Kennedale, Pantego, Mansfield & Grand Prairie"
                    
                }
            ]
        },
        {
            id: 2,
            name: "Virginia Hospital Center",
            rating: 4.8,
            categories: [2, 3],
            priceRating: expensive,
            photo: "https://www.vhcphysiciangroup.com/content/uploads/vhc2900-1.jpg",
            duration: "Closed",
            location: {
                latitude: 1.556306570595712,
                longitude: 110.35504616746915,
            },
            courier: {
                avatar: images.doct2,
                name: "Jackson"
            },
            menu: [
                {
                    menuId: 4,
                    name: "Virginia Hospital Center",
                    photo: "https://media.glassdoor.com/l/46/00/1f/a7/emergency-department.jpg",
                    description: "Virginia Hospital Center is committed to safe, high-quality healthcare and national accreditation"
                    
                }
            ]
        }


    ]

    
    if(hospitalData){
        // console.log(hospital)
        hospitalData.map((item) => {
            var imageData
            // Hard coding for images
            if(item.name){
                if(!item.images || item.images.length<=0){
                    console.log(item.images)
                    imageData = "https://revcycleintelligence.com/images/site/article_headers/_normal/hospital%2C_green.jpg"
                }else{
                    item.images.map((im,indx) => {
                        if(indx===0){
                            imageData = im
                        }
                    })
                }
                restaurantData.push(
                    {
                        id: item._id,
                        name: item.name,
                        rating: item.rating,
                        categories: [1,2],
                        priceRating: affordable,
                        photo: imageData
                        // photo: (item.images && item.images.length>0) && item.images.map((url) => (
                        //         <Image source={{ uri: url }}/>
                        //     ))
                        ,
                        duration: "Open", //here variable can be assumed as for the open and close
                        location: {
                            latitude: 1,
                            longitude:1,
                        },
                        courier: {
                            avatar: images.avatar_1,
                            name: "Amy"
                        },
                        menu: [
                            {
                                menuId: 1,
                                name: item.name,
                                photo: imageData,
                                description: item.desc
                            }
                        ]
                    }
                )
            }
        })
    }
    // console.log(restaurantData)
    
    // sleep time expects milliseconds
    // console.log("hospitalData111:",hospitalData)
    const [categories, setCategories] = React.useState(categoryData)
    const [selectedCategory, setSelectedCategory] = React.useState(null)
    const [restaurants, setRestaurants] = React.useState(restaurantData)
    const [currentLocation, setCurrentLocation] = React.useState(initialCurrentLocation)

    

    function onSelectCategory(category) {
        //filter restaurant
        let restaurantList = restaurantData.filter(a => a.categories.includes(category.id))

        setRestaurants(restaurantList)

        setSelectedCategory(category)
    }

    function getCategoryNameById(id) {
        let category = categories.filter(a => a.id == id)

        if (category.length > 0)
            return category[0].name

        return ""
    }

    function renderHeader() {
        return (
            <View style={{ flexDirection: 'row', height: 50 }}>
                <TouchableOpacity
                    style={{
                        width: 50,
                        paddingLeft: SIZES.padding * 2,
                        justifyContent: 'center'
                    }}
                    onPress={() => navigation.goBack()}
                >
                    <Image
                        source={icons.back}
                        resizeMode="contain"
                        style={{
                            width: 30,
                            height: 30
                        }}
                    />
                </TouchableOpacity>

                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View
                        style={{
                            width: '70%',
                            height: "100%",
                            backgroundColor: COLORS.lightGray3,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: SIZES.radius
                        }}
                    >
                        <Text style={{ ...FONTS.h3 }}>{currentLocation.streetName}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={{
                        width: 50,
                        paddingLeft: SIZES.padding * 2,
                        justifyContent: 'center',
                        marginRight:10
                    }}
                >
                    <Image
                        source={icons.nearby}
                        resizeMode="contain"
                        style={{
                            width: 30,
                            height: 30
                        }}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    function renderMainCategories() {
        const renderItem = ({ item }) => {
            return (
                <TouchableOpacity
                    style={{
                        padding: SIZES.padding,
                        paddingBottom: SIZES.padding * 2,
                        backgroundColor: (selectedCategory?.id == item.id) ? COLORS.primary : COLORS.white,
                        borderRadius: SIZES.radius,
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: SIZES.padding,
                        ...styles.shadow
                    }}
                    onPress={() => onSelectCategory(item)}
                >
                    <View
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: (selectedCategory?.id == item.id) ? COLORS.white : COLORS.lightGray
                        }}
                    >
                        <Image
                            source={item.icon}
                            resizeMode="contain"
                            style={{
                                width: 30,
                                height: 30
                            }}
                        />
                    </View>

                    <Text
                        style={{
                            marginTop: SIZES.padding,
                            color: (selectedCategory?.id == item.id) ? COLORS.white : COLORS.black,
                            ...FONTS.body5
                        }}
                    >
                        {item.name}
                    </Text>
                </TouchableOpacity>
            )
        }

        return (
            <View style={{ padding: SIZES.padding * 2 }}>
                <Text style={{ ...FONTS.h1 }}>Nearby</Text>
                <Text style={{ ...FONTS.h1 }}>Hospitals</Text>

                <FlatList
                    data={categories}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={item => `${item.id}`}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingVertical: SIZES.padding * 2 }}
                />
            </View>
        )
    }

    function renderRestaurantList() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                style={{ marginBottom: SIZES.padding * 2 }}
                onPress={() => navigation.navigate("HospitalDetail", {
                    item,
                    currentLocation
                })}
            >
                {/* Image */}
                <View
                    style={{
                        marginBottom: SIZES.padding
                    }}
                >
                    <Image
                        source={{ uri: item.photo }}
                        resizeMode="cover"
                        style={{
                            width: "100%",
                            height: 200,
                            borderRadius: SIZES.radius
                        }}
                    />

                    <View
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            height: 50,
                            width: SIZES.width * 0.3,
                            backgroundColor: COLORS.white,
                            borderTopRightRadius: SIZES.radius,
                            borderBottomLeftRadius: SIZES.radius,
                            alignItems: 'center',
                            justifyContent: 'center',
                            ...styles.shadow
                        }}
                    >
                        <Text style={{ ...FONTS.h4 }}>{item.duration}</Text>
                    </View>
                </View>

                {/* Restaurant Info */}
                <Text style={{ ...FONTS.body2 }}>{item.name}</Text>

                <View
                    style={{
                        marginTop: SIZES.padding,
                        flexDirection: 'row'
                    }}
                >
                    {/* Rating */}
                    <Image
                        source={icons.star}
                        style={{
                            height: 20,
                            width: 20,
                            tintColor: COLORS.primary,
                            marginRight: 10
                        }}
                    />
                    <Text style={{ ...FONTS.body3 }}>{item.rating}</Text>

                                    </View>
            </TouchableOpacity>
        )
        
        return (
            <FlatList
                data={restaurants}
                keyExtractor={item => `${item.id}`}
                renderItem={renderItem}
                contentContainerStyle={{
                    paddingHorizontal: SIZES.padding * 2,
                    paddingBottom: 30
                }}
            />
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            {renderHeader()}
            {renderMainCategories()}
            {hospitalData? renderRestaurantList() : <ActivityIndicator size="large" color="#00ff00" />}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop:30,
        flex: 1,
        backgroundColor: COLORS.lightGray4
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 1,
    }
})

export default observer(HospitalScreen2);
