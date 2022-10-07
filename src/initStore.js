import { INIT_REDUCERS, configureStore } from './dynoStore';
import { initApp } from './app/actions/appInitActions';

export const INIT_STORE_CONFIG = configureStore(INIT_REDUCERS);
INIT_STORE_CONFIG.dispatch(initApp());
