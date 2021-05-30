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
