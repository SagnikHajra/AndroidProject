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
// import { StoreContext } from "../../../context/StoreContext";
import { icons, images, SIZES, COLORS, FONTS } from '../../../../constants';

const SchoolsScreen = ({ navigation }) => {
    const firebase = useContext(FirebaseContext);
    const [schoolData, setSchoolData] = useState(null);
    
    useEffect(() => {
        async function fetchData(){
            const data = await firebase.getListing({feature: 'school'});
            setSchoolData(data);
        }
        fetchData();
    }, [])
    // Dummy Datas

    const initialCurrentLocation = {
        streetName: "Explore Schools",
        gps: {
            latitude: 1.5496614931250685,
            longitude: 110.36381866919922
        }
    }

    const categoryData = [
        {
            id: 1,
            name: "Colleges",
            icon: icons.college,
        },
        {
            id: 2,
            name: "University",
            icon: icons.univ,
        },
        {
            id: 3,
            name: "Kindergarden",
            icon: icons.kinder,
        }
    ]

    // price rating
    const affordable = 1
    const expensive = 3

    const restaurantData = [
        {
            id: 1,
            name: "The University Of Texas At Arlington",
            rating: 4.8,
            categories: [1,2],
            priceRating: affordable,
            photo: "https://cdn.web.uta.edu/-/media/project/website/news/releases/2020/09/tower---reverse-angle.ashx?revision=af79b89f-1f16-47a6-b8f3-91940ab85d3b",
            duration: "Open",
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
                    name: "The University Of Texas At Arlington",
                    photo: "https://www.utacollegepark.com/_img/home-feature-defaults/about-the-center.jpg",
                    description: "Founded in 1895, The University of Texas at Arlington is a Carnegie Research 1 institution with more than 100 years of academic excellence",
                    calories: 200,
                    price: 10
                }
            ]
        },
        {
            id: 2,
            name: "WAKEFIELD HIGH SCHOOL",
            rating: 4.8,
            categories: [1],
            priceRating: expensive,
            photo: "https://s26551.pcdn.co/wp-content/uploads/2013/08/Wakefield-preview10.jpg",
            duration: "Closed",
            location: {
                latitude: 1.556306570595712,
                longitude: 110.35504616746915,
            },
            courier: {
                avatar: images.avatar_2,
                name: "Jackson"
            },
            menu: [
                {
                    menuId: 4,
                    name: "WAKEFIELD HIGH SCHOOL",
                    photo: "https://s26551.pcdn.co/wp-content/uploads/2013/08/Wakefield-preview10.jpg",
                    description: "Wakefield maintains a high standard of learning for all students that effectively prepares all students for graduation",
                    calories: 250,
                    price: 15
                }
            ]
        }


    ]


    if(schoolData){
        schoolData.map((item) => {
            var imageData
            // Hard coding for images
            if(item.name){
                if(!item.images || item.images.length<=0){
                    // console.log(item.images)
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
                            longitude: 1,
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
                <Text style={{ ...FONTS.h1 }}>Education</Text>
                <Text style={{ ...FONTS.h1 }}>Nearby</Text>

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

                    {/* Categories */}
                    <View
                        style={{
                            flexDirection: 'row',
                            marginLeft: 10
                        }}
                    >
                        {
                            item.categories.map((categoryId) => {
                                return (
                                    <View
                                        style={{ flexDirection: 'row' }}
                                        key={categoryId}
                                    >
                                        <Text style={{ ...FONTS.body3 }}>{getCategoryNameById(categoryId)}</Text>
                                        <Text style={{ ...FONTS.h3, color: COLORS.darkgray }}> . </Text>
                                    </View>
                                )
                            })
                        }

                        {/* Price */}
                        {
                            [1, 2, 3].map((priceRating) => (
                                <Text
                                    key={priceRating}
                                    style={{
                                        ...FONTS.body3,
                                        color: (priceRating <= item.priceRating) ? COLORS.black : COLORS.darkgray
                                    }}
                                >$</Text>
                            ))
                        }
                    </View>
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
            {schoolData? renderRestaurantList(): <ActivityIndicator size="large" color="#00ff00" />}
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

export default observer(SchoolsScreen);