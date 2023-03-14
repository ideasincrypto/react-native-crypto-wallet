import * as Linking from "expo-linking"

export default {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      Login: {
        screens: {
          Login: "login",
        },
      },
      SignUp: {
        screens: {
          SignUp: "SingUp",
        },
      },
      Root: {
        screens: {
          TabOne: {
            screens: {
              TabOneScreen: "one",
            },
          },
          TabTwo: {
            screens: {
              TabTwoScreen: "two",
            },
          },
        },
      },
      Loading: {
        screens: {
          Loading: "Loading",
        },
      },
      NotFound: "*",
    },
  },
}
