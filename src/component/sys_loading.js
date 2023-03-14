import { View, Text, Modal, ActivityIndicator } from 'react-native'
import React from 'react'

export default function SysLoading({ visible }) {
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
                        width: '60%',
                        backgroundColor: 'white',
                        borderRadius: 10,
                        marginHorizontal:'20%',
                        paddingVertical:20
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
                            Loading
                        </Text>
                    </View>
                    <View
                        style={{ marginBottom: 10, }}
                    >
                      <ActivityIndicator size="large" color={'#FF6F00'} />
                    </View>
                </View>
            </View>
        </Modal>
    )
}