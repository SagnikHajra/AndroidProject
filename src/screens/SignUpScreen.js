import React, { useContext, useState } from "react";
import { Platform, ScrollView, Dimensions } from "react-native";
import styled from "styled-components";
import { AntDesign } from "@expo/vector-icons";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { useForm, Controller } from "react-hook-form";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment'

import { FirebaseContext } from "../context/FirebaseContext";
// import { UserContext } from "../context/UserContext";
import { StoreContext } from "../context/StoreContext";

import Text from "../components/Text";
import CustomModal from "../components/CustomModal";

const window = Dimensions.get('window')
const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
const passReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
const usernameReg = /^[A-Za-z0-9]{5,}$/

export default SignUpScreen = ({ navigation }) => {
    const { handleSubmit, watch, errors, control } = useForm();
    const [showCal, setShowCal] = useState(false)
    const [dob, setDOB] = useState(null)
    const [showGenderModal, setShowGenderModal] = useState(false)
    const [gender, setGender] = useState(null)
    const [loading, setLoading] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState();
    const firebase = useContext(FirebaseContext);
    const {user: {setUser}} = useContext(StoreContext);
    // const [_, setUser] = useContext(UserContext);

    const getPermission = async () => {
        if (Platform.OS !== "web") {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

            return status;
        }
    };

    const toggleCal = () => setShowCal(!showCal)
    const toggleGenderModal = () => setShowGenderModal(!showGenderModal)

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.cancelled) {
                setProfilePhoto(result.uri);
            }
        } catch (error) {
            console.log("Error @pickImage: ", error);
        }
    };

    const addProfilePhoto = async () => {
        const status = await getPermission();

        if (status !== "granted") {
            alert("We need permission to access your camera roll.");

            return;
        }

        pickImage();
    };

    const onDateChange  = (date) => {
        setDOB(moment(date).format('MM-DD-YYYY'))
        toggleCal()
    }

    const signUp = async (data) => {
        
        setLoading(true);

        const { username, email, password, phonenumber, city, country } = data
        const user = { username, email, password, phonenumber, city, country, dob, gender, profilePhoto };

        try {
            const createdUser = await firebase.createUser(user);

            setUser({ ...createdUser, isLoggedIn: true });
        } catch (error) {
            console.log("Error @signUp: ", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAwareScrollView
            resetScrollToCoords={{x: 0, y: 0}}
            contentContainerStyle={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                backgroundColor: '#F3F5F9',
              }}
            scrollEnabled={false}
        >
            <Container>
                <ScrollView>
                    <Wapper>
                        <Main>
                            <Text title semi center>
                                Sign up to get started.
                            </Text>
                        </Main>

                        <ProfilePhotoContainer onPress={addProfilePhoto}>
                            {profilePhoto ? (
                                <ProfilePhoto source={{ uri: profilePhoto }} />
                            ) : (
                                <DefaultProfilePhoto>
                                    <AntDesign name="plus" size={24} color="#ffffff" />
                                </DefaultProfilePhoto>
                            )}
                        </ProfilePhotoContainer>

                        <Auth>
                            <AuthContainer>
                                <AuthTitle>Username</AuthTitle>
                                <Controller
                                    control={control}
                                    name='username'
                                    rules={{ required: true, validate:(value) => usernameReg.test(value) }}
                                    defaultValue=""
                                    render={({ onChange, value }) => (
                                        <AuthField
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            autoFocus={true}
                                            onChangeText={(username) => onChange(username.trim())}
                                            value={value}
                                        />
                                    )}
                                />
                                {errors.username? <Text tiny color={'red'}>{'Alteast 5 alphanumeric chars'}</Text> : null}
                            </AuthContainer>

                            <AuthContainer>
                                <AuthTitle>Email Address</AuthTitle>
                                <Controller
                                    control={control}
                                    name='email'
                                    rules={{ required: true, validate:(value) => emailReg.test(value) }}
                                    defaultValue=""
                                    render={({ onChange, value }) => (
                                        <AuthField
                                            autoCapitalize="none"
                                            autoCompleteType="email"
                                            autoCorrect={false}
                                            keyboardType="email-address"
                                            onChangeText={(email) => onChange(email.trim())}
                                            value={value}
                                        />
                                        )}
                                    />
                                    {errors.email? <Text tiny color={'red'}>{'Invalid Email address'}</Text> : null}
                            </AuthContainer>

                            <AuthContainer>
                                <AuthTitle>Password</AuthTitle>
                                <Controller
                                    control={control}
                                    name='password'
                                    rules={{ required: true, validate:(value) => passReg.test(value) }}
                                    defaultValue=""
                                    render={({ onChange, value }) => (
                                        <AuthField
                                            autoCapitalize="none"
                                            autoCompleteType="password"
                                            autoCorrect={false}
                                            secureTextEntry={true}
                                            onChangeText={(password) => onChange(password.trim())}
                                            value={value}
                                        />
                                    )}
                                />
                                {errors.password? <Text tiny color={'red'}>{'Atleast 8 chars including one uppercase letter, one lowercase letter, one number and special character.'}</Text> : null}
                            </AuthContainer>

                            <AuthContainer>
                                <AuthTitle>Confirm Password</AuthTitle>
                                <Controller
                                    control={control}
                                    name='confirmPassword'
                                    rules={{ validate: (value) => value === watch('password') }}
                                    defaultValue=""
                                    render={({ onChange, value }) => (
                                        <AuthField
                                            autoCapitalize="none"
                                            autoCompleteType="password"
                                            autoCorrect={false}
                                            secureTextEntry={true}
                                            onChangeText={(value) => onChange(value.trim())}
                                            value={value}
                                        />
                                    )}
                                />
                                {errors.confirmPassword? <Text tiny color={'red'}>{'Confirm password must match with password'}</Text> : null}
                            </AuthContainer>

                            <AuthContainer>
                                <AuthTitle>Phone Number</AuthTitle>
                                <Controller
                                    control={control}
                                    name='phonenumber'
                                    rules={{ maxLength: 12 }}
                                    defaultValue=""
                                    render={({ onChange, value }) => (
                                        <AuthField
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            onChangeText={(value) => onChange(value.trim())}
                                            value={value}
                                        />
                                    )}
                                />
                                {errors.phonenumber? <Text tiny color={'red'}>{'Phone number should not exceed 12 numbers'}</Text> : null}
                            </AuthContainer>

                            <AuthContainer>
                                <AuthTitle>Home country</AuthTitle>
                                <Controller
                                    control={control}
                                    name='country'
                                    rules={{ maxLength: 25, required: true }}
                                    defaultValue=""
                                    render={({ onChange, value }) => (
                                        <AuthField
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            onChangeText={(value) => onChange(value.trim())}
                                            value={value}
                                        />
                                    )}
                                />
                                {errors.country? <Text tiny color={'red'}>{'This field is required'}</Text> : null}
                            </AuthContainer>

                            <AuthContainer>
                                <AuthTitle>City</AuthTitle>
                                <Controller
                                    control={control}
                                    name='city'
                                    rules={{ maxLength: 25, required: true }}
                                    defaultValue=""
                                    render={({ onChange, value }) => (
                                        <AuthField
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            onChangeText={(value) => onChange(value.trim())}
                                            value={value}
                                        />
                                    )}
                                />
                                {errors.city? <Text tiny color={'red'}>{'This field is required'}</Text> : null}
                            </AuthContainer>

                            <AuthContainer>
                                <AuthTitle>DOB</AuthTitle>
                                <AuthTouchField onPress={toggleCal}>
                                    {dob &&
                                        <Text small>{dob}</Text>
                                    }
                                </AuthTouchField>
                                {showCal &&
                                    <CalendarPicker
                                        width={window.width-50}
                                        onDateChange={onDateChange}
                                        maxDate={new Date()}
                                    />
                                }
                            </AuthContainer>
                            <AuthContainer>
                                <AuthTitle>Gender</AuthTitle>
                                <AuthTouchField onPress={toggleGenderModal}>
                                    {gender &&
                                        <Text small>{gender}</Text>
                                    }
                                </AuthTouchField>
                            </AuthContainer>

                        </Auth>

                        <SignUpContainer onPress={handleSubmit(signUp)} disabled={loading}>
                            {loading ? (
                                <Loading />
                            ) : (
                                <Text bold center color="#ffffff">
                                    Sign Up
                                </Text>
                            )}
                        </SignUpContainer>

                        <SignIn onPress={() => navigation.navigate("SignIn")}>
                            <Text small center>
                                Already have an account?{" "}
                                <Text bold color="#8022d9">
                                    Sign In
                                </Text>
                            </Text>
                        </SignIn>
                    </Wapper>
                </ScrollView>
                <CustomModal 
                    visible={showGenderModal}
                    dismissModal={toggleGenderModal}
                    title={'Select Gender'}
                    styles={{
                        modalOverlay: {
                            backgroundColor: 'rgba(0, 0, 0, 0.5)'
                        },
                        modalMain: {
                            backgroundColor:'#fff'
                        }
                    }}
                >
                    <ListItem onPress={()=>{setGender('Male');toggleGenderModal()}}><Text>{'Male'}</Text></ListItem>
                    <ListItem style={{borderBottomWidth:0}} onPress={()=>{setGender('Female');toggleGenderModal()}}><Text>{'Female'}</Text></ListItem>
                </CustomModal>
                <HeaderGraphic>
                    <RightCircle />
                    <LeftCircle />
                </HeaderGraphic>
                <StatusBar barStyle="light-content" />
            </Container>
        </KeyboardAwareScrollView>
    );
};

