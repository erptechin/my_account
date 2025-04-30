import React, { useContext, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Feather from 'react-native-vector-icons/Feather';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { useNavigation } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Box, Text, Pressable, VStack, AlertDialog, AlertDialogContent, SvgImage, Avatar, AvatarImage } from "@/src/components";
import { ButtonBox, DateBox, InputBox, MainWapper, SelectBox } from "@/src/components/utility";

import { useSignUp } from '@/src/hooks';
import { MainContext } from "@/src/contexts";
import { Images } from "@/src/common";

const initialValues = {
    first_name: "",
    last_name: "",
    gender: "Male",
    birth_date: null,
    mobile_no: "",
    email: "",
    password: ""
}

export default function Register() {
    const navigation = useNavigation();
    const { labels } = useContext(MainContext)
    const [show, setShow] = useState(false)

    const mutation = useSignUp((data: any) => {
        if (data) setShow(true)
    });

    const validationSchema = Yup.object().shape({
        first_name: Yup.string().required(labels.firstName_error),
        last_name: Yup.string().required(labels.lastName_error),
        email: Yup.string()
            .email(labels.email_error1)
            .required(labels.email_error2),
        mobile_no: Yup.string()
            .matches(/^\d{10}$/, labels.mobile_error1)
            .required(labels.mobile_error2),
        password: Yup.string()
            .required(labels.password_error)
            .min(8, labels.password_error1)
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                labels.password_error2
            ),
    });

    const onPressHandle = async (values: any) => {
        mutation.mutate({ ...values });
    };

    return (
        <MainWapper>
            <VStack className='flex-1 bg-background-dark pt-10'>
                <VStack className='justify-center items-center'>
                    <Avatar>
                        <AvatarImage source={Images.logo} />
                    </Avatar>
                    <Text className='text-[15px] font-semibold text-text-dark text-center'>Welcome to My Account</Text>
                    <Text className='text-[15px] font-normal text-text-light pb-2'>Continue to Sign Up</Text>
                </VStack>

                <Text className='text-xl font-semibold text-text-dark pt-4 pb-1'>Sign Up Now</Text>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values) => onPressHandle(values)}
                >
                    {({ handleSubmit }) => {
                        return <>
                            <InputBox
                                error={true}
                                required={true}
                                placeholder="First name"
                                name="first_name"
                                icon={<SimpleLineIcons name={"user"} size={20} color={"#78787899"} />}
                            />
                            <InputBox
                                error={true}
                                required={true}
                                placeholder="Last name"
                                name="last_name"
                                icon={<SimpleLineIcons name={"user"} size={20} color={"#78787899"} />}
                            />
                            <InputBox
                                error={true}
                                required={true}
                                placeholder="Mobile"
                                name="mobile_no"
                                type="number"
                                icon={<Feather name={"phone"} size={20} color={"#78787899"} />}
                            />
                            <DateBox
                                placeholder="DOB"
                                name="birth_date"
                                icon={<SimpleLineIcons name={"user"} size={20} color={"#78787899"} />}
                            />
                            <SelectBox
                                placeholder="Gender"
                                name="gender"
                                options={[{ label: "Male", value: "Male" }, { label: "Female", value: "Female" }, { label: "Other", value: "Other" }]}
                                icon={<SimpleLineIcons name={"user"} size={20} color={"#78787899"} />}
                            />
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
                                icon={<Feather name={"lock"} size={20} color={"#78787899"} />}
                                secureTextEntry={true}
                            />

                            <ButtonBox value={labels.register} isLoading={mutation.isPending} onClick={handleSubmit} />
                            <VStack className='justify-center items-center'>

                                <Pressable className="mt-2" onPress={() => navigation.navigate('login')}>
                                    <Text className='text-text-light text-[17px]'>Already have an Account?
                                        <Text className='text-primary text-[17px]'> Log In</Text>
                                    </Text>
                                </Pressable>
                            </VStack>
                        </>
                    }}
                </Formik>
            </VStack>

            <AlertDialog isOpen={show} onClose={() => setShow(false)} size="md">
                <AlertDialogContent>
                    <Pressable onPress={() => setShow(false)} className='flex items-end'>
                        <Ionicons name={"close-outline"} size={30} color={"#404145"} />
                    </Pressable>
                    <VStack className='w-full items-center'>
                        <Box className="flex justify-center items-center">
                            <SvgImage
                                width="64"
                                height="64"
                                source={require('../../assets/tick.svg')}
                            />
                        </Box>
                        <Text className='text-2xl font-semibold text-primary py-2'>Congratulations!</Text>
                        <Text className='text-[17px] font-normal text-text-light'>Your Account has been successfully</Text>
                        <Text className='text-[17px] font-normal text-primary py-2'>Setup!</Text>
                        <Pressable onPress={() => { setShow(false); navigation.navigate('login') }} className='bg-primary rounded-3xl justify-center justify-items-center w-[50%] mt-5 py-4 items-center'>
                            <Text className='text-[17px] text-white'>OK</Text>
                        </Pressable>
                    </VStack>
                </AlertDialogContent>
            </AlertDialog>

        </MainWapper>
    );
}