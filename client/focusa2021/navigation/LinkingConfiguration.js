/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          Profile: {
            screens: {
              ProfileScreen: 'p',
            },
          },
          Search: {
            screens: {
              SearchScreen: 's',
            },
          },
          PersonalPost: {
            screens: {
              PersonalPostScreen: 'pp',
            },
          },
          EditProfile: {
            screens: {
             EditProfileScreen: 'ep',
            },
          },
          PostDetails: {
            screens: {
              PostDetailsScreen: 'pd',
            },
          },
          VideoConferencing: {
            screens: {
              VideoConferencing: 'vc',
            },
          },
          Settings: {
            screens: {
              SettingsScreen: 's',
            },
          },
          CourseDetails: {
            screens: {
              CourseDetailsScreen: 'cd',
            },
          },
        },
      },
      NotFound: '*',
    },
  },
};
