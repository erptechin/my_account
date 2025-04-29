import { useEffect, useState } from "react";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { SwipeListView } from 'react-native-swipe-list-view';

import { Box, HStack, Pressable, Text, View, VStack } from "@/src/components";
import { MainWapper } from "@/src/components/utility";

import { useInfo, useFeachData, useDeleteData } from '@/src/hooks';

const doctype = "Notification"
const fields = ['subject', 'value_changed', 'creation']

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const { data: info } = useInfo({ doctype, fields: JSON.stringify(fields) });
  const [search, setSearch] = useState<any>({ doctype, page: 1, page_length: 10, fields: null });
  const { data } = useFeachData(search);

  useEffect(() => {
    if (info?.fields) {
      const fieldnames = info?.fields.map((field: any) => field.fieldname);
      setSearch({ ...search, fields: JSON.stringify([...fieldnames, "name"]) })
    }
  }, [info])

  useEffect(() => {
    if (data?.data) {
      setNotifications(data?.data)
    }
  }, [data])


  const mutation = useDeleteData((data: any) => {

  });

  const renderNotification = ({ item }: any) => (
    <HStack className='bg-background-light rounded-lg p-2 my-1 items-center'>
      <Box className="bg-[#FF000014] p-2 rounded-full flex justify-center items-center w-15 h-15">
        <FontAwesome name={"calendar-o"} size={20} color={"#FF0000"} />
      </Box>
      <VStack className='pl-2'>
        <Text className='text-[15px] font-medium text-text-dark pt-2'>{item?.name}</Text>
        <Text className='text-xs text-text-light'>Date of submission::<Text className='text-text-dark'> {item?.creation}</Text></Text>
        <Text className='text-xs text-text-light'>Tenant Status:<Text className='text-tertiary text-xs'> {item?.value_changed}</Text></Text>
      </VStack>
    </HStack>
  );

  const renderHiddenItem = ({ item }: any) => (
    <View className='flex-1 flex-row items-center justify-end pl-4'>
      <Pressable
        className='flex bg-red-500 px-4 py-7 overflow-hidden rounded-tr-lg rounded-br-lg'
        onPress={() => mutation.mutate({ doctype, ids: [item?.name] })}
      >
        <Text className='text-[15px] font-medium text-white'>Delete</Text>
      </Pressable>
    </View>
  );

  return (
    <>
      <MainWapper backgroundColor={'rgb(245, 247, 249)'}>
        {notifications.length ? <SwipeListView
          data={notifications}
          renderItem={renderNotification}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-75}
        /> : <Box className="bg-background-dark rounded-lg shadow-sm p-4">
          <Text className="font-bold mb-2">No New notifications</Text>
          <Text>Looks like you haven’t received any notifications.</Text>
        </Box>}

      </MainWapper>
    </>
  );
}