import React from 'react'
import {
  View,
  Dimensions,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import Avatar from '~/components/avatar'
import { Container, Header, Content, Button, ListItem, Text, Icon, Left, Body, Right, Switch } from 'native-base';

const Settings = ({ navigation }) => {
  return (

    <Container style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.textHeader}>Ajustes</Text>
      </View>
      <View style={styles.card}>
        <TouchableOpacity style={styles.profile}>
          <Avatar source="" iconSize="extra-large" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <TouchableOpacity onPress={() => navigation.navigate('Posts')}>
          <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "#FF9501" }}>
                <Icon active name="airplane" />
              </Button>
            </Left>
            <Body>
              <Text>Airplane Mode</Text>
            </Body>
            <Right>
              <Switch value={false} />
            </Right>
          </ListItem>
        </TouchableOpacity>
        <ListItem icon>
          <Left>
            <Button style={{ backgroundColor: "#007AFF" }}>
              <Icon active name="wifi" />
            </Button>
          </Left>
          <Body>
            <Text>Wi-Fi</Text>
          </Body>
          <Right>
            <Text>GeekyAnts</Text>
            <Icon active name="arrow-forward" />
          </Right>
        </ListItem>
      </View>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    backgroundColor: 'whitesmoke'
  },
  header: {
    padding: 15,
    alignSelf: 'flex-start'
  },
  textHeader: {
    fontSize: 30,
    fontWeight: 'bold',
    alignSelf: 'flex-start'
  },
  content: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#e3e3e3',
  },
  card: {
    backgroundColor: 'white',
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#e3e3e3',
    marginBottom: 30
  },
  profile: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
})

export default Settings
