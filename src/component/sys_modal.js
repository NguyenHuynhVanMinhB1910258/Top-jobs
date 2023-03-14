import { View, Text, Modal, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'

export default function SyModal({ message, visible, onHide, loading }) {
  return (
    <Modal visible={visible} transparent={true}>
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(00,00,00,.5)',
        justifyContent: 'center',
        alignContent: 'center',
        padding: 20,
      }}>
        <View
          style={{
            width: '100%',
            backgroundColor: 'white',
            borderRadius: 10,
            padding: 20,
          }}
        >
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <Text style={{
              fontSize: 20,
              color: 'black'
            }}>
              Alert
            </Text>
          </View>
          <View
            style={{ marginBottom: 10, }}
          >
            <Text> {message}</Text>
          </View>
          <View>
            <TouchableOpacity activeOpacity={0.5} onPress={onHide}>
              <LinearGradient
                useAngle={true}
                angle={45}
                colors={['#243eed', '#af24ed', '#eb24ed',]}
                style={{
                  padding: 10,
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{
                  color: 'white',
                  fontWeight: 'bold'
                }}>Close</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}