import AsyncStorage from '@react-native-async-storage/async-storage';

export const getData = async (key: any) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : undefined;
  } catch (error) {
    console.error('AsyncStorage getItem error:', error);
  }
};

export const setData = async (key: any, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('AsyncStorage setItem error:', error);
  }
};

export const removeData = async (key: any) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('AsyncStorage removeItem error:', error);
  }
};