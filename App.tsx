import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HocBaMain from './src/components/hocba/HocBaMain';

const App = () => {
  console.log('Rendering App component with HocBaMain');
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <HocBaMain />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;






