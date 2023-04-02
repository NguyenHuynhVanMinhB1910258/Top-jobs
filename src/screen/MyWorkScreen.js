import React , {useState,useEffect} from 'react';
import { View, StyleSheet, Dimensions, StatusBar,ImageBackground,Text,TouchableOpacity, Animated,ScrollView, Image } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import PlaceholderCard from './PPlaceholderLoadingCard';
import { useNavigation } from '@react-navigation/native';
import { Job } from './HomeScreen'
import api from '../services/ApiService';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const FirstRoute = () => {
  const navigation = useNavigation();
  const [jobs,setJobs] = useState([]);
  const [token,setToken] = useState('');
  useState(async ()=>{
    setToken(await AsyncStorage.getItem('token'))
  })
  // console.log(jobs)
  useEffect(()=>{
    if(token !== ''){
      axios.get(`${api.baseURL}/Jobs/favorite`,{
        headers:{
          Authorization : `Bearer ${token}`
        }
      }).then(res=>{
        setJobs(res.data);
      }).catch(e=>{
        console.log(e);
      })
    }
  },[token])
  if(token===null){
    return(
       <View style={[styles.container, { alignItems :'center', backgroundColor: '#fff'}]} >
          <Image style={{height: 300,width:300}} source={require('../../assets/notfoundlogin.png')}></Image>
          <Text>Vui lòng đăng nhập!</Text>
          <TouchableOpacity 
          onPress={()=>{navigation.navigate('Login')}}
          style={{width: 120,backgroundColor: '#6A9DCB',marginTop: 10,justifyContent:'center',alignItems:'center',padding: 5,borderRadius: 5}}>
            <Text>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
    )
  }
  return(
     <View style={[styles.container, { alignItems :'center', marginTop: 20}]} >
        <ScrollView showsHorizontalScrollIndicator style={{}}>
        {jobs.length > 0 ? (jobs.map((job)=><Job key={job.id} job={job}></Job>)):
        (<>
          <PlaceholderCard/>
          <PlaceholderCard/>
          <PlaceholderCard/>
          <PlaceholderCard/>
        </>)}
        </ScrollView>
     </View>
  )
 }
const SecondRoute = () => {
  const [jobs,setJobs] = useState([]);
  const [token,setToken] = useState('');
  useState(async ()=>{
    setToken(await AsyncStorage.getItem('token'))
  })
  // console.log(jobs)
  useEffect(()=>{
    if(token !== ''){
      axios.get(`${api.baseURL}/Jobs/application`,{
        headers:{
          Authorization : `Bearer ${token}`
        }
      }).then(res=>{
        setJobs(res.data);
      }).catch(e=>{
        console.log(e);
      })
    }
  },[token])
  if(token===null){
    return(
       <View style={[styles.container, { alignItems :'center', backgroundColor: '#fff'}]} >
          <Image style={{height: 300,width:300}} source={require('../../assets/notfoundlogin.png')}></Image>
          <Text>Vui lòng đăng nhập!</Text>
          <TouchableOpacity 
            onPress={()=>{navigation.navigate('Login')}}
          style={{width: 120,backgroundColor: '#6A9DCB',marginTop: 10,justifyContent:'center',alignItems:'center',padding: 5,borderRadius: 5}}>
            <Text>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
    )
  }
  return(
     <View style={[styles.container, { alignItems :'center', marginTop: 20}]} >
        <ScrollView showsHorizontalScrollIndicator style={{}}>
        {jobs.length > 0 ? (jobs.map((job)=><Job key={job.id} job={job}></Job>)):
        (<>
          <PlaceholderCard/>
          <PlaceholderCard/>
          <PlaceholderCard/>
          <PlaceholderCard/>
        </>)}
        </ScrollView>
     </View>
  )
}


export default class MyWorkScreen extends React.Component {
  state = {
    index: 0,
    routes: [
      { key: 'first', title: 'Đã lưu' },
      { key: 'second', title: 'Đã ứng tuyển' },
    ],
  };
  _handleIndexChange = (index) => this.setState({ index });

  _renderTabBar = (props) => {
    const inputRange = props.navigationState.routes.map((x, i) => i);

    return (
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          const isfocused = props.navigationState.index === i;
          const opacity = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map((inputIndex) =>(
                inputIndex === i ? 1 : 0.5
            )
              // const isfocused = inputIndex === i
              
            ),
          });

          return (
            <TouchableOpacity key ={i}
              style={[styles.tabItem,{ 
                  backgroundColor: '#fff',
                  shadowColor: isfocused ? '#FF6F00' : '#fff',
                  shadowOffset:  { width: 0, height: 2 } ,
                  shadowOpacity:  0.9 ,
                  shadowRadius:  2 ,
                  elevation:  10 ,
              }]}
              onPress={() => this.setState({ index: i })}>
              <Animated.Text style={[{ opacity },{color: isfocused ? '#FF6F00' : 'gray'}]}>{route.title}</Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  _renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });
  render() {
    return (
     
    <View style= {{flex:1}}>
      <ImageBackground style={{height:125,justifyContent: 'flex-end'}} source={require('../../assets/findimg.png')}>
        <Text style={{color: 'white', fontWeight:'bold',fontSize: 25,paddingHorizontal:10}}>Việc của tôi</Text>
      </ImageBackground>
      <TabView
        navigationState={this.state}
        renderScene={this._renderScene}
        renderTabBar={this._renderTabBar}
        onIndexChange={this._handleIndexChange}
      />
    </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    // paddingTop: StatusBar.currentHeight,
  },
  tabItem: {
    flex: 1,
    marginHorizontal:1,
    alignItems: 'center',
    padding: 16,
  },
  // isfocused:{

  // }
});
// import * as React from 'react';
// import { View, StyleSheet, Dimensions, StatusBar } from 'react-native';
// import { TabView, SceneMap } from 'react-native-tab-view';


