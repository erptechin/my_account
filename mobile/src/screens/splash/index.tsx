import React, { useContext, useEffect } from "react";
import LottieView from 'lottie-react-native';
import { useNavigation } from "@react-navigation/native";

import { Box } from "@/src/components";

import { MainContext } from "@/src/contexts";

export default function Splash() {
  const navigation = useNavigation();
  const { token } = useContext(MainContext)

  useEffect(() => {
    setTimeout(() => {
      if (token) {
        navigation.navigate("home")
      } else {
        navigation.navigate('login')
      }
    }, 1000)
  }, [token]);

  return (
    <Box className="flex-1">
      <LottieView
        autoPlay
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: '#fff',
        }}
        source={require('../../assets/splash.json')}
      />
    </Box>
  );
}