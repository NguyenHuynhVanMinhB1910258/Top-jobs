import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import { Job } from './HomeScreen'
import PlaceholderCard from './PPlaceholderLoadingCard'
import React, { useState, useEffect } from 'react'
import api from '../services/ApiService'
import axios from 'axios'

const ListJobsSearchScreen = ({query}) => {
  const [jobs, setJob] = useState([]);  
  const [load_page,setLoadPage] = useState(false);
  const [total,setTotal] = useState('')
  const [next_page_url, setURL] = useState([]);
  useEffect(()=>{
    axios.get(`${api.baseURL}/search/${query}`)
    .then(res=>{
      setJob(res.data.data)
      setURL(res.data.next_page_url)
      setTotal(res.data.total)
    }).catch(e=>console.log(e))
  },[])


  return (
    <>
    {total && <View style={{flexDirection:'row',paddingHorizontal:20}}><Text style={{fontWeight:'bold',color: '#FF6F00'}}>{total}</Text><Text> việc làm phù hợp</Text></View>}
    <ScrollView 
    onScroll={(event) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const contentHeight = event.nativeEvent.contentSize.height;
      
      const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
      if (Math.round(offsetY + scrollViewHeight) >= Math.round(contentHeight)) {
          if(next_page_url !== null){
              setLoadPage(true);
              axios.get(next_page_url).then(res => {
                  setJob(jobs.concat(res.data.data))
                  setURL(res.data.next_page_url)
                  setLoadPage(false)
              }).catch(e => {
                  setLoadPage(false)
                  console.log(e)})
          }
      }
  }}
  >
      <View style={{ alignItems: 'center', marginVertical: 15 }}>
          {jobs.length > 0 ? (jobs.map((job, i) => <Job job={job} key={i}></Job>))
          :(<>
          <PlaceholderCard/>
          <PlaceholderCard/>
          <PlaceholderCard/>
          <PlaceholderCard/>
          </>)}
          {load_page && <ActivityIndicator size='small' color={'#FF6F00'} /> }
      </View>
    </ScrollView>
    </>
  )
}

export default ListJobsSearchScreen

const styles = StyleSheet.create({})