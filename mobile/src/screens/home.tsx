import React, { useContext, useEffect, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { SwipeListView } from 'react-native-swipe-list-view';
import SmsAndroid from 'react-native-get-sms-android';

import { MainContext } from '@/src/contexts';

import { Box, Text, HStack, VStack, Pressable } from "@/src/components";
import { MainWapper } from "@/src/components/utility";
import { useInfo, useFeachData, useAddData } from '@/src/hooks';
import { AppState, PermissionsAndroid, Platform } from 'react-native';
import { getData, setData } from "../hooks/useStorage";

function formatTimestamp(millis: any) {
  const date = new Date(millis);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

const doctype = "SMS List"
const fields = ['debit', 'credit', 'transaction_type', 'address', 'date']

let date = new Date()
let year = date.getFullYear();
let month = String(date.getMonth() + 1).padStart(2, '0');
let lastDate = new Date(year, date.getMonth() + 1, 0).getDate();

export default function Home() {
  const { user } = useContext(MainContext)
  const navigation = useNavigation();
  const [total, setTotal] = useState<any>({});
  const [list, setList] = useState([]);

  const bodyRegex = '.*(credited|debited|deposited|withdrawn|transaction|card|account|bank|upi|rs\\.?\\s?\\d+|inr\\s?\\d+|balance|payment|receive|send|imps|neft|rtgs|ref no|upi ref).*';
  const [searchSms, setSearchSms] = useState<any>({ box: 'inbox', sort: 'DESC', projection: ['_id'], bodyRegex, indexFrom: 0, maxCount: 10 });
  const [hasPermission, setHasPermission] = useState(false);
  const mutation = useAddData((data: any) => {

  });

  const { data: info } = useInfo({ doctype, fields: JSON.stringify(fields) });
  const [search, setSearch] = useState<any>({ doctype, page: 1, page_length: 100, fields, filters: JSON.stringify([[doctype, "date", "Between", [`${year}-${month}-01`, `${year}-${month}-${lastDate}`]], [doctype, "user_id", "=", user?.id]]), or_filters: JSON.stringify([[doctype, "credit", ">", 0], [doctype, "debit", ">", 0]]) });
  const { data, isLoading, refetch } = useFeachData(search);


  // Request SMS permissions
  const requestSMSPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_SMS,
          {
            title: 'SMS Read Permission',
            message: 'This app needs access to your SMS to read messages.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setHasPermission(true);
          getAllSMS(0);
        } else {
          console.log('SMS permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      // iOS - Note: Apple doesn't allow reading SMS except for specific cases
    }
  }

  // Get all SMS messages
  const getAllSMS = async (currentIndex: number) => {
    if (Platform.OS !== 'android') return;

    try {
      // Update the search index
      const updatedSearch = { ...search, indexFrom: currentIndex };
      setSearch(updatedSearch);

      await new Promise<void>((resolve, reject) => {
        SmsAndroid.list(
          JSON.stringify(updatedSearch),
          (fail: any) => {
            console.log('Failed with this error: ' + fail);
            reject(fail);
          },
          async (_: any, smsList: any) => {
            const arr = JSON.parse(smsList);
            let smsId = await getData('smsId') ?? null
            let tempSmsId = null
            // Process the messages
            for (let item of arr) {
              if (!smsId && smsId < item?._id) {
                tempSmsId = item?._id
                let value: any = {
                  doctype,
                  body: {
                    ...item,
                    message_id: item?._id,
                    date: formatTimestamp(item?.date),
                    date_sent: formatTimestamp(item?.date_sent),
                    user_id: user?.id,
                  }
                };
                mutation.mutate({ ...value, notAlert: true });
              }
            }
            if (tempSmsId) setData('smsId', tempSmsId)

            // Check if we should continue fetching
            if (arr.length === updatedSearch.maxCount) {
              // There might be more messages, fetch next batch
              getAllSMS(currentIndex + arr.length);
            }
            resolve();
          }
        );
      });
    } catch (error) {
      console.error('Error fetching SMS:', error);
    }
  };

  useEffect(() => {
    // Request permissions on component mount
    requestSMSPermission();

    // Check for SMS every time the app comes to foreground
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        getAllSMS(search.indexFrom);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);


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

  return (
    <>
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
          <Pressable
            className='bg-red-500 p-2 overflow-hidden rounded-lg my-5 mx-10'
            onPress={() => navigation.navigate('account')}
          >
            <Text className='text-[15px] font-medium text-white'>Show More...</Text>
          </Pressable>
        </Box>
      </MainWapper>
    </>
  );
}