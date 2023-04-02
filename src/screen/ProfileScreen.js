import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  Modal,
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import api from '../services/ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SysLoading from '../component/sys_loading';
const io = require('socket.io-client')
// import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
function Body({ user,setUser,ShowEditTag,concerned }) {
  const [avatar, setAvatar] = useState(user.avatar);
  // console.log(avatar)
  const [token, settoken] = useState('');
  useState(async () => {
    settoken(await AsyncStorage.getItem('token'))
  })
  const [image, setImage] = useState('');
  const [socket,setSocket] = useState('');
  // console.log(token)
  useEffect(()=>{
    setSocket(io(api.SocketURL,{
      transports: ['websocket']
    }))
  },[])
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.UIImagePickerPresentationStyle.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const data = new FormData();
      data.append('avatar',
        {
          uri: result.assets[0].uri,
          type: result.assets[0].type + '/jpeg',
          filename: 'avatar',
          name: 'avatar.jpeg'
        });
      console.log(data)
      axios({
        method: "post",
        url: `${api.baseURL}/user/${user.id}`,
        data: data,
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
      }).then(res=>{
        setUser(res.data)
        socket.emit('update-user',res.data)
      }).catch(e=>{
        console.log(e)
      })
      // setImage(result.assets[0]);
    }
  };
  if (user === '') {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f3f6' }}>
        <ActivityIndicator size='large' color={'#FF6F00'} />
      </View>
    )
  }
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <>
        {/* <LinearGradient colors={['#FF6F00','#FFA000']} style={{height: 300, width: '100%' }}> */}
        <Image
          style={styles.coverImage}
          source={{ uri: `${api.URL}/assets/img/bg-profile.jpg` }}
        />
        {/* </LinearGradient> */}
        <View style={styles.profileContainer}>
          {/* Profile Details */}
          <View>
            {/* Profile Image */}
            <TouchableOpacity onPress={pickImage} activeOpacity={1} style={styles.profileImageView}>
              <Image
                style={styles.profileImage}
                source={{
                  uri: api.baseURL + '/image/' + user.avatar,
                }}
              />
              <View style={{ position: 'absolute', height: 20, width: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 100, marginTop: 90, borderRadius: 10 }}>
                <Icon name='camera-alt'></Icon>
              </View>
            </TouchableOpacity>
            {/* Profile Name and Bio */}
            <View style={styles.nameAndBioView}>
              <Text style={styles.userFullName}>{user.name}</Text>
              <Text style={styles.userBio}>{user.email}</Text>
            </View>
            <View style={styles.allTag}>
                <Text style={{fontWeight:'bold'}}>Bạn đang quan tâm:</Text>
                <View style={{flexDirection: 'row',flexWrap: 'wrap'}}>
                  {concerned.map((item,i)=><Text style={styles.TagItem} key={i}>{item}</Text>)}
                </View>
                <Icon onPress={ShowEditTag} name='edit' size={20} style={{alignSelf: 'flex-end'}}></Icon>
            </View>
            {/* Posts/Followers/Following View */}
            <View style={styles.countsView}>
              <View style={styles.countView}>
                <Text style={styles.countNum}>13</Text>
                <Text style={styles.countText}>Đã ứng tuyển</Text>
              </View>
              {/* <View style={styles.countView}>
                <Text style={styles.countNum}>1246</Text>
                <Text style={styles.countText}>Followers</Text>
              </View> */}
              <View style={styles.countView}>
                <Text style={styles.countNum}>348</Text>
                <Text style={styles.countText}>Tin đã lưu</Text>
              </View>
            </View>
          </View>
        </View>
      </>
    </ScrollView>
  )
}

