import { StyleSheet, Text, View,Image, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from '@expo/vector-icons/MaterialIcons';
import axios from 'axios';
import api from '../services/ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { useNavigation } from '@react-navigation/native';


const Contact = ({id}) =>{
    const [info, setInfo] =useState('');
    const [id_company] = useState(id)
    useEffect(()=>{
        axios.get(`${api.baseURL}/info_bussiness/${id_company}`)
        .then(res => {setInfo(res.data) 
            // console.log(res.data)
        })
        .catch(e => console.log(e))
    },[])
        return (
            <>
            {info !== '' ? (<View style={{ minHeight: 300, backgroundColor: 10, marginHorizontal: 10, padding: 10 }}>
                <Text style={{ fontWeight: 'bold', color: 'gray' }}>{info.name}</Text>
                <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                    <View style={{ height: 60, width: 60, backgroundColor: '#FAEBD7', justifyContent: 'center', alignItems: 'center', borderRadius: 30 }}>
                        <Icon color={'#FF6F00'} name='location-on' size={40} />
                    </View>
                    <View style={{ flex: 1, marginHorizontal: 10, borderBottomWidth: 1, borderColor: 'lightgray' }}>
                        <Text style={{ color: 'gray', fontSize: 12 }}>Địa chỉ công ty</Text>
                        <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{info.business__info[0].address}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                    <View style={{ height: 60, width: 60, backgroundColor: '#FAEBD7', justifyContent: 'center', alignItems: 'center', borderRadius: 30 }}>
                        <Icon color={'#FF6F00'} name='email' size={40} />
                    </View>
                    <View style={{ flex: 1, marginHorizontal: 10, borderBottomWidth: 1, borderColor: 'lightgray' }}>
                        <Text style={{ color: 'gray', fontSize: 12 }}>email</Text>
                        <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{info.email}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                    <View style={{ height: 60, width: 60, backgroundColor: '#FAEBD7', justifyContent: 'center', alignItems: 'center', borderRadius: 30 }}>
                        <Icon color={'#FF6F00'} name='phone-android' size={40} />
                    </View>
                    <View style={{ flex: 1, marginHorizontal: 10, borderBottomWidth: 1, borderColor: 'lightgray' }}>
                        <Text style={{ color: 'gray', fontSize: 12 }}>Số điện thoại</Text>
                        <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{info.business__info[0].phone}</Text>
                    </View>
                </View>
            </View>) : 
    ( <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size='large' color={'#FF6F00'} />
      </View>)}
            </>
        )
    
}
const Header = ({job_post_id})=>{
    // console.log(job_post_id)
    const navigation =useNavigation();
    const [favorite,setFavorite] =useState(false);
    const [token, setToken] = useState('');
    useState(async () => {
        setToken(await AsyncStorage.getItem('token'))
    })
    console.log(token)
    useEffect(()=>{
        if(token !== ''){
            axios.get(`${api.baseURL}/favorite/${job_post_id}`,
            {
            headers:{
                authorization: `Bearer ${token}`,
            }}).then(res=>{
                setFavorite(res.data.favorite);
            }).catch(e=>{
                setFavorite(false);
            })
        }
    },[token])
    return(
        <View style={styles.header}>
                <TouchableOpacity onPress={()=>navigation.goBack()} style={{flex:1,backgroundColor: '#fff',justifyContent: 'center' , alignItems: 'center'}}>
                    <Icon name='arrow-back-ios' size={25} />
                </TouchableOpacity>
                <View style={{flex:6, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontWeight: 'bold', fontSize: 16}}>{'Chi tiết việt làm'}</Text>
                </View>
                    {favorite ? (
                <TouchableOpacity  
                    onPress={async () => {
                    // console.log({job_post_id})
                    await axios.delete(`${api.baseURL}/favorite/${job_post_id}`, {
                        headers: {
                            authorization: `Bearer ${token}`,
                        }
                    }).then(res => {
                        if(res.status === 200) 
                        setFavorite(false);
                    }).catch(e => {
                        console.log(e);
                    })
                }} style={{flex:1,justifyContent:'center', alignItems:'center'}}>
                    <Icon name='favorite' color={'#FF6F00'}  size={25}/>
                </TouchableOpacity>):(
                <TouchableOpacity
                        onPress={async () => {
                            // console.log({job_post_id})
                            await axios.post(`${api.baseURL}/favorite`,{job_post_id}, {
                                headers: {
                                    authorization: `Bearer ${token}`,
                                }
                            }).then(res => {
                                if(res.status === 201) 
                                setFavorite(true);
                            }).catch(e => {
                                if(e.response.status===401)
                                navigation.navigate('Login');
                            })
                        }}
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Icon name='favorite-outline' size={25}/>
                </TouchableOpacity>)
                    }
        </View>
    )
}

const DetailJobsScreen = ({ route }) => {
    //  console.log(route.params)
    const navigation = useNavigation();
    const [token,setToken] = useState('');
    const [user,setUser] = useState('')
    const [job, setJob] = useState(route.params);
    const [more, setMore] = useState(false)
    const [showContent,setShowContent] = useState('job')
    const [deadline, setDealine] = useState('');
    useState(async () => {
        const currentDate = new Date();
        const dl = new Date(route.params.deadline);
        let timeDiff = dl.getTime() - currentDate.getTime();
        let daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
        setDealine(daysLeft);
        setToken(await AsyncStorage.getItem('token'))
    })
    return (
        <View style={{ height: '100%', backgroundColor: '#fff',  }}>
            <Header job_post_id={job.id}/>
            <View style={{flex: 2,paddingHorizontal: 10,marginTop:10}}>
                <View style={{flexDirection: 'row'}}>
                <Image source={{uri:`${api.baseURL}/image/${job.company.avatar}`}} style={{height: 80 ,width: 80}} />
                <View style={{flex: 1, marginHorizontal: 10}}>
                    <Text style={{fontWeight: 'bold'}} numberOfLines={2}>{job.title}</Text>
                    <Text style={{color:'gray',fontSize: 12}} numberOfLines={2}>{job.company.name}</Text>
                </View> 
                {/* <TopTabs> */}
                </View>
                <View style={{ flexDirection: 'row',marginTop: 5 }}>
                    <TouchableOpacity onPress={()=>setShowContent('job')} style={{ flex: 1 , backgroundColor: '#DEE3E5',padding: 10,borderRadius: 10,margin: 5}}>
                     {showContent === 'job' ? (<Text style={{fontSize: 12, color: '#FF6F00'}}>Thông tin công việc</Text>):(<Text style={{fontSize: 12,}}>Thông tin công việc</Text>)}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>setShowContent('contact')}  style={{ flex: 1 , backgroundColor: '#DEE3E5',padding: 10,borderRadius: 10,margin: 5}}>
                    {showContent === 'contact' ? (<Text style={{fontSize: 12, color: '#FF6F00'}}>Thông tin liên hệ</Text>):(<Text style={{fontSize: 12,}}>Thông tin liên hệ</Text>)}
                    </TouchableOpacity>
                </View>
                
            </View>
            
            <View style={{flex: 8}}>
                <ScrollView>
                    {showContent === 'job' ? ( <>
                    <View style={{minHeight: 320,backgroundColor: 10,marginHorizontal:10,padding: 10}}>
                        <Text style={{fontWeight: 'bold',color:'gray'}}>Thông tin chung</Text>
                        <View style={{flexDirection:'row',paddingVertical: 10}}>
                            <View style={{height: 60, width:60, backgroundColor: '#FAEBD7',justifyContent:'center',alignItems:'center',borderRadius: 30}}>
                                <Icon color={'#FF6F00'} name='local-atm' size={40}/>
                            </View>
                            <View style={{flex:1,marginHorizontal:10, borderBottomWidth: 1,borderColor: 'lightgray'}}>
                                <Text style={{color: 'gray',fontSize:12}}>Mức lương</Text>
                                <Text style={{fontSize:12,fontWeight:'bold'}}>{job.salary}</Text>
                            </View>
                        </View>
                        <View style={{flexDirection:'row',paddingVertical: 10}}>
                            <View style={{height: 60, width:60, backgroundColor: '#FAEBD7',justifyContent:'center',alignItems:'center',borderRadius: 30}}>
                                <Icon color={'#FF6F00'} name='card-travel' size={40}/>
                            </View>
                            <View style={{flex:1,marginHorizontal:10, borderBottomWidth: 1,borderColor: 'lightgray'}}>
                                <Text style={{color: 'gray',fontSize:12}}>Hình thức làm việc</Text>
                                <Text style={{fontSize:12,fontWeight:'bold'}}>{job.type}</Text>
                            </View>
                        </View>
                        <View style={{flexDirection:'row',paddingVertical: 10}}>
                            <View style={{height: 60, width:60, backgroundColor: '#FAEBD7',justifyContent:'center',alignItems:'center',borderRadius: 30}}>
                                <Icon color={'#FF6F00'} name='group' size={40}/>
                            </View>
                            <View style={{flex:1,marginHorizontal:10, borderBottomWidth: 1,borderColor: 'lightgray'}}>
                                <Text style={{color: 'gray',fontSize:12}}>Số lượng cần tuyển</Text>
                                <Text style={{fontSize:12,fontWeight:'bold'}}>{job.quantity}</Text>
                            </View>
                        </View>
                        {more && <><View style={{flexDirection:'row',paddingVertical: 10}}>
                            <View style={{height: 60, width:60, backgroundColor: '#FAEBD7',justifyContent:'center',alignItems:'center',borderRadius: 30}}>
                                <Icon color={'#FF6F00'} name='location-city' size={40}/>
                            </View>
                            <View style={{flex:1,marginHorizontal:10, borderBottomWidth: 1,borderColor: 'lightgray'}}>
                                <Text style={{color: 'gray',fontSize:12}}>Nơi làm việc</Text>
                                <Text style={{fontSize:12,fontWeight:'bold'}}>{job.location}</Text>
                            </View>
                        </View>
                        <View style={{flexDirection:'row',paddingVertical: 10}}>
                            <View style={{height: 60, width:60, backgroundColor: '#FAEBD7',justifyContent:'center',alignItems:'center',borderRadius: 30}}>
                                <Icon color={'#FF6F00'} name='content-paste' size={40}/>
                            </View>
                            <View style={{flex:1,marginHorizontal:10, borderBottomWidth: 1,borderColor: 'lightgray'}}>
                                <Text style={{color: 'gray',fontSize:12}}>Vị trí tuyển dụng</Text>
                                <Text style={{fontSize:12,fontWeight:'bold'}}>{job.position}</Text>
                            </View>
                        </View>
                        </>}
                        {more ? (<TouchableOpacity onPress={()=>setMore(false)} activeOpacity={0.8} style={{alignItems:'center'}}>
                             <Text style={{fontSize:12,fontWeight:'bold',color: '#FF6F00'}}>Thu gọn</Text>
                        </TouchableOpacity>):(<TouchableOpacity onPress={()=>setMore(true)} activeOpacity={0.8} style={{alignItems:'center'}}>
                             <Text style={{fontSize:12,fontWeight:'bold',color: '#FF6F00'}}>Xem thêm</Text>
                        </TouchableOpacity>)}
                    </View>
                    <View style={{minHeight: 320,backgroundColor: 10,marginHorizontal:10,padding: 10,marginTop: 10}}>
                        <Text style={{fontWeight: 'bold',color:'gray'}}>Mô tả công việc</Text>
                        <Text style={{fontSize: 12}}>{job.description}</Text>
                    </View>
                    <View style={{minHeight: 320,backgroundColor: 10,marginHorizontal:10,padding: 10,marginTop: 10}}>
                        <Text style={{fontWeight: 'bold',color:'gray'}}>Yêu cầu</Text>
                        <Text style={{fontSize: 12}}>{job.requirement}</Text>
                    </View>
                    <View style={{minHeight: 320,backgroundColor: 10,marginHorizontal:10,padding: 10,marginTop: 10}}>
                        <Text style={{fontWeight: 'bold',color:'gray'}}>Quyền lợi</Text>
                        <Text style={{fontSize: 12}}>{job.benefit}</Text>
                    </View>
                    </>): ( <>
                        <Contact id={job.company.id} />
                      
                    </>)}
                   
                    
                </ScrollView>
            </View>
            <View style={{flex: 1,flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                    <TouchableOpacity onPress={()=>{
                        if(token!==null){
                            // navigation.navigate({name: 'Apply',params: job.id})
                        }else{
                            navigation.navigate({name: 'Login'})
                        }
                    }} style={{margin:10,borderColor:'#FF6F00',borderWidth:1,padding:10,borderRadius: 20,alignItems:'center'}}>
                        <Text style={{color: '#FF6F00'}}>Liên hệ</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1}}>
                    <TouchableOpacity 
                    onPress={()=>{
                        if(token!==null){
                            navigation.navigate({name: 'Apply',params: job.id})
                        }else{
                            navigation.navigate({name: 'Login'})
                        }}}
                    
                    style={{margin:10,backgroundColor:'#FF6F00',padding:10,borderRadius: 20,alignItems:'center'}}>
                        <Text style={{color: 'white'}}>ứng tuyển ngay</Text>
                    </TouchableOpacity>
                </View>
              
                
            </View>
        </View>
    )


}
export default DetailJobsScreen

const styles = StyleSheet.create({
    header: {
        height: 50,
        flexDirection: 'row',
        borderBottomWidth: 1,
        marginHorizontal: 5,
        borderColor: 'lightgray'
    }
})