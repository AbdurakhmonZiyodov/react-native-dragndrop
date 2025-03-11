import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './screens/home';
import { SQLiteProvider } from 'expo-sqlite';
import { initializeDB } from './db';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CoreStyle } from './constants/global';

export default function App() {
  return (
    <GestureHandlerRootView style={CoreStyle.flex1}>
      <SQLiteProvider databaseName={'app.db'} onInit={initializeDB}>
        <SafeAreaProvider>
          <HomeScreen />
        </SafeAreaProvider>
      </SQLiteProvider>
    </GestureHandlerRootView>
  );
}