const Container = styled.View`
    flex: 1;
    width: 100%;
`;

const Wapper = styled.View`
    padding-bottom: 40px;
`;

const Main = styled.View`
    margin-top: 160px;
`;

const ProfilePhotoContainer = styled.TouchableOpacity`
    background-color: #e1e2e6;
    width: 80px;
    height: 80px;
    border-radius: 40px;
    align-self: center;
    margin-top: 16px;
    overflow: hidden;
`;

const DefaultProfilePhoto = styled.View`
    align-items: center;
    justify-content: center;
    flex: 1;
`;

const ProfilePhoto = styled.Image`
    flex: 1;
`;

const Auth = styled.View`
    margin: 16px 32px 32px;
`;

const AuthContainer = styled.View`
    margin-bottom: 32px;
`;

const AuthTitle = styled(Text)`
    color: #8e93a1;
    font-size: 12px;
    text-transform: uppercase;
    font-weight: 300;
`;

const AuthField = styled.TextInput`
    border-bottom-color: #8e93a1;
    border-bottom-width: 0.5px;
    height: 48px;
`;

const AuthTouchField = styled.TouchableOpacity`
    border-bottom-color: #8e93a1;
    border-bottom-width: 0.5px;
    height: 48px;
    justify-content: center;
`;

const SignUpContainer = styled.TouchableOpacity`
    margin: 0 32px;
    height: 48px;
    align-items: center;
    justify-content: center;
    background-color: #8022d9;
    border-radius: 6px;
`;

const Loading = styled.ActivityIndicator.attrs((props) => ({
    color: "#ffffff",
    size: "small",
}))``;

const SignIn = styled.TouchableOpacity`
    margin-top: 16px;
`;

const HeaderGraphic = styled.View`
    position: absolute;
    width: 100%;
    top: -50px;
    z-index: -100;
    zIndex: 2;
`;

const RightCircle = styled.View`
    background-color: #8022d9;
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 200px;
    right: -100px;
    top: -200px;
`;

const LeftCircle = styled.View`
    background-color: #23a6d5;
    position: absolute;
    width: 200px;
    height: 200px;
    border-radius: 100px;
    left: -50px;
    top: -50px;
`;

const ListItem = styled.TouchableOpacity`
    padding: 10px;
    border-bottom-width: 1px;
    border-bottom-color: #ccc;
`;

const StatusBar = styled.StatusBar``;
