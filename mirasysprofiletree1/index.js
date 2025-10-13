/**
 * RN entry. Wraps src/app/App.
 */
import {AppRegistry} from 'react-native';
import App from './src/app/App';
import {name as appName} from './app.json';
AppRegistry.registerComponent(appName, () => App);
