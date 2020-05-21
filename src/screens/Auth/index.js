import React, { useState } from 'react'
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import AuthService from '~/services/auth-service'
import ChatService from '~/services/chat-service'
import { showAlert } from '~/helpers/alert'

const Auth = ({ navigation }) => {
  const [authForm, setAuthForm] = useState({ jid: '', password: '' })

  function login() {
    AuthService.signIn(authForm)
      .then(() => {
        ChatService.setUpListeners()
        navigation.navigate('Dialogs')
      }).catch(error => {
        showAlert(`Error.\n\n${JSON.stringify(error)}`)
      })
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}> Login </Text>
      <TextInput
        placeholder="jabber id"
        value={authForm.jid}
        onChangeText={text => setAuthForm({ ...authForm, jid: text })}
        autoCapitalize="none"
        returnKeyType="done"
        style={styles.input}
      />
      <TextInput
        placeholder="senha"
        value={authForm.password}
        onChangeText={text => setAuthForm({ ...authForm, password: text })}
        autoCapitalize="none"
        returnKeyType="done"
        secureTextEntry={true}
        style={styles.input}
      />
      <TouchableOpacity onPress={login}>
        <Text style={styles.loginBtn}>Entrar</Text>
      </TouchableOpacity>

      <View style={styles.subscribeContent}>
        <Text style={styles.subscribeText}>
          Não possui conta?
        </Text>
        <TouchableOpacity><Text style={styles.subscribeBtn}>Cadastre-se</Text></TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  title: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  loginBtn: {
    color: 'rgb(0, 164, 219)',
    alignSelf: 'center'
  },
  subscribeContent: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  subscribeText: {
    marginRight: 5,
  },
  subscribeBtn: {
    color: 'rgb(0, 164, 219)'
  },
  input: {
    height: 50,
    color: 'black',
    borderRadius: 25,
    marginVertical: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#eee',
    fontSize: 18,
  },
})

export default Auth
