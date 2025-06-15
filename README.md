# FlightClub
Community App for Pilots

## Demo Video
<div style="position: relative; padding-bottom: 216.86746987951807%; height: 0;"><iframe src="https://www.loom.com/embed/d22cc8c4b0b144f9a4d91be92d80ee5b?sid=9cfa95e6-2276-4c19-a4a8-615c9c4b7ffe" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>

## Prerequisites
Before you begin, ensure you have the following installed:
- Node.js (v18 or newer)
- npm (comes with Node.js)
- Xcode (for iOS development)
- iOS Simulator (comes with Xcode)
- Expo CLI (`npm install -g expo-cli`)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/HelenaBelloff/FlightClub.git
cd FlightClub
```

2. Install dependencies:
```bash
npm install
```

3. Install specific React Native dependencies:
```bash
npm install react-native@0.79.3 react-native-safe-area-context@5.4.0 react-native-screens@~4.11.1 react-native-svg@15.11.2
```

## Running the App

### iOS Simulator
```bash
npx expo start --ios
```

### Web Browser
```bash
npx expo start --web
```

### Development Server
```bash
npx expo start
```
This will open the Expo Developer Tools in your browser, where you can choose to run on iOS, Android, or web.

## Troubleshooting

### Cache Issues
If you're experiencing issues with the iOS simulator, try clearing the cache:
```bash
rm -rf node_modules/.cache
```

### Metro Bundler Issues
If the Metro bundler is having issues, try:
```bash
rm -rf node_modules/.cache
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-*
```

### iOS Simulator Connection Issues
If the simulator can't connect to the development server:
1. Make sure Xcode and iOS Simulator are up to date
2. Try running with the localhost flag:
```bash
npx expo start --localhost
```

## Development Notes
- The app uses React Navigation for routing
- Flight statistics are managed through React Context
- The app is built with Expo and React Native
