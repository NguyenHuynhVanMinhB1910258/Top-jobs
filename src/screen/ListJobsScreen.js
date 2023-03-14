import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import { Job } from './HomeScreen'
import React, { useState, useEffect } from 'react'
import api from '../services/ApiService'
import axios from 'axios'
const ListJobsScreen = ({ route }) => {
    const [jobs, setJob] = useState(route.params.data);
    const [load_page,setLoadPage] = useState(false);
    const [next_page_url, setURL] = useState(route.params.next_page_url);
    return (
        <ScrollView onScroll={(event) => {
            const offsetY = event.nativeEvent.contentOffset.y;
            const contentHeight = event.nativeEvent.contentSize.height;
            // console.log(contentHeight)
            
            const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
            // console.log(offsetY + scrollViewHeight)
            if (Math.round(offsetY + scrollViewHeight) >= Math.round(contentHeight)) {
                if(next_page_url !== null){
                    setLoadPage(true);
                    axios.get(next_page_url).then(res => {
                    //  const temp = jobs.concat(res.data)
                    //  console.log(temp)
                        setJob(jobs.concat(res.data.data))
                        setURL(res.data.next_page_url)
                        setLoadPage(false)
                    }).catch(e => {
                        setLoadPage(false)
                        console.log(e)})
                }
            }
        }}>
            <View style={{ alignItems: 'center', marginVertical: 15 }}>
                {jobs.map((job, i) => <Job job={job} key={i}></Job>)}
                {load_page && <ActivityIndicator size='small' color={'#FF6F00'} /> }
            </View>
        </ScrollView>
    )
}

export default ListJobsScreen

const styles = StyleSheet.create({})