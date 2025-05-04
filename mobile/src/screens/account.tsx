import React, { useContext, useEffect, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { SwipeListView } from 'react-native-swipe-list-view';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { MainContext } from '@/src/contexts';

import { Box, Text, HStack, VStack, View, Pressable, AlertDialog, AlertDialogContent } from "@/src/components";
import { MainWapper, DateBox } from "@/src/components/utility";
import { useInfo, useFeachData } from '@/src/hooks';
import { Formik } from 'formik';

const doctype = "SMS List"
const fields = ['debit', 'credit', 'transaction_type', 'address', 'date', 'body']

let date = new Date()
let year = date.getFullYear();
let month = String(date.getMonth() + 1).padStart(2, '0');
let lastDate = new Date(year, date.getMonth() + 1, 0).getDate();

export default function Account() {
  const { user } = useContext(MainContext)
  const [total, setTotal] = useState<any>({});
  const [list, setList] = useState([]);

  const { data: info } = useInfo({ doctype, fields: JSON.stringify(fields) });
  const [date, setDate] = useState({ start: `${year}-${month}-01`, end: `${year}-${month}-${lastDate}` });
  const [search, setSearch] = useState<any>({ doctype, page: 1, page_length: 100, fields, filters: JSON.stringify([[doctype, "date", "Between", [date.start, date.end]], [doctype, "user_id", "=", user?.id]]), or_filters: JSON.stringify([[doctype, "credit", ">", 0], [doctype, "debit", ">", 0]]) });
  const { data, isLoading, refetch } = useFeachData(search);
  const [subData, setSubData] = useState<any>(null)

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

  const onPressHandle = (value: any) => {
    setDate(value)
    setSearch({ ...search, filters: JSON.stringify([[doctype, "date", "Between", [value.start, value.end]], [doctype, "user_id", "=", user?.id]]) })
  }

  const renderComplaint = ({ item }: any) => (
    <HStack className='bg-background-light rounded-lg p-2 my-1 items-center'>
      <Box className="bg-[#FF000014] p-2 rounded-full flex justify-center items-center w-15 h-15">
        <FontAwesome name={"calendar-o"} size={20} color={"#FF0000"} />
      </Box>
      <Pressable onPress={() => setSubData(item)}>
        <VStack className='pl-2'>
          <Text className='text-[15px] font-medium text-text-dark pt-2'>{item?.address} - {item?.date}</Text>
          <Text className='text-xs text-text-light'>Amount:<Text className={item?.transaction_type == 'credit' ? 'text-primary text-xs' : 'text-tertiary text-xs'}> {item?.transaction_type == 'credit' ? item?.credit : item?.debit}</Text></Text>
          <Text className='text-xs text-text-light'>Type:<Text className={item?.transaction_type == 'credit' ? 'text-primary text-xs' : 'text-tertiary text-xs'}> {item?.transaction_type}</Text></Text>
        </VStack>
      </Pressable>
    </HStack>
  );

  return (
    <>
      <MainWapper backgroundColor={'rgb(29, 191, 115)'} padding onRefresh={refetch} refreshing={isLoading}>

        <Box className='p-3 text-primary bg-primary rounded-b-[60px] pb-5'>
          <Formik
            initialValues={date}
            onSubmit={(values) => onPressHandle(values)}
          >
            {({ handleSubmit }) => {
              return <HStack className='justify-center items-center'>
                <View className='mr-2 w-[135px]'>
                  <DateBox
                    icon={<Fontisto name={"date"} size={15} color={"#78787899"} />}
                    placeholder="DOB"
                    name="start"
                  />
                </View>
                <View className='mr-2 w-[135px]'>
                  <DateBox
                    icon={<Fontisto name={"date"} size={15} color={"#78787899"} />}
                    placeholder="DOB"
                    name="end"
                  />
                </View>
                <Pressable
                  className='bg-red-500 overflow-hidden rounded-xl mt-2 p-3'
                  onPress={() => handleSubmit()}
                >
                  <Text className='text-[15px] font-medium text-white'>Search</Text>
                </Pressable>
              </HStack>
            }}
          </Formik>
        </Box>

        <Box className='m-2 pb-20'>

          <HStack className="content-center justify-between m-2">
            <HStack>
              <Text className='text-lg m-2'>CR: <Text className={'text-primary'}>{total?.credit}</Text></Text>
              <Text className='text-lg m-2'>DR: <Text className={'text-tertiary'}>{total?.debit}</Text></Text>
              <Text className='text-lg m-2'>TOTAL: <Text className={total?.total > 0 ? 'text-primary' : 'text-tertiary'}>{total?.total}</Text></Text>
            </HStack>
          </HStack>

          <SwipeListView
            data={list}
            renderItem={renderComplaint}
            rightOpenValue={-75}
          />
        </Box>

        <AlertDialog isOpen={!!subData} onClose={() => setSubData(null)} size="md">
          <AlertDialogContent>
            <VStack className='pl-2 items-center'>
              <Text className='text-xl font-semibold text-text-dark py-2'>{subData?.address} - {subData?.date}</Text>
              <Text className='text-text-dark'> {subData?.body}</Text>
              <Pressable onPress={() => setSubData(null)} className='bg-red-500 rounded-3xl justify-center justify-items-center w-48 mt-10 mb-4 py-2 items-center'><Text className='text-[17px] text-white'>Close</Text></Pressable>
            </VStack>
          </AlertDialogContent>
        </AlertDialog>

      </MainWapper>
    </>
  );
}