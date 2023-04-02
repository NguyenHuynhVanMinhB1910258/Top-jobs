import axios from 'axios';
import api from '../services/ApiService';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import * as Linking from 'expo-linking';
const Resume =({application,k,focused,handleFocused})=>{
  const [isfocused,setIF] = useState({})
  useEffect(()=>{
    if(k===focused){
      setIF({backgroundColor:30})
    }else {
      setIF({backgroundColor:10})
    }
  },[focused])
  
  return(
    <TouchableOpacity onLongPress={() => {
      if (Linking.canOpenURL(application.resume)) {
        Linking.openURL(application.resume);
      }
    }} 
    onPress={()=>{handleFocused(k)}} 
    style={[{ height: 100, padding: 10,marginBottom:5},isfocused]}>
      <View style={{ flexDirection: 'row' }}>
        <Text st>Link CV: </Text>
        <Text numberOfLines={1}>{application.resume}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text>Họ và tên: </Text>
        <Text>{application.full_name}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text>email: </Text>
        <Text>{application.email}</Text>
      </View>
    </TouchableOpacity>
  )
}
const ApplicationForm = ({route}) => {
  const navigation = useNavigation();
  const [focused,setFocused] = useState(0);
  const [applications,setApplications] = useState([]);
  const [job_id] = useState(route.params)
  const [errors,setErrors]= useState({})
  const [resume, setResume] = useState('');
  const [full_name, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [token, setToken] = useState('');
  useState(async () => {
      setToken(await AsyncStorage.getItem('token'))
      // loadApplyHistory();
  })
  const handleFocused=(key)=>{
    setFocused(key);
    setResume(applications[key].resume)
    setFullName(applications[key].full_name)
    setEmail(applications[key].email)
  }
  // console.log(applications)
  useEffect(()=>{
    if(token !== ''){
      axios.get(`${api.baseURL}/user/application`,{
        headers:{
          authorization: `Bearer ${token}`
        }
      }).then(
        res=>{
          setApplications(res.data)
        }).catch(
          e=>console.log(e)
      )
    }
  },[token])
 
  const handleSubmit = () => {
    // Gửi đơn ứng tuyển
    console.log({resume, email, description,full_name,job_id});
    axios.post(`${api.baseURL}/application`,{resume, email, description,full_name, job_id},{
      headers:{
        authorization: `Bearer ${token}`,
      }
    })
    .then(res=>{
      // handleSavepAllicattion({resume,email,full_name})
      navigation.goBack();
    }).catch(e => {
      console.log(e)
      if(e.response.status===422){
        setErrors(e.response.data.errors)
      }
    }
    )
  };

  return (
    <View style={styles.container}>
      {applications.length > 0 && 
      <View height={200}>
      <Text style={styles.label}>Sử dụng CV đã ứng tuyển</Text>
          <ScrollView>
          {applications.map((application,i)=><Resume application={application} key={i} k={i} focused={focused} handleFocused={handleFocused}></Resume>)}
          </ScrollView>
      </View>
      }
      <Text style={styles.label}>Link CV:</Text>
      <TextInput
        style={styles.input}
        placeholder="URL đến CV của bạn"
        value={resume}
        onChangeText={text => setResume(text)}
      />
      {errors.resume && <Text style={{color:'red'}}>{errors.resume[0]}</Text>}
      <Text style={styles.label}>Họ và Tên:</Text>
      <TextInput
        style={styles.input}
        placeholder="URL đến CV của bạn"
        value={full_name}
        onChangeText={text => setFullName(text)}
      />
       {errors.full_name && <Text style={{color:'red'}}>{errors.full_name[0]}</Text>}
      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập địa chỉ email của bạn"
        value={email}
        onChangeText={text => setEmail(text)}
      />
       {errors.email && <Text style={{color:'red'}}>{errors.email[0]}</Text>}
      <Text style={styles.label}>Thông điệp:</Text>
      <TextInput
        style={[styles.input, styles.message]}
        placeholder="Nhập thông điệp của bạn muốn gửi đến nhà tuyển dụng, đây là cách bạn gây ấn tượng với họ nếu đây là lân đầu bạn viết cv"
        value={description}
        onChangeText={text => setDescription(text)}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Gửi</Text>
      </TouchableOpacity>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 20,
  },
  message: {
    textAlignVertical:"top",
    height: 100,
  },
  button: {
    backgroundColor: '#FFA000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ApplicationForm;
