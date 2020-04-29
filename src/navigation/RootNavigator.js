import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import MainTabs from './MainTabs';
import AppWrap from '~/screens/AppWrap';

const rootNavigator = createSwitchNavigator({
  AppWrap,
  Main: MainTabs,
})

export default createAppContainer(rootNavigator);
