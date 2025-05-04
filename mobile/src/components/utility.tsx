import React, { useRef, useState } from "react";
import { Field } from "formik";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import OTPTextInput from "react-native-otp-textinput";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, RefreshControl, Image, Platform, SafeAreaView } from "react-native";
import { Pressable } from "./ui/pressable";
import { Button } from "./ui/button";
import { Box } from "./ui/box";
import { HStack } from "./ui/hstack";
import { VStack } from "./ui/vstack";
import { Divider } from "./ui/divider";
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from "./ui/select";

import { fileUpload, showError } from "../services/apis";
import { Config, Images } from "../common";
import { ChevronDownIcon } from "./ui/icon";
import { Avatar, AvatarImage } from "./ui/avatar";

const bottomTabs = [
  {
    icon: "home",
    label: "Home",
    link: "home",
  },
  {
    icon: "staro",
    label: "Account",
    link: "account",
  },
  {
    icon: "plus",
    label: "Redemption",
    link: "redemption",
  },
  {
    icon: "table",
    label: "Party",
    link: "party",
  },
  {
    icon: "user",
    label: "Profile",
    link: "profile",
  },
];

export const BottomTabs = ({ activeTab }: any) => {
  const navigation = useNavigation();
  return (
    <>
      <HStack className="content-center absolute bottom-0 justify-between w-full py-3 px-6 md:hidden bg-background-dark">
        {bottomTabs.map((tab: any) => {
          if (tab.label === "Redemption") {
            return (
              <Pressable
                key={tab.label}
                onPress={() => navigation.navigate(tab.link)}
                className={"items-center justify-center w-16 h-16 bg-[#f1f5f8] rounded-full -mt-7"}
              >
                <VStack className="items-center justify-center p-2  bg-amber-500 rounded-full">
                  <AntDesign name={tab.icon} size={30} color={"#ffffff"} />
                </VStack>
              </Pressable>
            );
          } else {
            return (
              <Pressable
                key={tab.label}
                onPress={() => navigation.navigate(tab.link)}
                disabled={tab.disabled}
                //@ts-ignore
                opacity={tab.disabled ? 0.5 : 1}
              >
                <VStack className="items-center">
                  <AntDesign name={tab.icon} size={30} color={"#6d6873"} />
                  <Divider className={`${activeTab === tab.label
                    ? "my-2 py-0.5 bg-amber-500"
                    : "my-2 py-0.5 bg-background-dark"
                    }`} />
                </VStack>
              </Pressable>
            );
          }

        })}
      </HStack>
    </>
  );
};

export function MainWapper({
  padding = 15,
  refreshing = false,
  onRefresh = null,
  backgroundColor = 'rgb(255, 255, 255)',
  children,
}: any) {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Box className="min-h-screen bg-background-dark rounded-t-[50px]" style={{ padding }}>
        <SafeAreaView style={{ flex: 1 }}>
          {children}
        </SafeAreaView>
      </Box>
    </ScrollView>
  );
}

export const ButtonBox = (props: any) => {
  return (
    <TouchableOpacity className={"bg-primary rounded-3xl justify-center justify-items-center my-4 p-4 items-center"} onPress={props.onClick}>
      {props.isLoading ?
        <ActivityIndicator size="small" color="#ffffff" /> :
        <Text className="text-[17px] text-white">{props.value}</Text>
      }
    </TouchableOpacity>

  );
};

export const InputBox = (props: any) => {
  return (
    <Field name={props.name}>
      {({ field, form, meta }: any) => {
        return (
          <>
            {props.label && (<Text className="pl-2 pt-5 text-text-light">{props.label}</Text>)}
            <View className={meta?.error ? "flex flex-row bg-background-light rounded-3xl py-3 pl-5 h-fit mt-3 items-center border border-red-500" : "flex flex-row bg-background-light rounded-3xl py-3 pl-5 h-fit mt-3 items-center border border-background-dark"}>
              {props.icon}
              <TextInput
                {...props}
                autoCapitalize={'none'}
                value={field.value}
                placeholder={props.placeholder}
                onChangeText={(value: any) => {
                  form.setFieldValue(props.name, value);
                }}
                className="px-1 w-[90%]"
              />
            </View>
            {form?.errors[props.name] && form?.touched[props.name] && (<Text className="p-2 text-red-500">{form.errors[props.name]}</Text>)}
          </>
        );
      }}

    </Field>

  );
};

export const OptBox = (props: any) => {
  return (
    <Field name={props.name}>
      {({ field, form, meta }: any) => {
        return (
          <>
            {props.label && (<Text className="pl-2 pt-5 text-text-light">{props.label}</Text>)}
            <OTPTextInput
              inputCount={4}
              {...props}
              handleTextChange={(value: any) => {
                form.setFieldValue(props.name, value);
              }}
              tintColor={
                form?.errors[props.name] && form?.touched[props.name]
                  ? "#ff0000"
                  : "#ccc"
              }
              offTintColor={
                form?.errors[props.name] && form?.touched[props.name]
                  ? "#ff0000"
                  : "#ccc"
              }
              textInputStyle={{
                borderWidth: 0,
                borderRadius: 10,
                padding: 10,
                width: '20%',
                height: 50,
                textAlign: "center",
                fontSize: 18,
                margin: 5,
                color: "#000",
                backgroundColor: "#ccc",
              }}
            />
            {form?.errors[props.name] && form?.touched[props.name] && (<Text className="p-2 text-red-500">{form.errors[props.name]}</Text>)}
          </>
        );
      }}
    </Field>

  );
};

