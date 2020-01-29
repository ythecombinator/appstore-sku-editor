import { AppStoreConnectAppData } from '../models/AppStoreConnectAppData';
import { AppStoreConnectCredentials } from '../models/AppStoreConnectCredentials';

interface AppStoreConnectConfig {
  credentials: AppStoreConnectCredentials;
  app: AppStoreConnectAppData;
}

export { AppStoreConnectConfig };
