import React from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {
  STATUS_DELIVERED,
  STATUS_PENDING,
  STATUS_READ,
  STATUS_SENT
} from '../models/message'

export default MessageSendState = ({ send_state }) => {
  switch (send_state) {
    case STATUS_PENDING:
      return (<Icon name="query-builder" size={16} color="grey" />)
    case STATUS_SENT:
      return (<Icon name="done" size={16} color="grey" />)
    case STATUS_DELIVERED:
      return (<Icon name="done-all" size={16} color="#389046" />)
    case STATUS_READ:
      return (<Icon name="done-all" size={18} color="#147EFB" />)
  }
  return (null)
}
