import axios from 'axios';
import api from '../services/ApiService';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import * as Linking from 'expo-linking';

const ApplicationForm = ({route}) => {
  const navigation = useNavigation();
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
      loadApplyHistory();
  })
  // console.log(applications)
  const loadApplyHistory = async () => {
    try {
        const history = await AsyncStorage.getItem('ApplyHistory');
        if (history !== null) {
          setApplications(JSON.parse(history));
        }
    } catch (error) {
        console.log(error);
    }
  };
  const handleSavepAllicattion = async (obj) =>{
   
    try {
      // Check if the search keyword already exists in the history
      if (!applications.includes(obj)) {
          const history = [obj,...applications]
          await AsyncStorage.setItem('ApplyHistory', JSON.stringify(history));
          setApplications(history);
      }
  } catch (error) {
      console.log(error);
  }
  }
  const handleSubmit = () => {
    // Gửi đơn ứng tuyển
    console.log({resume, email, description,full_name,job_id});
    axios.post(`${api.baseURL}/application`,{resume, email, description,full_name, job_id},{
      headers:{
        authorization: `Bearer ${token}`,
      }
    })
    .then(res=>{
      handleSavepAllicattion({resume,email,full_name})
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
      {applications && 
      <>
      <Text style={styles.label}>Sử dụng CV đã ứng tuyển</Text>
      <ScrollView style ={{height:600}}>
        <View style={{height:200, borderWidth: 1}}>
          <Text onPress={()=>{
            Linking.openURL(applications[0].resume);
          }} numberOfLines={1}>{applications[0].resume}</Text>
          <Text>{applications[0].full_name}</Text>
          <Text>{applications[0].email}</Text>
        </View>
      </ScrollView>
      </>
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
