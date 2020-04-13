import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'

const Avatar = ({ photo, name, iconSize }) => {

  let styles;
  switch (iconSize) {
    case 'extra-large': {
      styles = extraLargeIcon
      break;
    }
    case 'large': {
      styles = largeIcon
      break;
    }
    case 'medium': {
      styles = mediumIcon
      break;
    }
    case 'small': {
      styles = smallIcon
      break;
    }
  }

  // !!!!!!! remember to remove Image.style
  return (
    <View>
      <Image style={styles.photo} source={photo} />
    </View>
  )
}

const extraLargeIcon = StyleSheet.create({
  photo: {
    borderRadius: 50,
    height: 100,
    width: 100,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  randomIcon: {
    fontSize: 48,
    fontWeight: '600',
    color: 'white',
    paddingRight: Platform.OS === 'android' ? 5 : 1
  }
})

const largeIcon = StyleSheet.create({
  photo: {
    borderRadius: 25,
    height: 50,
    width: 50,
    marginVertical: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  randomIcon: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
    paddingRight: Platform.OS === 'android' ? 5 : 1
  }
})

const mediumIcon = StyleSheet.create({
  photo: {
    borderRadius: 20,
    height: 40,
    width: 40,
    marginVertical: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  randomIcon: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white'
  }
})

const smallIcon = StyleSheet.create({
  photo: {
    borderRadius: 18,
    height: 36,
    width: 36,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  randomIcon: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    paddingRight: Platform.OS === 'android' ? 5 : 1
  }
})

export default Avatar
