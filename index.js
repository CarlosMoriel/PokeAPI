import { AppRegistry } from 'react-native';
import App from './App';  // Asegúrate de que la ruta esté correcta
import { name as appName } from './app.json';  // Importa el nombre de la app desde app.json
import 'react-native-gesture-handler';  // Asegúrate de tener este import también aquí si lo usas

AppRegistry.registerComponent(appName, () => App);
