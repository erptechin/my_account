import React, { useContext, useEffect, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { SwipeListView } from 'react-native-swipe-list-view';

import SmsList from "./smsList";

import { MainContext } from '@/src/contexts';

import { Box, View, Text, HStack, VStack, Heading, Pressable } from "@/src/components";
import { BottomTabs, MainWapper } from "@/src/components/utility";
import { useInfo, useFeachData, useDeleteData } from '@/src/hooks';

const doctype = "SMS List"
const fields = ['debit', 'credit', 'transaction_type', 'address', 'date']

export default function Home() {
  const { user, token } = useContext(MainContext)
  const navigation = useNavigation();
  const [total, setTotal] = useState<any>({});
  const [list, setList] = useState([]);

  const { data: info } = useInfo({ doctype, fields: JSON.stringify(fields) });
  const [search, setSearch] = useState<any>({ doctype, page: 1, page_length: 100, fields, filters: JSON.stringify([[doctype, "user_id", "=", user?.id]]), or_filters: JSON.stringify([[doctype, "credit", ">", 0], [doctype, "debit", ">", 0]]) });
  const { data, isLoading, refetch } = useFeachData(search);

  useEffect(() => {
    if (info?.fields) {
      const fieldnames = info?.fields.map((field: any) => field.fieldname);
      setSearch({ ...search, fields: JSON.stringify([...fieldnames, "name"]) })
    }
  }, [info])

  useEffect(() => {
    if (data?.data) {
      let total = { credit: 0, debit: 0, total: 0 }
      for (let item of data?.data) {
        if (item?.transaction_type == 'credit') {
          total['credit'] += item?.credit
          total['total'] += item?.credit
        } else {
          total['debit'] += item?.debit
          total['total'] -= item?.debit
        }
      }
      setList(data?.data)
      setTotal(total)
    }
  }, [data])

  const mutation = useDeleteData((data: any) => {

  });

  const renderComplaint = ({ item }: any) => (
    <HStack className='bg-background-light rounded-lg p-2 my-1 items-center'>
      <Box className="bg-[#FF000014] p-2 rounded-full flex justify-center items-center w-15 h-15">
        <FontAwesome name={"calendar-o"} size={20} color={"#FF0000"} />
      </Box>
      <VStack className='pl-2'>
        <Text className='text-[15px] font-medium text-text-dark pt-2'>{item?.address} - {item.date}</Text>
        <Text className='text-xs text-text-light'>Amount:<Text className={item?.transaction_type == 'credit' ? 'text-primary text-xs' : 'text-tertiary text-xs'}> {item?.transaction_type == 'credit' ? item?.credit : item?.debit}</Text></Text>
        <Text className='text-xs text-text-light'>Type:<Text className={item?.transaction_type == 'credit' ? 'text-primary text-xs' : 'text-tertiary text-xs'}> {item?.transaction_type}</Text></Text>
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
      <SmsList />
      <MainWapper backgroundColor={'rgb(29, 191, 115)'} padding onRefresh={refetch} refreshing={isLoading}>
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
        <Box className='m-2 pb-20'>

          <HStack className="content-center justify-between m-2">
            <Heading className='m-2'>My Data</Heading>
            <HStack>
              <Text className='text-lg m-2'>CR: <Text className={'text-primary'}>{total?.credit}</Text></Text>
              <Text className='text-lg m-2'>DR: <Text className={'text-tertiary'}>{total?.debit}</Text></Text>
              <Text className='text-lg m-2'>TOTAL: <Text className={total?.total > 0 ? 'text-primary' : 'text-tertiary'}>{total?.total}</Text></Text>
            </HStack>
          </HStack>

          <SwipeListView
            data={list}
            renderItem={renderComplaint}
            // renderHiddenItem={renderHiddenItem}
            rightOpenValue={-75}
          />
        </Box>
      </MainWapper>
      {/* <BottomTabs navigation={navigation} activeTab="Home" /> */}
    </>
  );
}