function Header({ ShowSetting, title }) {
  const navigation = useNavigation()
  return (
    <View style={{ height: 50, flexDirection: 'row', borderBottomWidth: StyleSheet.hairlineWidth }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* <Icon name='search' size={20}></Icon> */}
      </View>
      <View style={{ flex: 6, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{title}</Text>
      </View>
      <TouchableOpacity activeOpacity={0.8} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={ShowSetting}>
        <Icon name='settings' size={20}></Icon>
      </TouchableOpacity>
    </View>
  )
}
function EditTag({ visible, HideEditTag,concerned,AddConcerned,RemoveConcerned }){
  // const [concernedTag,setConcernedTag] = useState(concerned)
  // // console.log('re')
  // console.log(concerned)
  const [DataTag] = useState([
    {
      id: 1,
      title: 'Sinh Học'
    },
    {
      id: 2,
      title: 'Ngoại Ngữ'
    },
    {
      id: 3,
      title: 'Điện – Cơ Khí'
    },
    {
      id: 4,
      title: 'Ngân Hàng'
    },
    {
      id: 5,
      title: 'Thiết Kế Thời Trang'
    },
    {
      id: 6,
      title: 'Luật'
    },
    {
      id: 7,
      title: 'Du Lịch'
    },
    {
      id: 8,
      title: 'Kỹ Sư Xây Dựng'
    },
    {
      id: 9,
      title: 'Công Nghệ Thông Tin'
    },
    {
      id: 10,
      title: 'Marketing'
    },
    {
      id: 11,
      title: 'Quản Lý Nhân Sự'
    },
    {
      id: 12,
      title: 'Tài Chính/Đầu Tư'
    },
    {
      id: 13,
      title: 'Quản Lý Nhà Hàng, Khách Sạn'
    },

  ])
  return(
    <Modal visible={visible} transparent={true}>
      <View onPress={HideEditTag} style={{
        flex: 1,
        backgroundColor: 'rgba(00,00,00,.5)',
        justifyContent: 'flex-end',
        alignContent: 'center',
      }}>
        <View
          style={{
            flex: 1,
          }}
        >
          <TouchableOpacity animationType='fade' onPressOut={HideEditTag} style={{ flex: 1, backgroundColor: 'rgba(00,00,00,00)' }} />

          <View animationType='slide' style={{ flex: 4, backgroundColor: '#fff', paddingHorizontal: 10 }}>
            <Text style={{ fontWeight: 'bold', alignSelf: 'center' }}>Ngành Nghề</Text>
            <Text style={{ fontWeight: 'bold' }}>Quan tâm:</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', }}>
              {concerned.map((item,i)=> 
              <TouchableOpacity onPress={()=>{RemoveConcerned(item)}} activeOpacity={1} key={i} style={{ flexDirection: 'row',marginRight: 5, marginBottom: 5 }}>
                <Text style={{backgroundColor: 'lightgray', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 2}}>{item}</Text>
                <Icon name='close'style={{backgroundColor: 'white',marginLeft:-5,alignSelf: 'flex-start',borderRadius: 5}} size={10} />
              </TouchableOpacity>
              )}
            </View>
            <Text style={{ fontWeight: 'bold' }}>Tag Ngành Nghề:</Text>
              <ScrollView>
                <View style={{flexDirection: 'row',flexWrap: 'wrap'}}>
                {DataTag.map((item)=> concerned.indexOf(item.title) >= 0 ? 
                <TouchableOpacity activeOpacity={1} key={item.id} onPress={()=>{RemoveConcerned(item.title)}}>
                   <Text style={styles.TagItemFocus}>{item.title}</Text>
                </TouchableOpacity>
                : 
                <TouchableOpacity activeOpacity={1} key={item.id} onPress={()=>{AddConcerned(item.title)}}>
                  <Text style={styles.TagItem}>{item.title}</Text>
                </TouchableOpacity>
                
                )}
                </View>
              </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  )
}
function Setting({ visible, HideSetting, Loading }) {
  const navigation = useNavigation();
  const [token, settoken] = useState(null)
 
  useState(async () => { settoken(await AsyncStorage.getItem('token')) })
  const logout = async () => {
    Loading();
    await axios.post(`${api.baseURL}/logout`, {}, {
      headers: {
        authorization: `Bearer ${token}`,
      }
    }
    ).then(async res => {
      console.log(res.data)
      await AsyncStorage.removeItem('token')
      navigation.navigate('Loading')
      Loading();
    }).catch(e => {
      console.log(e)
      Loading();
    })
  }
  return (
    <Modal visible={visible} transparent={true}>
      <View onPress={HideSetting} style={{
        flex: 1,
        backgroundColor: 'rgba(00,00,00,.5)',
        justifyContent: 'flex-end',
        alignContent: 'center',
      }}>
        <View
          style={{
            flex: 1,
          }}
        >
          <TouchableOpacity animationType='fade' onPressOut={HideSetting} style={{ flex: 4, backgroundColor: 'rgba(00,00,00,00)' }} />

          <View animationType='slide' style={{ flex: 1 }} >
            <TouchableOpacity activeOpacity={0.9}
              style={{ borderTopEndRadius: 15, borderTopStartRadius: 15, paddingHorizontal: 10, flex: 1, backgroundColor: '#e6e6e6', }}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Icon name='info-outline' size={20} style={{ marginHorizontal: 10 }} />
                <Text>Thông tin chung</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.9}
              style={{ paddingHorizontal: 10, flex: 1, backgroundColor: '#e6e6e6', }}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Icon name='outlined-flag' size={20} style={{ marginHorizontal: 10 }} />
                <Text>Báo cáo</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.95} onPress={logout}
              style={{ paddingHorizontal: 10, flex: 1, backgroundColor: '#e6e6e6', }}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Icon name='logout' size={20} style={{ marginHorizontal: 10 }} />
                <Text>Đăng xuất</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}
export default function ProfileScreen1() {
  const navigation =useNavigation();
  const [showContent, setShowContent] = useState('Photos');
  const [visible, setVisible] = useState(false);
  const [edittag, setEditTag] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [concerned ,setConcerned] =useState([]);
  const [user, setUser] = useState('');
  const [token, settoken] = useState('');
  useState(async () => { settoken(await AsyncStorage.getItem('token')) });
  useEffect(() => {
    if (token !== '') {
      axios.get(`${api.baseURL}/user`, {
        headers: {
          authorization: `Bearer ${token}`,
        }
      }).then(res => {
        setUser(res.data)
      }).catch(e => {
        console.log(e);
      });

      axios.get(`${api.baseURL}/Tag`,{
        headers: {
          authorization: `Bearer ${token}`,
        }
      }).then(res=>{
        setConcerned(res.data);
      }).catch(e=>{
        console.log(e);
      })
    }
  }, [token])
   function AddConcerned(text){
   const title = text;
   setConcerned([text,...concerned]);
    axios.post(`${api.baseURL}/Tag`,{title},{
      headers: {
        authorization: `Bearer ${token}`,
      }
    }).then(res=>{
      // setConcerned([res.data.title,...concerned]);
    }).catch(e=>console.log(e))
   
  }
  function RemoveConcerned(text){
    const title = text;
    setConcerned(concerned.filter(item => item !== text));
    axios.delete(`${api.baseURL}/Tag`,{
      data: {title},
      headers: {
        authorization: `Bearer ${token}`,
      }
    }).then(res=>{
      console.log(res.data)
      // if(res.data !== 0){
      //   // setConcerned(concerned.filter(item => item !== text));
      // }
    }).catch(e=>console.log(e))
  }
  function ShowSetting() {
    setVisible(true)
  }
  function HideSetting() {
    setVisible(false)
  }
  function ShowEditTag() {
    setEditTag(true)
  }
  function HideEditTag() {
    setEditTag(false)
  }
  function changeloading() {
    setLoading(!Loading)
  }
    if(token===null){
      return(
         <View style={[styles.container, { alignItems :'center',justifyContent: 'center', backgroundColor: '#fff'}]} >
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
  
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <SysLoading visible={Loading}></SysLoading>
      <EditTag AddConcerned={AddConcerned} RemoveConcerned={RemoveConcerned} visible={edittag} concerned={concerned} HideEditTag={HideEditTag}></EditTag>
      <Setting visible={visible} HideSetting={HideSetting} Loading={changeloading} />
      <Header title={user.name} ShowSetting={ShowSetting} />
      <Body concerned={concerned} user={user} setUser={setUser} ShowEditTag={ShowEditTag} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1, backgroundColor: '#fff'
  },
  coverImage:
    { height: 300, width: '100%' },
  profileContainer: {
    // height: 1000,
    backgroundColor: '#fff',
    // backgroundColor:'red',
    marginTop: -100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  TagItem: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#FF6F00',
    color:'#FF6F00',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 5,
    marginBottom: 5
  },
  TagItemFocus:{
    backgroundColor: '#FF6F00', 
    color: '#fff', 
    paddingHorizontal: 10, 
    paddingVertical: 2, 
    borderRadius: 10, 
    marginRight: 5, 
    marginBottom: 5
  },
  profileImageView: { alignItems: 'center', marginTop: -50 },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#fff',
  },
  nameAndBioView: { alignItems: 'center', marginTop: 10 },
  allTag: { alignItems: 'flex-start', marginTop: 10 ,padding: 5},
  userFullName: { fontFamily: 'SSBold', fontSize: 26 },
  userBio: {
    fontFamily: 'SSRegular',
    fontSize: 18,
    color: '#333',
    marginTop: 4,
  },
  countsView: { flexDirection: 'row', marginTop: 20 },
  countView: { flex: 1, alignItems: 'center' },
  countNum: { fontFamily: 'SSBold', fontSize: 20 },
  countText: { fontFamily: 'SSRegular', fontSize: 18, color: '#333' },
  interactButtonsView: {
    flexDirection: 'row',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  interactButton: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: '#4b7bec',
    margin: 5,
    borderRadius: 4,
  },
  interactButtonText: {
    fontFamily: 'SSBold',
    color: '#fff',
    fontSize: 18,
    paddingVertical: 6,
  },
  profileContentButtonsView: {
    flexDirection: 'row',
    borderTopWidth: 2,
    borderTopColor: '#f1f3f6',
  },
  showContentButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#000',
  },
  showContentButtonText: {
    fontFamily: 'SSRegular',
    fontSize: 18,
  },
});