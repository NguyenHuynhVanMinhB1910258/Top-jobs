import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export const PlaceholderCardProfile = () =>{
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial value for opacity: 0

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      { iterations: -1 }
    ).start();
  }, []);
  return (
    // <View style={styles.container}>
  <View style={{ flex: 1, padding: 5, borderBottomWidth: 0.12 }}>
    <View style={{ flex: 2, flexDirection: 'row', borderRadius: 10 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Animated.View style={[styles.image, styles.placeholder, { opacity: fadeAnim}]}/>
      </View>
      <View style={{ flex: 4, justifyContent: 'center', }}>
         <Animated.View style={[styles.line, styles.placeholder, { opacity: fadeAnim, width: '30%' }]} />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Animated.View style={[styles.line, styles.placeholder, { opacity: fadeAnim, width: '70%' }]} />
        </View>
      </View>
    </View>
  </View>
    // </View>
  );
}
const PlaceholderCard = () => {
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial value for opacity: 0

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      { iterations: -1 }
    ).start();
  }, []);

  return (
    // <View style={styles.container}>
      <View style={styles.card}>
        <View style={{ flex: 1,flexDirection:'row'}}>
        <View style={{flex:1}}>
          <Animated.View style={[styles.image, styles.placeholder, { opacity: fadeAnim}]}/>
        </View>
          <View style={{flex: 4}}>
           <Animated.View style={[styles.line, styles.placeholder, { opacity: fadeAnim }]} />
           <Animated.View style={[styles.line, styles.placeholder, { opacity: fadeAnim }]} />
          </View>
         
        </View>
        <View style={{ flex: 2, marginTop:30}}>
          <Animated.View style={[styles.line, styles.placeholder, { opacity: fadeAnim }]} />
          <View style={{flexDirection:'row'}}>
          <Animated.View style={[styles.line, styles.placeholder, { opacity: fadeAnim, width: '30%' }]} />
          <Animated.View style={[styles.line, styles.placeholder, { opacity: fadeAnim, width: '60%', marginLeft: 10 }]} />
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Animated.View style={[styles.line, styles.placeholder, { opacity: fadeAnim, width: '50%' }]} />
        </View>
      </View>
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    margin:5,
    width: 320,
    height: 200,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 10,
  },
  image: {
    height: 40,
    width:40,
    borderRadius: 20
  },
  line: {
    height: 15,
    backgroundColor: '#F6F7F8',
    marginVertical: 5,
    borderRadius: 5,
  },
  placeholder: {
    backgroundColor: 'lightgray',
  },
});

export default PlaceholderCard;
