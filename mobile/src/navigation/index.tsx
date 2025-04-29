import React from 'react';
import { SafeAreaView, StatusBar, View } from 'react-native';
import { createStaticNavigation, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import AntDesign from 'react-native-vector-icons/AntDesign';

import { Heading, HStack, Text, Pressable, SvgImage } from '@/src/components';

import Splash from '../screens/splash'
import Login from '../screens/auth/login'
import Notifications from '../screens/notifications'
import Profile from '../screens/dash/profile'
import EditProfile from '../screens/dash/editProfile'
import Password from '../screens/dash/password'
import Home from '../screens/home'
import Redemption from '../screens/redemption'
import Account from '../screens/account'
import Party from '../screens/party'

const StatusBarOnly = ({ color }: any) => {
    return (
        <View style={{ height: StatusBar.currentHeight, backgroundColor: color }}><SafeAreaView><StatusBar /></SafeAreaView></View>
    );
};

const SettigsHeader = ({ left, title, right }: any) => {
    const navigation = useNavigation();
    return (
        <HStack className={"content-center justify-between w-full px-5 pt-2 pb-2 bg-primary"}>
            {left ? <Pressable className='rounded-full overflow-hidden' onPress={() => {
                if (left == 'home' || !navigation.canGoBack()) {
                    navigation.navigate("home")
                } else {
                    navigation.goBack();
                }
            }}>
                <SvgImage
                    width="44"
                    height="44"
                    source={require('../assets/back-settings.svg')}
                />
            </Pressable> : <Text>&nbsp;</Text>}
            <Heading className="text-white mt-2">{title}</Heading>
            {right ? <Pressable className='rounded-full w-[40px] h-[40px] bg-[#54CE96] overflow-hidden flex items-center justify-center' onPress={() => navigation.navigate('notifications')}>
                <AntDesign name={"notification"} size={15} color={"#fff"} />
            </Pressable> : <Text>&nbsp;</Text>}
        </HStack>
    );
};

const AuthHeader = ({ title }: any) => {
    const navigation = useNavigation();
    return (
        <HStack className={"content-center justify-between w-full px-5 pt-14 pb-2 bg-background-dark"}>
            <Pressable className='rounded-full overflow-hidden' onPress={() => navigation.goBack()}>
                <SvgImage
                    width="44"
                    height="44"
                    source={require('../assets/back.svg')}
                />
            </Pressable>
            {title && (<Heading className="text-black mt-4">{title}</Heading>)}
            <Text>&nbsp;</Text>
        </HStack>
    );
};

const RootStack = createNativeStackNavigator({
    initialRouteName: 'splash',
    screens: {
        splash: {
            screen: Splash,
            options: {
                header: () => null,
            },
        },
        login: {
            screen: Login,
            options: {
                header: () => null,
            },
        },
        home: {
            screen: Home,
            options: {
                header: () => <SettigsHeader left={false} title="Point earned Balance" right={true} />
            },
        },
        redemption: {
            screen: Redemption,
            options: {
                header: () => <SettigsHeader left={false} title="Redemption" right={true} />
            },
        },
        account: {
            screen: Account,
            options: {
                header: () => <SettigsHeader left={false} title="Account Statement" right={true} />
            },
        },
        party: {
            screen: Party,
            options: {
                header: () => <SettigsHeader left={false} title="⁠⁠Party Balances" right={true} />
            },
        },
        notifications: {
            screen: Notifications,
            options: {
                header: () => <AuthHeader title="Notifications" />
            },
        },
        profile: {
            screen: Profile,
            options: {
                header: () => <SettigsHeader left={'home'} title="Settings" />
            },
        },
        editProfile: {
            screen: EditProfile,
            options: {
                header: () => <SettigsHeader left={true} title="Personal Information" />
            },
        },
        password: {
            screen: Password,
            options: {
                header: () => <SettigsHeader left={true} title="Change Password" />
            },
        },
    }
});

export const Navigation = createStaticNavigation(RootStack);