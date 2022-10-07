/**
 * Created by ypling on 7/5/16.
 */
import * as actionTypes from '../constants/actionTypes';
import Immutable from 'immutable';

const persistedStore = fetchPersistedTeam();

const initialState = Immutable.Map({
  ...persistedStore,
  pending: !Object.keys(persistedStore).length,
  refresh: false,
  receivedConfigs: false
});

export default function teamReducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case actionTypes.RECEIVE_ORG_INFO: {
      newState = state;
      const emailSSO = action.data.ssos.filter(sso => sso.name === 'email');

      newState = newState.set('hasEmailLogin', !!emailSSO.length);

      newState = newState.set(
        'hasOnlyEmailLogin',
        action.data.ssos.length === 1 && action.data.ssos[0].name === 'email'
      );

      let configs = {};
      action.data.configs.forEach(config => {
        configs[config.name] = config.value;
        if (config.name === 'content_type_standardization') {
          window.contentTypeStandardization = config.value;
        }
        if (config.name === 'capture_translations') {
          window.captureTranslations = config.value;
        }
      });

      let gtmID = configs.GATrackingId;

      let sourceArr = action.data.configs.find(item => {
        return item.name === 'fileStack';
      });

      sourceArr = sourceArr?.value;
      let fileStackConfig =
        sourceArr && Object.keys(sourceArr).length !== 0
          ? Object.keys(sourceArr)
              .filter(source => {
                return sourceArr[source].visible;
              })
              .map(source => {
                return sourceArr[source].source;
              })
          : [
              'local_file_system',
              'imagesearch',
              'googledrive',
              'onedrive',
              'dropbox',
              'box',
              'github',
              'url',
              'onedriveforbusiness',
              'clouddrive',
              'evernote',
              'gmail',
              'customsource',
              'video',
              'audio',
              'webcam'
            ];

      newState = newState.withMutations(currentState => {
        currentState
          .set('config', configs)
          .set('pending', false)
          .set('ssos', action.data.ssos)
          .set('OrgConfig', action.data.OrgConfig.web)
          .set('Feed', action.data.OrgConfig.feed)
          .set('Discover', action.data.OrgConfig.discover)
          .set('coBrandingLogo', action.data.coBrandingLogo)
          .set('favicons', action.data.favicons)
          .set('orgId', action.data.id)
          .set('name', action.data.name)
          .set('hostName', action.data.hostName)
          .set('orgSubscriptions', action.data.orgSubscriptions)
          .set('memberPay', action.data.memberPay)
          .set('readableCardTypes', action.data.readableCardTypes)
          .set('organizationStandardTypes', action.data.organizationStandardTypes)
          .set('fromEmailAddress', action.data.fromAddress)
          .set('paymentGateways', configs.payment_gateway)
          .set('quarters', action.data.quarters)
          .set('isOcgEnabled', action.data.isOcgEnabled)
          .set('isEgtEnabled', action.data.isEgtEnabled)
          .set('isLrsEnabled', action.data.isLrsEnabled)
          .set('languages', action.data.languages)
          .set('imageUrl', action.data.imageUrl)
          .set('fileStackSources', fileStackConfig)
          .set('isClcActive', action.data.isClcActive)
          .set('allowedMediaMimeTypes', action.data.allowedMediaMimeTypes)
          .set('invalidTeamName', false);
      });

      // this actiontype is dispatched only once hence triggering GTM here
      // window.triggerGTM(gtmID);
      return newState;
    }
    case actionTypes.ERROR_INIT_ORG:
      return state.set('invalidTeamName', true).set('pending', false);
    case actionTypes.RECEIVE_ORG_CONFIGS_AFTER_AUTHORIZATION:
      newState = state;
      const { newConfigs } = action;
      let configs = newState.get('config') || {};
      configs = { ...configs, ...newConfigs };
      newState = newState.set('config', configs).set('receivedConfigs', true);
      return newState;
    default:
      return state;
  }
}

function fetchPersistedTeam() {
  try {
    const value = localStorage.getItem('team');
    const parsedValue = JSON.parse(value);
    if (parsedValue === null) return {};
    return parsedValue;
  } catch (error) {
    console.warn(`Fetching persisted team failed with error: ${error}`);
    return {};
  }
}
