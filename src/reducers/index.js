import { combineReducers } from 'redux';
import currentUser from './currentUser';
import messages from './messages';
import dialogs from './dialogs';
import selectedDialog from './selectedDialog';

const rootReducer = combineReducers({
  currentUser,
  messages,
  dialogs,
  selectedDialog
});

export default rootReducer