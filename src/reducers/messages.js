import {
  PUSH_MESSAGE,
  FETCH_MESSAGES,
  DELETE_ALL_MESSAGES,
  LAZY_FETCH_MESSAGES
} from '../actions/messages';

export default (messages = {}, action) => {
  switch (action.type) {
    case PUSH_MESSAGE: {
      const copyMessages = messages[action.dialogId] || []
      return {
        ...messages,
        [action.dialogId]: [action.message, ...copyMessages]
      }
    }

    default:
      return messages;
  }
}
