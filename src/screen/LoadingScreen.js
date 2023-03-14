import { View, Text ,Image } from 'react-native'
import React, { useState, useEffect } from 'react'
// import auth from '@react-native-firebase/auth'
// import { LinearGradient } from 'expo-linear-gradient';
import useAxios from '../services/UseAxois';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import api from '../services/ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoadingScreen() {
  const navigation = useNavigation();
  const [token, settoken] = useState('');
  console.log(token)
  useState(async () => {settoken(await AsyncStorage.getItem('token'))})
  useEffect(() => {
    if (token !== '') {
      axios.get(`${api.baseURL}/user`,{
        headers: {
          authorization: `Bearer ${token}`,
        }
      }).then(res => {
        console.log(res.data)
        navigation.reset({
          index: 0,
          routes: [{ name: 'Tab', params: res.data }]
        })
      }).catch(e => {
        console.log(e)
        navigation.reset({
          index: 0,
          routes: [{ name: 'Tab' }]
        })
      })
    }
    else if(token === null ) {
      navigation.reset({
          index: 0,
          routes: [{ name: 'Tab' }]
        })
    }
  }, [token])
  return (
    <View style={{ backgroundColor: '#fff', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
      <Image style={{height:200,width:200}} source={require('../../assets/logo.png') }></Image>
    </View>
  )
}