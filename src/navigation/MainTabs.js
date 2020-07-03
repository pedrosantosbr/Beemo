import * as React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import Dialogs from '~/screens/Dialogs';
import Posts from '~/screens/Posts';
import Chat from '~/screens/Chat';
import Settings from '~/screens/Settings';
import Contacts from '~/screens/Contacts';

const DialogsStack = createStackNavigator({ Dialogs, Chat });
DialogsStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) tabBarVisible = false;
  return { tabBarVisible };
}

const PostsStack = createStackNavigator({ Posts });

const SettingsStack = createStackNavigator({ Settings }, { headerMode: 'none' });

const MainTabs = createBottomTabNavigator({
  Posts: PostsStack,
  Dialogs: DialogsStack,
  Settings: SettingsStack
}, {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Posts') {
          iconName = 'ios-home';
        }
        if (routeName === 'Dialogs') {
          iconName = 'ios-chatbubbles';
        }
        if (routeName === 'Settings') {
          iconName = 'ios-settings';
        }
        return <Icon name={iconName} color={tintColor} size={25} />
      },
    }),
    tabBarOptions: {
      activeTintColor: 'rgb(0, 164, 219)',
      inactiveTintColor: 'gray',
      showLabel: false
    },
  });

export default MainTabs;
