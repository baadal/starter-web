export const checkProd = () => process.env.NODE_ENV === 'production';
export const checkServer = () => process.env.PLATFORM === 'server';
