
// const os = require('os');

// function getLocalIpAddress() {
//   const interfaces = os.networkInterfaces();
//   for (const interfaceName in interfaces) {
//     const interfacesInfo = interfaces[interfaceName];
//     for (let i = 0; i < interfacesInfo.length; i++) {
//       const interfaceInfo = interfacesInfo[i];
//       if (interfaceInfo.family === 'IPv4' && !interfaceInfo.internal) {
//         return interfaceInfo.address;
//       }
//     }
//   }
//   return 'localhost';
// }
// const ipAddress = getLocalIpAddress();
// console.log(`The local IP address is: ${ipAddress}`);
// import * as Network from 'expo-network';
// const ipAddress = await Network.getIpAddressAsync();
// console.log(ipAddress);
// import * as Network from 'expo-network';

// const ipAddress = async ()=>{
//    return await Network.getIpAddressAsync();
// } 
// console.log(ipAddress);
// import * as Network from 'expo-network';
// async function getIPAddress() {
//     const ipAddress = await Network.getIpAddressAsync();
//     return ipAddress;
//   }
const host = '192.168.1.8' 
const api={
    URL: `http://${host}:8000`,
    baseURL:`http://${host}:8000/api`,
    SocketURL:`http://${host}:6000/`
}

export default api