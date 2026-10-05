/**
 * @format
 */

console.log('index.js started');
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

console.log('index.js: registering component:', appName);
AppRegistry.registerComponent(appName, () => App);
console.log('index.js completed');

