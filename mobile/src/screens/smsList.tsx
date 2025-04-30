import React, { useContext, useEffect, useState } from 'react';
import { AppState, PermissionsAndroid, Platform } from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';

import { MainContext } from '@/src/contexts';

import { useAddData } from '../hooks';

function formatTimestamp(millis: any) {
    const date = new Date(millis);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}

function parseTransactionAmount(smsBody: any) {
    // Match both credit and debit patterns
    const debitPattern = /Rs\.(\d+\.\d{2})\s+spent\s+on\s+your\s+([a-zA-Z]+)\s+(Credit Card|Debit Card)/i;
    const creditPattern = /Rs\.(\d+\.\d{2})\s+credited\s+to\s+your\s+([a-zA-Z]+)\s+(Account|Card)/i;

    const isDebit = debitPattern.test(smsBody);
    const isCredit = creditPattern.test(smsBody);

    if (!isDebit && !isCredit) return {};

    // Extract amount
    const amountMatch = smsBody.match(/Rs\.(\d+\.\d{2})/i);
    if (!amountMatch) return {};
    return {
        debit: isDebit ? parseFloat(amountMatch[1]) : 0,
        credit: isDebit ? 0 : parseFloat(amountMatch[1]),
        transaction_type: isDebit ? 'debit' : 'credit',
    };
}

const doctype = "SMS List"

export default function SmsList() {
    const { user } = useContext(MainContext)
    const bodyRegex = '.*(credited|debited|deposited|withdrawn|transaction|card|account|bank|upi|rs\\.?\\s?\\d+|inr\\s?\\d+|balance|payment|receive|send|imps|neft|rtgs|ref no|upi ref).*';
    const [search, setSearch] = useState<any>({ box: 'inbox', bodyRegex, indexFrom: 0, maxCount: 10 });
    const [hasPermission, setHasPermission] = useState(false);

    const mutation = useAddData((data: any) => {

    });

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
                    (_: any, smsList: any) => {
                        const arr = JSON.parse(smsList);
                        // Process the messages
                        for (let item of arr) {
                            let amounts = parseTransactionAmount(item?.body)
                            let value: any = {
                                doctype,
                                body: {
                                    ...item,
                                    message_id: item?._id,
                                    date: formatTimestamp(item?.date),
                                    date_sent: formatTimestamp(item?.date_sent),
                                    user_id: user?.id,
                                    ...amounts
                                }
                            };
                            mutation.mutate(value);
                        }

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

    return (
        <>

        </>
    );
}