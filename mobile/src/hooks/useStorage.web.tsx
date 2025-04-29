export const getData = async (key: any) => {
  try {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : undefined;
  } catch (error) {
    console.error('AsyncStorage getItem error:', error);
  }
};

export const setData = async (key: any, value: any) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('AsyncStorage setItem error:', error);
  }
};

export const removeData = async (key: any) => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error('AsyncStorage removeItem error:', error);
  }
};