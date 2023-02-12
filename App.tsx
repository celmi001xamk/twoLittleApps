import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import BottomNav from './components/BottomNav';
import { Provider } from 'react-native-paper';

export default function App() {
  return (
    <Provider>
      <View style={styles.container}>        
        <StatusBar style="auto" />
      </View>
      <BottomNav />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginTop: 30
  },
});
