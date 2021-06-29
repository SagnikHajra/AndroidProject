import React, { useContext, useState } from "react";
import styled from "styled-components";
import { observer } from 'mobx-react'

import { FirebaseContext } from "../context/FirebaseContext";

import Text from "../components/Text";

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const firebase = useContext(FirebaseContext);

    const forgotPassword = async () => {
        setLoading(true);

        try {
            await firebase.forgotPassword(email);
            alert("Reset password request successfully sent");
            setEmail('')
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
                    Forgot Password.
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
            </Auth>

            <SignInContainer onPress={forgotPassword} disabled={loading}>
                {loading ? (
                    <Loading />
                ) : (
                    <Text bold center color="#ffffff">
                        Submit
                    </Text>
                )}
            </SignInContainer>

            <QuickLinks onPress={() => navigation.navigate("SignUp")}>
                <Text small center>
                    New to SocialApp?{" "}
                    <Text bold color="#8022d9">
                        Sign Up
                    </Text>
                </Text>
            </QuickLinks>
            <QuickLinks onPress={() => navigation.navigate("SignIn")}>
                <Text small center>
                    Already have an account?{" "}
                    <Text bold color="#8022d9">
                        Sign In
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

export default observer(ForgotPasswordScreen)

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
