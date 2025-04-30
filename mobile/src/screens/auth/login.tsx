import React, { useEffect, useContext } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from "@react-navigation/native";

import { Box, Pressable, Text, VStack } from "@/src/components";
import { InputBox, ButtonBox } from "@/src/components/utility";
import { Avatar, AvatarImage } from "@/src/components/ui/avatar";

import { MainContext } from "@/src/contexts";
import { useLogin } from '@/src/hooks';
import { Images } from "@/src/common";

const initialValues = {
    email: "",
    password: ""
}
export default function Login() {
    const navigation = useNavigation();
    const { token } = useContext(MainContext)

    useEffect(() => {
        if (token) navigation.navigate("home")
    }, [token])

    const mutation = useLogin((data: any) => {
        if (data) navigation.navigate("home")
    });

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email("Invalid email address")
            .required("Email is required"),
        password: Yup.string().required("Password is required")
    });

    const onPressHandle = async (values: any) => {
        mutation.mutate({ usr: values.email, pwd: values.password });
    };

    return (
        <VStack className='p-4 bg-background-dark flex-1'>
            <VStack className='justify-center items-center py-[20%]'>
                <Box className='my-2'>
                    <Avatar>
                        <AvatarImage source={Images.logo} />
                    </Avatar>
                </Box>
                <Text className='text-[15px] font-semibold text-text-dark text-center'>Welcome to My Account</Text>
                <Text className='text-[15px] font-normal text-text-light pb-2'>Continue to Login In</Text>
            </VStack>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => onPressHandle(values)}
            >
                {({ handleSubmit }) => {
                    return <>
                        <Text className='text-xl font-semibold text-text-dark'>Login In to My Account</Text>
                        <InputBox
                            error={true}
                            required={true}
                            placeholder="Email"
                            name="email"
                            icon={<Feather name={"mail"} size={20} color={"#78787899"} />}
                        />
                        <InputBox
                            error={true}
                            required={true}
                            placeholder="Password"
                            name="password"
                            secureTextEntry={true}
                            icon={<Feather name={"lock"} size={20} color={"#78787899"} />}
                        />

                        <ButtonBox value={'Login'} isLoading={mutation.isPending} onClick={handleSubmit} />

                        <VStack className='justify-center items-center'>
                            <Pressable className="mt-2" onPress={() => navigation.navigate('register')}>
                                <Text className='text-text-light text-[17px]'>Don't have an Account?
                                    <Text className='text-primary text-[17px]'> Register</Text>
                                </Text>
                            </Pressable>
                        </VStack>
                    </>
                }}
            </Formik>

        </VStack>
    );
}