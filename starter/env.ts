export const checkProd = () => process.env.NODE_ENV === 'production';
export const checkServer = () => process.env.PLATFORM === 'server';
export const checkModern = () => process.env.PLATFORM !== 'server' && process.env.MODERN === 'true';
