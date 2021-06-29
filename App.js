import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import { StoreProvider } from "./src/context/StoreContext";
import { UserProvider } from "./src/context/UserContext";
import { FirebaseProvider } from "./src/context/FirebaseContext";
import { useFonts } from 'expo-font';

import AppStackScreens from "./src/stacks/AppStackScreens";

export default App = () => {

    const [loaded] = useFonts({
        'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
        'Roboto-Black': require('./assets/fonts/Roboto-Black.ttf'),
        'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),

      });

    if (!loaded) {
        return null;
    }

    return (
        <StoreProvider>
            <FirebaseProvider>
                <UserProvider>
                    <NavigationContainer>
                        <AppStackScreens />
                    </NavigationContainer>
                </UserProvider>
            </FirebaseProvider>
        </StoreProvider>
    );
};
