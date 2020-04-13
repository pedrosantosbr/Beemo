import * as React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import Dialogs from '~/screens/Dialogs';
import Posts from '~/screens/Posts';
import Chat from '~/screens/Chat';

const DialogsStack = createStackNavigator({ Dialogs, Chat });
DialogsStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) tabBarVisible = false;
  return { tabBarVisible };
}

const PostsStack = createStackNavigator({ Posts });

const MainTabs = createBottomTabNavigator({
  Posts: PostsStack,
  Dialogs: DialogsStack
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
