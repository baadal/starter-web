exports.checkProd = () => process.env.NODE_ENV === 'production';
exports.checkServer = () => process.env.PLATFORM === 'server';
