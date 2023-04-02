import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoadingScreen from './src/screen/LoadingScreen';
import LoginScreen from './src/screen/LoginScreen';
import HomeScreen from './src/screen/HomeScreen';
import MyWorkScreen from './src/screen/MyWorkScreen';
import ApplicationForm from './src/screen/ApplicationFormScreen';
import ProfileScreen1 from './src/screen/ProfileScreen';
import ListJobsScreen from './src/screen/ListJobsScreen';
import DetailJobsScreen from './src/screen/DetailJobsScreen';
import SearchScreen from './src/screen/SearchScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useState,useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import EntypoIcon from '@expo/vector-icons/MaterialIcons';
// import { Icon } from '@expo/vector-icons/build/createIconSet';
// import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';

const Tab = createBottomTabNavigator();
const TabApp = ({navigation,route}) => {
  const [user,setUser] = useState(route.params);

  return(
  <Tab.Navigator screenOptions={({headerShown,route,swipeEnable})=>({
    headerShown: false,
    tabBarIcon: ({ focused,color, size }) => {
      let nameicon;
      if (route.name === 'Home') {
        nameicon = focused ? 'home' : 'home-outline'
        return ( 
         <Icon name={nameicon} color={color} size={size}></Icon>
        );
      } 
      if(route.name === 'Post'){
        nameicon= focused ? 'note-edit' : 'note-edit-outline' ;
        return (
          <Icon name = {nameicon} color={color} size={size}></Icon>
        );
      }
      if(route.name === 'MyWorkScreen'){
        nameicon = focused ? 'work' : 'work-outline'
        return (
          <EntypoIcon name = {nameicon} color={color} size={size} />
        );
      }
      if(route.name === 'Profile'){
        nameicon = focused ? 'account' : 'account-outline'
        return (
          <Icon name ={nameicon} color={color} size={size}></Icon>
        );
      }
    },
    tabBarInactiveTintColor:'gray',
    tabBarActiveTintColor: '#FF6F00',
    // tabBarAc
  })} >
    <Tab.Screen name='Home' component={HomeScreen} initialParams={user} options={{tabBarLabel:'Trang chủ'}} />
    {/* <Tab.Screen name='Post' component={PostScreen} initialParams={route.params} options={{tabBarLabel:'Đăng tin'}} />
    <Tab.Screen name='add' component={JobPostingForm} options={{tabBarButton: ()=><TouchableOpacity onPress={()=>{}}><Text>Add</Text></TouchableOpacity>}}/> */}
    <Tab.Screen name='MyWorkScreen' component={MyWorkScreen} options={{tabBarLabel:'Việc làm của tôi'}}/>
    <Tab.Screen name='Profile' component={ProfileScreen1} options={{tabBarLabel:'Cá Nhân'}}/>
  </Tab.Navigator>
  )
  
}
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
          {/* <Stack.Screen name='Test' component={Test}/> */}
          <Stack.Screen name='Loading' component={LoadingScreen}/>
          <Stack.Screen name='Tab' component={TabApp}/>
          <Stack.Screen name='Login' component={LoginScreen}/>
          <Stack.Screen name='ListJob' component={ListJobsScreen} options={{headerShown:true,title: 'Danh sách công việc làm'}}/>
          <Stack.Screen name='Details' component={DetailJobsScreen}/>
          <Stack.Screen name='Search' component={SearchScreen}/>
          <Stack.Screen name='Apply' component={ApplicationForm} options={{headerShown:true,title: 'Ứng tuyển ngay'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
