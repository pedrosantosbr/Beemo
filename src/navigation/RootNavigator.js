import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import MainTabs from './MainTabs';

const rootNavigator = createSwitchNavigator({
  Main: MainTabs,
})

export default createAppContainer(rootNavigator);
