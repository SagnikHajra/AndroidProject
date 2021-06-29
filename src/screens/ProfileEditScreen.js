import React, { useContext, useEffect, useState, useMemo } from "react";
import { Platform, ScrollView, Dimensions } from "react-native";
import styled from "styled-components";
import { AntDesign, Entypo } from "@expo/vector-icons";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { useForm, Controller } from "react-hook-form";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment'
import { toJS } from 'mobx'

import { StoreContext } from "../context/StoreContext";
import { FirebaseContext } from "../context/FirebaseContext";
import { StatusBar, Header, BackButton, Loading, HeaderGraphic, LeftCircle, RightCircle } from "../components/Styled"
import Text from "../components/Text";
import CustomModal from "../components/CustomModal";

const window = Dimensions.get('window')
const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

export default ProfileEditScreen = (props) => {
  const { handleSubmit, reset, errors, control } = useForm();
  const {user: {user}} = useContext(StoreContext);
  const [userData] = useState(toJS(user))
  const firebase = useContext(FirebaseContext);
  const [showCal, setShowCal] = useState(false)
  const [dob, setDOB] = useState(userData.dob || null)
  const [showGenderModal, setShowGenderModal] = useState(false)
  const [gender, setGender] = useState(userData.gender || null)
  const [loading, setLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState();
  
  useEffect(() => {
    reset({
      username: userData.username || '',
      phonenumber: userData.phonenumber || '',
      country: userData.country || '',
      city: userData.city || ''
    })
  }, [])

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

  const saveProfile = async (data) => {
    setLoading(true);

    const { username, phonenumber, city, country } = data
    const user = { username, phonenumber, city, country, dob, gender, profilePhoto };

    try {
      const response = await firebase.updateUser(user);

    } catch (error) {
      console.log("Error @signUp: ", error);
    } finally {

      setLoading(false);
    }
  }

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
          <Header>
            <BackButton onPress={() => props.navigation.goBack()}><Entypo name="chevron-left" size={24} color="black" /></BackButton>
            <Text large semi center>My Profile</Text>
            {/* <Empty></Empty> */}
          </Header>
            <ProfilePhotoContainer onPress={addProfilePhoto}>
              {profilePhoto || userData.profilePhotoUrl || userData.profilePhotoUrl !== "default" ? (
                <ProfilePhoto source={{ uri: profilePhoto? profilePhoto : userData.profilePhotoUrl }} />
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
                  rules={{ required: true }}
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
              {errors.username? <Text tiny color={'red'}>{'This field is required'}</Text> : null}
              </AuthContainer>

              <AuthContainer>
                <AuthTitle>Phone Number</AuthTitle>
                <Controller
                  control={control}
                  name='phonenumber'
                  rules={{ maxLength: 12 }}
                  render={({ onChange, value }) => (
                    <AuthField
                      autoCapitalize="none"
                      autoCorrect={false}
                      onChangeText={(phonenumber) => onChange(phonenumber.trim())}
                      value={value}
                    />
                  )}
                />
                {errors.phonenumber? <Text tiny color={'red'}>{'Phone number should not exceed 12 numbers'}</Text> : null}
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
                    initialDate={dob ? moment(dob, 'MM-DD-YYYY'): new Date()}
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

              <AuthContainer>
                <AuthTitle>Home country</AuthTitle>
                <Controller
                    control={control}
                    name='country'
                    rules={{ maxLength: 25, required: true }}
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

            </Auth>

            <SaveContainer onPress={handleSubmit(saveProfile)} disabled={loading}>
                {loading ? (
                    <Loading />
                ) : (
                    <Text bold center color="#ffffff">
                        Save
                    </Text>
                )}
            </SaveContainer>
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
        {/* <HeaderGraphic>
            <RightCircle />
            <LeftCircle />
        </HeaderGraphic> */}
        <StatusBar barStyle="dark-content" />
      </Container>
    </KeyboardAwareScrollView>
  )
}

const Container = styled.View`
    flex: 1;
    width: 100%;
    padding-top: 64px;
    background-color: #ffffff;
`;

const Wapper = styled.View`
    padding-bottom: 40px;
`;

const Main = styled.View`
    margin-top: 150px;
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

const ListItem = styled.TouchableOpacity`
    padding: 10px;
    border-bottom-width: 1px;
    border-bottom-color: #ccc;
`;

const SaveContainer = styled.TouchableOpacity`
  margin: 0 32px;
  height: 48px;
  align-items: center;
  justify-content: center;
  background-color: #8022d9;
  border-radius: 6px;
`
