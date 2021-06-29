import React, { useContext, useState } from "react";
import styled from "styled-components";
import { observer } from 'mobx-react'

import { FirebaseContext } from "../context/FirebaseContext";
// import { UserContext } from "../context/UserContext";
import { StoreContext } from "../context/StoreContext";

import Text from "../components/Text";

const SignInScreen = ({ navigation }) => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);
    const firebase = useContext(FirebaseContext);
    const {user: {setUser}} = useContext(StoreContext);
    // const [_, setUser] = useContext(UserContext);

    const signIn = async () => {
        setLoading(true);

        try {
            await firebase.signIn(email, password);

            const uid = firebase.getCurrentUser().uid;

            const userInfo = await firebase.getUserInfo(uid);

            setUser({
                ...userInfo,
                username: userInfo.username,
                email: userInfo.email,
                uid,
                profilePhotoUrl: userInfo.profilePhotoUrl,
                isLoggedIn: true,
            });
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Main>
                <Text title semi center>
                    Welcome to Diaspove!
                </Text>
            </Main>

            <Auth>
                <AuthContainer>
                    <AuthTitle>Email Address</AuthTitle>
                    <AuthField
                        autoCapitalize="none"
                        autoCompleteType="email"
                        autoCorrect={false}
                        autoFocus={true}
                        keyboardType="email-address"
                        onChangeText={(email) => setEmail(email.trim())}
                        value={email}
                    />
                </AuthContainer>

                <AuthContainer>
                    <AuthTitle>Password</AuthTitle>
                    <AuthField
                        autoCapitalize="none"
                        autoCompleteType="password"
                        autoCorrect={false}
                        secureTextEntry={true}
                        onChangeText={(password) => setPassword(password.trim())}
                        value={password}
                    />
                </AuthContainer>
            </Auth>

            <SignInContainer onPress={signIn} disabled={loading}>
                {loading ? (
                    <Loading />
                ) : (
                    <Text bold center color="#ffffff">
                        Sign In
                    </Text>
                )}
            </SignInContainer>

            <QuickLinks onPress={() => navigation.navigate("SignUp")}>
                <Text small center>
                    New to Diaspove?{" "}
                    <Text bold color="#8022d9">
                        Sign Up
                    </Text>
                </Text>
            </QuickLinks>
            <QuickLinks onPress={() => navigation.navigate("ForgotPassword")}>
                <Text small center>
                    Trouble Signing In?{" "}
                    <Text bold color="#8022d9">
                        Forgot Password?
                    </Text>
                </Text>
            </QuickLinks>
            <HeaderGraphic>
                <RightCircle />
                <LeftCircle />
            </HeaderGraphic>
            <StatusBar barStyle="light-content" />
        </Container>
    );
};

export default observer(SignInScreen)

const Container = styled.View`
    flex: 1;
`;

const Main = styled.View`
    margin-top: 192px;
`;

const Auth = styled.View`
    margin: 64px 32px 32px;
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

const SignInContainer = styled.TouchableOpacity`
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

const QuickLinks = styled.TouchableOpacity`
    margin-top: 16px;
`;

const HeaderGraphic = styled.View`
    position: absolute;
    width: 100%;
    top: -50px;
    z-index: -100;
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

const StatusBar = styled.StatusBar``;
