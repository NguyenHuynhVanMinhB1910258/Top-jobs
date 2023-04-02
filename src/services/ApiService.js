
import Constants  from 'expo-constants';

const { manifest } = Constants;

const host = manifest.debuggerHost.split(':').shift();
const api={
    URL: `http://${host}:8000`,
    baseURL:`http://${host}:8000/api`,
    SocketURL:`http://${host}:6000/`
}

export default api