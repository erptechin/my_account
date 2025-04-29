import { useEffect, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { SwipeListView } from 'react-native-swipe-list-view';

import { Box, HStack, Pressable, Text, View, VStack, Spinner } from "@/src/components";
import { BottomTabs, MainWapper } from "@/src/components/utility";

import { useInfo, useFeachData, useDeleteData } from '@/src/hooks';

const doctype = "Payment Entry"
const fields = ['title', 'status', 'posting_date']

export default function Account() {
  const navigation = useNavigation();
  const [cases, setCases] = useState([]);

  const { data: info } = useInfo({ doctype, fields: JSON.stringify(fields) });
  const [search, setSearch] = useState<any>({ doctype, page: 1, page_length: 10, fields: null });
  const { data, isLoading } = useFeachData(search);

  useEffect(() => {
    if (info?.fields) {
      const fieldnames = info?.fields.map((field: any) => field.fieldname);
      setSearch({ ...search, fields: JSON.stringify([...fieldnames, "name"]) })
    }
  }, [info])

  useEffect(() => {
    if (data?.data) {
      setCases(data?.data)
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
        <Text className='text-[15px] font-medium text-text-dark pt-2'>{item?.title}</Text>
        <Text className='text-xs text-text-light'>Date:<Text className='text-text-dark'> {(item?.posting_date)}</Text></Text>
        <Text className='text-xs text-text-light'>Status:<Text className='text-tertiary text-xs'> {item?.status}</Text></Text>
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

  console.log('cases ', cases)
  
  return (
    <>
      <MainWapper backgroundColor={'rgb(245, 247, 249)'} refreshing={isLoading}>
        <Box className='pb-20'>
          {isLoading && (<Spinner size="large" color={'rgb(29,191,115)'} />)}
          <SwipeListView
            data={cases}
            renderItem={renderComplaint}
            renderHiddenItem={renderHiddenItem}
            rightOpenValue={-75}
          />
        </Box>
      </MainWapper>
      <BottomTabs navigation={navigation} activeTab="Account" />
    </>
  );
}