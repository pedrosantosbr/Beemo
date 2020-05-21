import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import MainTabs from './MainTabs';
import AppWrap from '~/screens/AppWrap';
import Auth from '~/screens/Auth';

const rootNavigator = createSwitchNavigator({
  AppWrap,
  Auth,
  Main: MainTabs,
})

export default createAppContainer(rootNavigator);
