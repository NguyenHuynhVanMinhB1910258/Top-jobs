import { View, Text, TextInput,StyleSheet } from 'react-native'
import React from 'react'
import { Icon } from '@expo/vector-icons/build/FontAwesome'
export default function HeaderTab() {
  return (
    <View style={{ backgroundColor: '#fff', flex: 1, borderBottomColor: 'gray', flexDirection: 'row', borderBottomWidth: StyleSheet.hairlineWidth, }}>
          <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', flex: 1 }}>
          </View>
          <View style={{ flexDirection: 'row', backgroundColor: 'aliceblue', marginVertical: 10, flex: 6, borderRadius: 5, padding: 5 }}>
            <View style={{ justifyContent: 'center', }}>
              <Icon name='search' style={{ marginHorizontal: 10 }} color={'#330099'}></Icon>
            </View>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <TextInput backgroundColor={'#fff'} placeholder='Tìm kiếm..' style={{ backgroundColor: 'aliceblue' }}></TextInput>
            </View>
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', flex: 1 }}>
            <Icon name='filter' size={20} color={'#330099'}></Icon>
          </View>
    </View>
  )
}