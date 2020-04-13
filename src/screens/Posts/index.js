import React from 'react'
import { View, Text, Dimensions } from 'react-native'

const Posts = () => {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', height: Dimensions.get('window').height }}>
      <Text>Posts</Text>
    </View>
  )
}

export default Posts
