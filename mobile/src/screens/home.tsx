import React, { useContext, useEffect, useState } from 'react';
import { AppState, PermissionsAndroid, Platform } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import SmsAndroid from 'react-native-get-sms-android';

import Claims from "@/src/components/Claims";

import { MainContext } from '@/src/contexts';

import { Box, View, Text, HStack, VStack, Heading } from "@/src/components";
import { BottomTabs, MainWapper } from "@/src/components/utility";

export default function Home() {
  const navigation = useNavigation();
  const { user } = useContext(MainContext)
  const [smsList, setSmsList] = useState([]);
  const [hasPermission, setHasPermission] = useState(false);

  // Request SMS permissions
  const requestSMSPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_SMS,
          {
            title: 'SMS Read Permission',
            message: 'This app needs access to your SMS to read messages.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setHasPermission(true);
          getAllSMS();
        } else {
          console.log('SMS permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      // iOS - Note: Apple doesn't allow reading SMS except for specific cases
    }
  }

  // Get all SMS messages
  const getAllSMS = () => {
    if (Platform.OS === 'android') {
      const filter = {
        box: 'inbox', // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued'
        maxCount: 1000, // Maximum number of messages to return
      };

      SmsAndroid.list(
        JSON.stringify(filter),
        (fail: any) => {
          console.log('Failed with this error: ' + fail);
        },
        (count: any, smsList: any) => {
          const arr = JSON.parse(smsList);
          setSmsList(arr);
          console.log('SMS list:', arr);
        },
      );
    }
  };

  useEffect(() => {
    // Request permissions on component mount
    requestSMSPermission();

    // Check for SMS every time the app comes to foreground
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        getAllSMS();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <>
      <MainWapper backgroundColor={'rgb(29, 191, 115)'} padding refreshing={false}>
        <Box className='p-3 text-primary bg-primary rounded-b-[60px] pb-5'>
          <VStack className='justify-center items-center'>
            <HStack className='justify-center items-center'>
              <FontAwesome name={"user"} size={15} color={"#fff"} />
              <Text className='text-xl text-white pl-3'>{user?.full_name}</Text>
            </HStack>
            <HStack className='justify-center items-center'>
              <FontAwesome name={"envelope-o"} size={15} color={"#fff"} />
              <Text className='text-lg text-white pl-3'>{user?.email}</Text>
            </HStack>
            {user?.mobile_no && (<HStack className='justify-center items-center'>
              <FontAwesome name={"phone"} size={15} color={"#fff"} />
              <Text className='text-lg text-white pl-3'>{user?.mobile_no}</Text>
            </HStack>)}
          </VStack>
        </Box>
        <Box className='mt-3 pb-20'>
          <Heading className="mx-5">Claims</Heading>
          {smsList.map((sms: any, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <Text>From: {sms.address}</Text>
              <Text>Body: {sms.body}</Text>
              <Text>Date: {new Date(parseInt(sms.date)).toString()}</Text>
            </View>
          ))}
          <Claims />
        </Box>

      </MainWapper>
      <BottomTabs navigation={navigation} activeTab="Home" />
    </>
  );
}