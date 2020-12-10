import { checkProd, checkServer } from 'starter/utils/env';
import { EnvValues } from 'starter/core/model/common.model';

const values: EnvValues = {
  port: process.env.PORT || '',
  portApi: process.env.PORT_API || '',
  apiBaseUrl: process.env.API_BASE_URL || '',
  apiBasePublicUrl: process.env.API_BASE_URL || '',
  assetsBaseUrl: process.env.ASSETS_BASE_URL || '',
};

const isProd = checkProd();
const isServer = checkServer();

if (!values.apiBaseUrl) {
  if (typeof window !== 'undefined' && window.location.origin.includes(values.port)) {
    values.apiBaseUrl = window.location.origin.replace(values.port, values.portApi);
  } else {
    values.apiBaseUrl = `http://localhost:${values.portApi}`;
  }
}
values.apiBasePublicUrl = values.apiBaseUrl;

if (isProd && isServer) {
  values.apiBaseUrl = `http://localhost:${values.portApi}`;
}

export default values;
