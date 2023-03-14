import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Image, Dimensions, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import ListJobsSearchScreen from './ListJobsSearchScreen';
import Icon from '@expo/vector-icons/MaterialIcons'
import axios from 'axios'
import api from '../services/ApiService'

const SearchScreen = () => {
    const navigation = useNavigation();
    const [searchHistory, setSearchHistory] = useState([]);
    const [data, setData] = useState([]);
    // console.log(searchHistory)
    const [query,setQuery] = useState('');
    const [data_search, setDataSearch] = useState([])
    const [search, setSearch] = useState('');
    const [WINDOW_HEIGHT] = useState(Dimensions.get('screen').height);
    const loadSearchHistory = async () => {
        try {
            const history = await AsyncStorage.getItem('searchHistory');
            if (history !== null) {
                setSearchHistory(JSON.parse(history));
            }
        } catch (error) {
            console.log(error);
        }
    };
    const handleRemoveHistory = async (text) => {
        try {
            const history = searchHistory.filter(item => item !== text);
            // console.log(history)
            // await AsyncStorage.removeItem('searchHistory');
            await AsyncStorage.setItem('searchHistory', JSON.stringify(history));
            setSearchHistory(history);
        } catch (error) {
           console.log(error);
        }
    };
    const handleSearch = () => {
        // Do search with searchText
        // ...
        // Save search history
        if(search !== ''){
            saveSearchHistory(search);
            setQuery(search);
        }
      };
    const handleClearHistory = async () => {
        try {
            await AsyncStorage.removeItem('searchHistory');
            setSearchHistory([]);
        } catch (error) {
            console.log(error);
        }
    };
    const saveSearchHistory = async (text) => {
        try {
            // Check if the search keyword already exists in the history
            if (!searchHistory.includes(text)) {
                const history = [text, ...searchHistory];
                await AsyncStorage.setItem('searchHistory', JSON.stringify(history));
                setSearchHistory(history);
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        axios.get(`${api.baseURL}/query_job`)
            .then(
                res => setData(res.data)
            ).catch(e => console.log(e))
        loadSearchHistory();
        // handleClearHistory();
    }, [])
    useEffect(() => {
        const arr = () => {
            const arr = [];
            if (search === '') {
                return [];
            }
            for (let i = 0; i < data.length; i++) {
                if (data[i].indexOf(search) >= 0) {
                    arr.push(data[i]);
                }
            }
            return arr;
        }
        setDataSearch(arr())
        // console.log(arr())
    }, [search])

    return (
        <View height={WINDOW_HEIGHT} style={{ width: '100%', backgroundColor: '#fff' }}>
            <View style={{ flex: 1, backgroundColor: 'white', flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ flex: 2, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                    <Icon name='arrow-back' size={30} />
                </TouchableOpacity>
                <View style={{ flex: 10, padding: 8 }}>
                    <View style={{ flex: 1, backgroundColor: '#FFF8E1', borderRadius: 5, flexDirection: "row", alignItems: 'center' }}>
                        <Icon name='search' size={20} style={{ marginHorizontal: 5 }}></Icon>
                        <TextInput 
                            autoFocus
                            value={search}
                            onChangeText={(value) => { setSearch(value) 
                                setQuery('') }}
                            style={{ fontSize: 12, flex: 1 }}
                            placeholder='Tìm kiếm'
                            onSubmitEditing={()=>{
                                handleSearch();
                           }}
                        >
                           
                        </TextInput>
                    </View>
                </View>
                <TouchableOpacity onPress={()=>{
                    handleSearch();
                }} style={{ flex: 4, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#FF6F00', fontSize: 13, fontWeight: '400' }}>Tìm kiếm</Text>
                </TouchableOpacity>
            </View>
            <View style={{ flex: 15 }}>
                {query === '' ? (  <ScrollView style={{ paddingHorizontal: 10 }}>
                    {searchHistory && search ==='' && <><Text style={{ fontSize: 12, fontWeight: 'bold' }}>Tìm kiếm gần đây</Text>
                        {searchHistory.map((item, i) =>
                            <View key={i} flexDirection={'row'}>
                                 <TouchableOpacity onPress={()=>{
                                    setSearch(item);
                                    setQuery(item);
                                 }} style={{flex: 10}}>
                                    <Text style={{fontSize: 12, padding: 10}}>{item}</Text>
                                 </TouchableOpacity>
                                 <TouchableOpacity 
                                    onPress={()=>{
                                    handleRemoveHistory(item);
                                   }}
                                 activeOpacity={0.9} style={{flex: 1, justifyContent: 'center', alignItems:'flex-end'}}>
                                    <Icon name='close' size={20}/>
                                 </TouchableOpacity>
                            </View>
                           
                        )}
                    </>}
                    {data_search && data_search.map((item, i) =>
                        <TouchableOpacity onPress={async () => {
                            saveSearchHistory(item);
                            setSearch(item);
                            setQuery(item);
                        }} key={i}>
                            <Text style={{ fontSize: 12, padding: 10, borderBottomWidth: 1, borderColor: 'lightgray' }}>{item}</Text>
                        </TouchableOpacity>)}
                </ScrollView>):(<ListJobsSearchScreen query={query}/>)}
              
            </View>
        </View>
    )
}

export default SearchScreen

const styles = StyleSheet.create({})