import React, { useContext, useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

import { Pressable, Text, AlertDialog, AlertDialogBackdrop, AlertDialogBody, AlertDialogContent, AlertDialogFooter,  Button, ButtonText, Heading, HStack, VStack, Box, SvgImage } from '@/src/components';

import { useLogOut } from '@/src/hooks';
import { MainContext } from '@/src/contexts';

const screenHeight = Dimensions.get('window').height;

export default function Profile() {
  const navigation = useNavigation();
  const { token } = useContext(MainContext)
  const mutation = useLogOut()
  const [showAlertDialog, setShowAlertDialog] = useState(false)

  useEffect(() => {
    if (!token) navigation.navigate('splash')
  }, [token])

  const handleClose = () => {
    setShowAlertDialog(false);
  };

  const handleLogOut = async () => {
    await mutation.mutate()
    setShowAlertDialog(false);
    navigation.navigate('splash')
  };

  return (
    <>
      <Box className='bg-primary pr-[30px]'>

        <VStack space="lg" className='bg-white py-10 px-5 rounded-tr-[60px]' style={{ minHeight: screenHeight - 80 }}>

          <HStack space="md">
            <AntDesign name="user" size={20} color={"#1DBF73"} />
            <Heading className='text-primary'>My Profile</Heading>
          </HStack>

          <VStack space="lg" className="justify-between pl-7">
            <Pressable className='py-2' onPress={() => navigation.navigate('editProfile')}>
              <HStack className="justify-between">
                <Text className='text-[16px]'>Personal Information</Text>
                <SvgImage
                  width="24"
                  height="24"
                  source={require('../../assets/arrow-right.svg')}
                />
              </HStack>
            </Pressable>
            <Pressable className='py-2' onPress={() => navigation.navigate('password')}>
              <HStack className="justify-between">
                <Text className='text-[16px]'>Reset Password</Text>
                <SvgImage
                  width="24"
                  height="24"
                  source={require('../../assets/arrow-right.svg')}
                />
              </HStack>
            </Pressable>
          </VStack>

          <VStack space="lg" className="justify-between mt-5">

            <Pressable className='py-2' onPress={() => setShowAlertDialog(true)}>
              <HStack className="justify-between">
                <HStack>
                  <AntDesign name="logout" size={20} color={"#ff0000"} />
                  <Text className='text-[16px] pl-2'>Log Out</Text>
                </HStack>
                <SvgImage
                  width="24"
                  height="24"
                  source={require('../../assets/arrow-right.svg')}
                />
              </HStack>
            </Pressable>

          </VStack>

          <VStack className='justify-center items-center absolute bottom-20 left-[45%]'>
            <Text>Version : 0.0.1</Text>
          </VStack>

        </VStack>
      </Box>

      <AlertDialog isOpen={showAlertDialog} onClose={handleClose}>
        <AlertDialogBackdrop />
        <AlertDialogContent className="p-4 bg-green-200">
          <AlertDialogBody className="">
            <Heading>Logout</Heading>
            <Text className="mb-6">Are you sure, you want to logout?</Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button variant="outline" action="secondary" onPress={handleClose}>
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button variant="solid" action="positive" onPress={handleLogOut}>
              <ButtonText>Logout</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}