const os = require('os')
exports.getLocalIP = function() {
    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName in networkInterfaces) {
    const interfaces = networkInterfaces[interfaceName];
        for (const iface of interfaces) {
            // Verifica se o endereço é IPv4 e se não é um endereço interno (127.0.0.1)
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'IP não encontrado';
}