import React, { useContext } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";
import SvgUri from "react-native-svg-uri";

import { HStack, Text, VStack } from "@/src/components";
import { MainWapper, InputBox, DateBox, SelectBox, ButtonBox, FileBox } from "@/src/components/utility";

import { useUpdateProfile } from '@/src/hooks';
import { MainContext } from "@/src/contexts";

export default function EditProfile() {
  const navigation = useNavigation();
  const { labels, user } = useContext(MainContext)

  const mutation = useUpdateProfile((data: any) => {
    if (data) {
      navigation.navigate("profile")
    }
  });

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required(labels.firstName_error),
    last_name: Yup.string().required(labels.lastName_error),
    mobile_no: Yup.string()
      .matches(/^\d{10}$/, labels.mobile_error1)
      .required(labels.mobile_error2)
  });

  const onPressHandle = async (values: any) => {
    mutation.mutate({ ...values, user: user.email });
  };

  return (
    <>
      <MainWapper backgroundColor={'rgb(29, 191, 115)'}>
        <Formik
          initialValues={user}
          validationSchema={validationSchema}
          onSubmit={(values) => onPressHandle(values)}
        >
          {({ handleSubmit }) => {
            return <>
              {/* <FileBox
                placeholder="Profile"
                name="user_image"
              /> */}
              <VStack className='justify-center items-center mt-2'>
                <HStack className='justify-center items-center'>
                  <Text className='text-[17px] font-semibold text-text-dark mr-1'>{user?.full_name}</Text>
                  <SvgUri
                    width="16"
                    height="16"
                    source={require('../../assets/verify.svg')}
                  />
                </HStack>
                <Text className='text-[15px] font-normal text-text-light'>{user?.email}</Text>
              </VStack>
              <InputBox
                error={true}
                required={true}
                label="First name"
                placeholder="First name"
                name="first_name"
              />
              <InputBox
                error={true}
                required={true}
                label="Last name"
                placeholder="Last name"
                name="last_name"
              />
              <InputBox
                error={true}
                required={true}
                label="Mobile"
                placeholder="Mobile"
                name="mobile_no"
                type="number"
              />
              <DateBox
                label="DOB"
                placeholder="DOB"
                name="birth_date"
              />
              <SelectBox
                label="Gender"
                placeholder="Gender"
                name="gender"
                options={[{ label: "Male", value: "Male" }, { label: "Female", value: "Female" }, { label: "Other", value: "Other" }]}
              />
              <ButtonBox value="Save" isLoading={mutation.isPending} onClick={handleSubmit} />
            </>
          }}
        </Formik>
      </MainWapper>
    </>
  );
}