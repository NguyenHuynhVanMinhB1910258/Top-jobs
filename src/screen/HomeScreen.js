import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Modal, Dimensions, StatusBar, TextInput, RefreshControl,ImageBackground, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import api from '../services/ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PlaceholderCard from './PPlaceholderLoadingCard';
import Icon  from '@expo/vector-icons/MaterialIcons';
import PagerView from 'react-native-pager-view';
const io = require('socket.io-client')
const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}
export const Job = ({job})=> {
  const navigation = useNavigation();
  const [deadline, setDealine] = useState('');
  useState(async () => {
      const currentDate = new Date();
      const dl = new Date(job.deadline);
      let timeDiff = dl.getTime() - currentDate.getTime();
      let daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
      setDealine(daysLeft);
    })
  return(
    <TouchableOpacity activeOpacity={0.9} onPress={()=>{navigation.navigate({name: 'Details', params: job})}} style={{
      height: 200,
      width: 340,
      padding:10,
      marginHorizontal: 5,
      marginBottom: 15,
      backgroundColor: '#fff',
      shadowOpacity: 0.9,
      elevation: 3,
      shadowColor: '#000',
      shadowRadius: 3,
      shadowOffset: { width: 0, height: 2 },
      borderRadius: 10
    }}>
      <View style={{flex: 1,flexDirection:'row'}}>
        <Image style={{height:40,width:40,marginRight:10,borderRadius:5}} source={{ uri: api.baseURL + '/image/' + job.company.avatar }}></Image>
        <Text style={{fontWeight:'bold',fontSize:12}} numberOfLines={2}>{job.title}</Text>
      </View>
      <View style={{flex: 2}}>
        <Text style={{fontSize:12,marginTop:5}}>{job.company.name}</Text>
        <View style={{flexDirection:'row',marginTop:10}}>
          <Text style={{flex:2,fontSize:12}}><Text style={{fontWeight:'bold',color:'#FF6F00'}}>$ </Text>{job.salary}</Text>
          <Text style={{flex:3,fontSize:12}} numberOfLines={2}><Icon name='location-on' color={'#FF6F00'}/>{job.location}</Text>
        </View>
      </View>
      <View style={{flex: 1,borderTopWidth:1,borderColor:'lightgray'}}>
        <Text style={{fontWeight:'bold',fontSize:12}}>
          còn {deadline} ngày để ứng tuyển
        </Text>
      </View>
    </TouchableOpacity>
  )
}
const Jobs = ({url,refreshing})=>{
  const navigation = useNavigation();
  const [jobs,setJobs] = useState({data:[]});
  const [loading,setLoading] = useState(true)
  useEffect(()=>{
    if(!refreshing){
      setLoading(true)
      axios.get(url).then(res => {
        setLoading(false)
        setJobs(res.data)
      }).catch(e => {
        setLoading(false)
        console.log(e)
      })
    }
    
  },[refreshing])

    
  if(!loading && jobs.data == ''){
    return(
      <View style={{height:200,justifyContent:'center',alignItems:'center'}}>
        <Image style={{height:100,width:100}} source={require('../../assets/NotFountJob.png')}/>
        <Text>Danh sách công việc còn trống</Text>
      </View>
    )
  }
  return(
    <ScrollView height={220}
    horizontal
    showsHorizontalScrollIndicator={false} >
      {loading ? (<>
        < PlaceholderCard />
        < PlaceholderCard />
        < PlaceholderCard />
        < PlaceholderCard />
        </>):(<>
        {jobs.data.map((job, i) => <Job job={job} key={i}></Job>)}
        <TouchableOpacity onPress={()=>{
         navigation.navigate({name: 'ListJob',params: jobs})
        }} style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <Icon name='keyboard-arrow-right' size={50} style={{
            height: 50,
            width: 50,
            borderRadius: 25,
            backgroundColor: 'lightgray',

          }}/>
          <Text>Xem thêm</Text>
        </TouchableOpacity>
      </>)}  
    </ScrollView>
  )
}
export function Header({ user }, { }) {
  const navigation = useNavigation();
  if (!user ) {
    return (
      <View style={{ flex: 1, padding: 5, borderBottomWidth: 0.12 }}>
        <TouchableOpacity onPress={() => {
          navigation.navigate('Login')
        }} style={{ flex: 2, flexDirection: 'row', borderRadius: 10 }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image style={{ width: 50, height: 50, borderRadius: 25 }} source={{ uri: api.baseURL + '/image/' + 'avarta/NUXCELp2jWm2YHtJYP3ecl682eDADnCzy2BA6MjB.webp' }}></Image>
          </View>
          <View style={{ flex: 4, justifyContent: 'center', }}>
            <Text style={{ fontWeight: 'bold' }}>Chào bạn</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 100, height: 25 }}>
              </View>
            </View>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Icon size={25} name='login' />
            <Text>Login</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }else
  return (
    <View style={{ flex: 1, padding: 5, borderRadius: 10, borderBottomWidth: 0.12 }}>
      <View style={{ flex: 2, flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Image style={{ width: 50, height: 50, borderRadius: 25 }} source={{ uri: api.baseURL + '/image/' + user.avatar }}></Image>
        </View>
        <View style={{ flex: 4, justifyContent: 'center', }}>
          <Text style={{ fontWeight: 'bold' }}>{user.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 100, height: 25 }}>
              <Text style={{ fontSize: 11 }}>MDN: <Text>{user.id}</Text></Text>
            </View>
            {/* {user.business_auth == 0 ? (
                <View style={{minWidth:80,height:25,justifyContent:'center',borderColor:'gray',borderWidth:1,borderRadius:5,padding: 3}}>
                  <Text style={{fontSize:10,color:'gray'}}>Chưa xác thực</Text>
              </View>
              ):(
                <View style={{minWidth:80,height:25,justifyContent:'center',borderColor:'green',borderWidth:1,borderRadius:5,padding: 3}}>
                  <Text style={{fontSize:10,color:'green'}}>Đã xác thực</Text>
                </View> 
              )
              } */}
          </View>
        </View>
      </View>
    </View>
  )
}
export default function HomeScreen({ route }) {
  const navigation = useNavigation();
  const [WINDOW_HEIGHT] = useState(Dimensions.get('screen').height - StatusBar.currentHeight);
  const [user,setUser] = useState(route.params)
  const [jobs] = useState()
  const [token, settoken] = useState('')
  useState(async () => { settoken(await AsyncStorage.getItem('token')) })
  useEffect(() => {
    const socket = io(api.SocketURL, {
      transports: ['websocket']
    });
    if(user){
      socket.on('user:' + user.id, (data) => {
      console.log(data.message)
      setUser(data.message);
      socket.off('user:' + user.id);
    });
    }
    
  }, []);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    wait(500).then(() => setRefreshing(false))
  };
  const [stories, setStories] = useState([
    {
      key: 1,
      userImage: 'https://randomuser.me/api/portraits/men/60.jpg',
      userName: 'Brayden Willis',
      storyImage:
        'https://images.pexels.com/photos/4726898/pexels-photo-4726898.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      isSeen: false,
    },
    {
      key: 2,
      userImage: 'https://randomuser.me/api/portraits/women/81.jpg',
      userName: 'Sophie Price',
      storyImage:
        'https://images.pexels.com/photos/5257534/pexels-photo-5257534.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      isSeen: false,
    },
    {
      key: 3,
      userImage: 'https://randomuser.me/api/portraits/men/79.jpg',
      userName: 'Rick Perry',
      storyImage:
        'https://images.pexels.com/photos/3380805/pexels-photo-3380805.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      isSeen: false,
    },
    {
      key: 4,
      userImage: 'https://randomuser.me/api/portraits/men/85.jpg',
      userName: 'Dave Pena',
      storyImage:
        'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      isSeen: false,
    },
    {
      key: 5,
      userImage: 'https://randomuser.me/api/portraits/women/74.jpg',
      userName: 'Layla Kennedy',
      storyImage:
        'https://images.pexels.com/photos/33287/dog-viszla-close.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      isSeen: false,
    },
  ]);

  const [blog, setBlog] = useState([
    {
      srcImage: 'https://tuyendung.topcv.vn/bai-viet/wp-content/uploads/2022/10/cach-danng-tin-tuyen-dung-thu-hut-ung-vien.png',
      blogName: 'Bật mí cách đăng tin tuyển dụng hiệu quả hút 100%...',
      shortBlog: 'Cách đăng tin tuyển dụng thu hút ứng viên tiềm năng vẫn là luôn bài toán đầy thách thức của nhà tuyển dụng. Sự..',
    },
    {
      srcImage: 'https://tuyendung.topcv.vn/bai-viet/wp-content/uploads/2022/10/vi-sao-nhan-vien-hay-bo-viec-3.jpg',
      blogName: 'Vì sao nhân viên hay bỏ việc? Nguyên nhân và cách...',
      shortBlog: 'Vì sao nhân viên hay bỏ việc? Làm thế nào để giữ chân nhân viên? … là những câu hỏi hóc búa mà nhiều...',
    },
    {
      srcImage: 'https://tuyendung.topcv.vn/bai-viet/wp-content/uploads/2023/02/tuyen-dung-nhan-su-cap-cao-tuyendung.topcv_.vn-1-696x435.jpg',
      blogName: 'Quy trình tuyển dụng nhân sự cấp cao thành công',
      shortBlog: 'Tuyển dụng nhân sự cấp cao có vai trò quan trọng đối với sự phát triển của mỗi doanh nghiệp. Nhân sự cấp cao...',
    },
    {
      srcImage: 'https://tuyendung.topcv.vn/bai-viet/wp-content/uploads/2023/02/nguoi-tim-viec-tuyendung.topcv-1-218x150.jpg',
      blogName: 'Hơn 46% người tìm việc muốn lương trên 20 triệu đồng/tháng',
      shortBlog: 'Theo báo cáo thị trường lao động Thành phố Hồ Chí Minh thời điểm trước và sau Tết Quý Mão 2023 mới đây: có...',
    },
    {
      srcImage: 'https://tuyendung.topcv.vn/bai-viet/wp-content/uploads/2023/02/ky-nang-dan-dat-doi-nhom-tuyendung.topcv_.vn-1-218x150.jpg',
      blogName: 'Các kỹ năng dẫn dắt đội nhóm trong thời kỳ suy thoái kinh tế',
      shortBlog: 'Dù ở bất kỳ đơn vị nào, quy mô ra sao thì kỹ năng dẫn dắt đội nhóm vẫn có vai trò quan trọng,...',
    },

  ]);

  const [currentStoryView, setCurrentStoryView] = useState(stories);
  const [storyModalVisible, setStoryModalVisible] = useState(false);

  return (
    <View style={{ height: WINDOW_HEIGHT, backgroundColor: '#fff' }}>
      {/* Header */}
      <Header user={user} />
      <View style={{ flex: 8 }}>
        <ScrollView style={{flex:1}} showsVerticalScrollIndicator={false} 
         refreshControl={
          <RefreshControl
            colors={['orange','#FF6F00']}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>
          {/* Tìm Kiếm */}
          
          <View style={{ marginLeft: 10, alignItems: 'center' }} >
            <View
              style={{
                borderRadius: 10,
                width: 365,
                height: 120,
                borderColor: '#dfe4ea',
                borderWidth: 1.5,
                padding: 10
                // alignItems: 'center',
                // justifyContent: 'center',
              }}
            >
              <Text style={{zIndex: 2,fontWeight:'bold',fontSize:13,color:'white'}}>Tìm kiếm công việc phù hợp với bạn</Text>
              <TouchableOpacity activeOpacity={0.8} onPress={()=>{navigation.navigate('Search')}} style={{zIndex: 2, flexDirection:'row',alignItems: 'center',marginTop:15,backgroundColor:'white',height:40,borderRadius:5 }}>
            
                  <Icon style={{marginLeft:5,marginRight: 5}} size={15} name='search'/> 
                  <Text> Từ khóa bạn đang tìm kiếm</Text>

              </TouchableOpacity>
              <Image
                style={{
                  width: 365,
                  height: 120,
                  borderRadius: 10,
                  position:'absolute'
                  // opacity: story.isSeen ? 0.5 : 1,
                }}
                source={require('../../assets/findimg.png')}
              />
            </View>
          </View>
        
          {/* Stories */}
          <View style={[styles.storiesView]}>
            <PagerView style={{ height: 110 }} initialPage={0}>
              {stories.map((story, i) => (

                <View style={{ marginLeft: 10, alignItems: 'center' }} key={i}>
                  <TouchableOpacity
                    style={styles.storyContentView}
                  >
                    <Image
                      style={{
                        width: 365,
                        height: 100,
                        borderRadius: 10,
                        opacity: story.isSeen ? 0.5 : 1,
                      }}
                      source={{
                        uri: story.storyImage,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </PagerView>
          </View>
          {/* Chats View */}
          <Text style={{ marginLeft: 20, fontSize: 15, fontWeight: 'bold', marginBottom: 10 }} >Việc làm mới</Text>
          <Jobs refreshing={refreshing} url={`${api.baseURL}/Jobs`}></Jobs>
          <Text style={{ marginLeft: 20, fontSize: 15, fontWeight: 'bold', marginBottom: 10 }} >Việc làm toàn thời gian</Text>
          <Jobs refreshing={refreshing} url={`${api.baseURL}/Jobs-type/full-time`}></Jobs>
          <Text style={{ marginLeft: 20, fontSize: 15, fontWeight: 'bold', marginBottom: 10 }} >Việc làm bán thời gian</Text>
          <Jobs refreshing={refreshing} url={`${api.baseURL}/Jobs-type/temporary`}></Jobs>
          <Text style={{ marginLeft: 20, fontSize: 15, fontWeight: 'bold', marginBottom: 10 }} >Việc làm tạm thời</Text>
          <Jobs refreshing={refreshing} url={`${api.baseURL}/Jobs-type/part-time`}></Jobs>
          <Text style={{ marginLeft: 20, fontSize: 15, fontWeight: 'bold', marginBottom: 10 }} >Việc làm tự do</Text>
          <Jobs refreshing={refreshing} url={`${api.baseURL}/Jobs-type/freelance`}></Jobs>
          <View style={{ height: 60, }}/>

  
        </ScrollView>
      </View>
    </View>
  );

}
const styles = StyleSheet.create({
  storiesView: {
    marginLeft:10,
    paddingVertical: 10,
    paddingRight: 10,
    backgroundColor: '#fafafa',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  storyContentView: {
    // width: 90,
    // height: 130,
    borderRadius: 10,
    borderColor: '#dfe4ea',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyUserImage: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '90%',
    height: '90%',
    borderRadius: 20,
    overflow: 'hidden',
  },
});