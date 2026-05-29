module.exports = {
  expo: {
    owner: "nawl",
    name: "PetPillPal",
    slug: "PetPillPal",
    version: "1.2.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "petpillpal",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.nawl.PetPillPal"
    },
    android: {
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON || "./google-services.json",
      softwareKeyboardLayoutMode: "pan",
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png"
      },
      predictiveBackGestureEnabled: false,
      package: "com.nawl.petpillpal"
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {},
      eas: {
	      projectId: "66e1edc1-4f44-4aef-a70e-a19f5dfaa41d"
      }
    }
  }
};
