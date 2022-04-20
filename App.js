import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Button,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const App = () => {
  const today = new Date();
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [date, setDate] = useState(new Date(today));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  useEffect(() => {
    let today = new Date();
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };
  return (
    <View style={{flex: 1}}>
      <View style={{height: '15%', justifyContent: 'center', alignItems: 'center', marginTop: '10%'}}>
        <Text style={{fontSize: 50, fontWeight: 'bold', color: 'green'}}>Minumobat.app!</Text>
      </View>
      <Text style={{textAlign: 'center', fontSize: 20, fontWeight: '800'}}>Mau minum obat jam berapa?</Text>
      <View style={{height: '15%', justifyContent: 'center', alignItems: 'center', marginTop: '5%'}}>
        <Text style={{fontSize: 35, color: 'navy'}}>{date.toLocaleString()}</Text>
      </View>
      <TouchableOpacity style={{marginTop: '5%', height: '5%', marginHorizontal: '10%', backgroundColor: 'cyan', justifyContent: 'center'}} 
      onPress={showTimepicker}>
        <Text style={{textAlign: 'center', color: 'blue'}}>Ubah jam!</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{marginTop: '5%', height: '5%', marginHorizontal: '10%', backgroundColor: 'cyan', justifyContent: 'center'}} 
      onPress={async () => {
            await schedulePushNotification();
          }}>
        <Text style={{textAlign: 'center', color: 'blue'}}>Ingatkan lewat notifikasi</Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          onChange={onChange}
        />
      )}
    </View>
  )
};

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Minumobat.app!",
      body: 'Waktunya minum obat.',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 1 },
  });
}

async function registerForPushNotificationsAsync() {


  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
}

export default App;