export const DateBox = (props: any) => {
  const useTime = useRef<any>(null)
  const [show, setShow] = useState(false);
  return (
    <Field name={props.name}>
      {({ field, form, meta }: any) => {
        const formattedDate = new Intl.DateTimeFormat('en-US', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }).format(field?.value ? new Date(field.value) : new Date());

        const onChange = (event: any, selectedDate: any) => {
          if (event.type === 'set' && selectedDate) {
            const currentDate = selectedDate || new Date();
            const formattedDate = currentDate.toISOString().split('T')[0];
            setShow(false);
            setTimeout(() => {
              form.setFieldValue(props.name, formattedDate);
            }, 100)
          } else {
            setShow(false);
          }
        };

        return (
          <View className={"relative container rounded"}>
            {props.label && (<Text className="pl-2 pt-5 text-text-light">{props.label}</Text>)}
            <View className={meta?.error ? "flex flex-row bg-background-light rounded-3xl py-2 pl-5 h-fit mt-3 items-center border border-red-500" : "flex flex-row bg-background-light rounded-3xl py-3 pl-5 h-fit mt-3 items-center border border-background-dark"}>
              <Pressable onPress={() => setShow(!show)}>
                <HStack>
                  {props.icon}
                  <Text className="bg-background-light hover:bg-background-dark-600 px-3"><Text className="text-md text-left">{formattedDate}</Text></Text>
                </HStack>
              </Pressable>
            </View>
            {show && (<DateTimePicker
              value={field?.value ? new Date(field.value) : new Date()}
              mode={"date"}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChange}
            />)}
            {form?.errors[props.name] && form?.touched[props.name] && (<Text className="p-2 text-red-500">{form.errors[props.name]}</Text>)}
          </View>
        );
      }}
    </Field>

  );
};

export const SelectBox = (props: any) => {
  return (
    <Field name={props.name}>
      {({ field, form, meta }: any) => {
        return (
          <>
            {props.label && (<Text className="pl-2 pt-5 text-text-light">{props.label}</Text>)}
            <Box className={meta?.error ? "flex flex-row bg-background-light rounded-3xl py-1 pl-5 h-fit mt-3 items-center border border-red-500" : "flex flex-row bg-background-light rounded-3xl py-1 pl-5 h-fit mt-3 items-center border border-background-dark"}>
              {props.icon}
              <Select
                className="w-[90%]"
                selectedValue={field.value}
                onValueChange={(value) => form.setFieldValue(props.name, value)}
                {...props}
              >
                <SelectTrigger variant="outline" size="md" >
                  <SelectInput placeholder="Select option" />
                  <SelectIcon className="mr-3" as={ChevronDownIcon} />
                </SelectTrigger>
                <SelectPortal >
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    {props.options.map((item: any) => <SelectItem key={item.value} label={item.label} value={item.value} />)}
                  </SelectContent>
                </SelectPortal>
              </Select>
            </Box>
            {form?.errors[props.name] && form?.touched[props.name] && (<Text className="p-2 text-red-500">{form.errors[props.name]}</Text>)}
          </>
        );
      }}
    </Field>

  );
};

export const FileBox = (props: any) => {
  const [loading, setLoading] = useState(false)
  return (
    <Field name={props.name}>
      {({ field, form, meta }: any) => {

        const options: any = {
          mediaType: "photo",
          quality: 1,
        };

        const handleChooseImage = async () => {
          return launchImageLibrary(options, async (res: any) => {
            if (res.didCancel) {
              showError({ message: "User cancelled image picker" })
            } else if (res.errorCode) {
              showError({ message: res.errorMessage })
            } else if (res.assets) {
              const asset = res.assets[0];
              const cleanedUri = Platform.OS === 'ios' ? asset.uri.replace('file://', '') : asset.uri;
              setLoading(true)
              try {
                const file: any = await fileUpload({
                  uri: cleanedUri,
                  name: asset.fileName,
                  type: asset.type,
                });
                form.setFieldValue(props.name, file?.message?.file_url);
                setLoading(false)
              } catch (error) {
                showError(error)
                setLoading(false)
              }
            }
          });
        };

        const handleChooseCamera = () => {
          return launchCamera(options, async (res: any) => {
            if (res.didCancel) {
              showError({ message: "User cancelled image picker" })
            } else if (res.errorCode) {
              showError({ message: res.errorMessage })
            } else if (res.assets) {
              const asset = res.assets[0];
              const cleanedUri = Platform.OS === 'ios' ? asset.uri.replace('file://', '') : asset.uri;
              setLoading(true)
              try {
                const file: any = await fileUpload({
                  uri: cleanedUri,
                  name: asset.fileName,
                  type: asset.type,
                });
                form.setFieldValue(props.name, file?.message?.file_url);
                setLoading(false)
              } catch (error) {
                showError(error)
                setLoading(false)
              }
            }
          });
        };

        return (
          <>
            {props.label && (<Text className="pl-2 pt-5 text-text-light">{props.label}</Text>)}
            <VStack className='justify-center items-center relative'>
              {loading ? <ActivityIndicator size={40} color={"#000"} /> : <Avatar>
                <AvatarImage
                  source={
                    field?.value ?
                      { uri: `${Config.REACT_APP_BASE_URL}${field.value}` } :
                      Images.thumbnail
                  }
                />
              </Avatar>}

              <HStack className="content-center justify-between m-2">
                <Button className="bg-primary mr-2" onPress={handleChooseImage}>
                  <AntDesign name="cloudupload" size={20} color={"#fff"} />
                </Button>
                <Button className="bg-primary" onPress={handleChooseCamera}>
                  <AntDesign name="camera" size={20} color={"#fff"} />
                </Button>
              </HStack>

            </VStack>
            {form?.errors[props.name] && form?.touched[props.name] && (<Text className="p-2 text-red-500">{form.errors[props.name]}</Text>)}
          </>
        );
      }}
    </Field>

  );
};