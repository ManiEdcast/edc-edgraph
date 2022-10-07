/**
 * Created by ypling on 7/5/16.
 */

import * as actionTypes from '../constants/actionTypes';
import Immutable from 'immutable';

export default function currentUserReducer(
  state = Immutable.fromJS({
    teams: [],
    invalidTeamName: false,
    walletTransactions: [],
    followingUsers: [],
    isLoadingPublicProfile: true,
    userPassport: {},
    publicUserPassport: {}
  }),
  action
) {
  let newState;
  switch (action.type) {
    // case actionTypes.RECEIVE_USER_AUTHENTICATED:
    case actionTypes.RECEIVE_INIT_USER_INFO:
      localStorage.setItem('isLoggedIn', true);
      if (
        window.__GATrackingOrganizationObject__ &&
        action.user &&
        action.user.organization &&
        !action.user.organization.configs
      ) {
        action.user.organization = window.__GATrackingOrganizationObject__;
      }
      window.__ED__ = action.user;
      try {
        // Set custom NR attributes
        window.newrelic.setCustomAttribute('userId', action.user.id);
        window.newrelic.setCustomAttribute('orgId', action.user.organization.id);
      } catch (e) {}
      return state.merge({
        isLoggedIn: true,
        invalidLogin: false,
        isOcgEnabled: action.user.isOcgEnabled,
        isAdmin: action.user.isAdmin === true,
        isManager: action.user.isManager === true,
        hasReporters: action.user.hasReporters === true,
        id: action.user.id + '',
        picture: action.user.picture,
        avatar: action.user.picture,
        name: action.user.fullName,
        first_name: action.user.firstName,
        last_name: action.user.lastName,
        showGtcConfirmationModal: action.user.showGtcConfirmationModal,
        handle: action.user.handle && action.user.handle.substr(1),
        email: action.user.email,
        isGroupLeader: action.user.isGroupLeader,
        profile: action.user.profile,
        orgAnnualSubscriptionPaid: action.user.orgAnnualSubscriptionPaid,
        jwtToken: action.user.jwtToken,
        isSuperAdmin: action.user.isSuperAdmin,
        isLoaded: true,
        teams: action.user.activeOrgs,
        countryCode: action.user.countryCode,
        isOrgAdmin: action.user.isOrgAdmin,
        onboardingCompleted: action.user.onboardingCompleted,
        orgName: action.user.organization.name,
        filestackApiKey: action.user.filestackApiKey,
        pubnubKeys: action.user.pubnubKeys,
        impersonatee: action.user.impersonatee,
        impersonator: action.user.impersonator,
        isMkpAdmin: action.user.isMkpAdmin,
        relatedOrgs: action.user.relatedOrgs,
        isFactorEnrolled: action.user.isFactorEnrolled,
        passwordChangeable: action.user.passwordChangeable
      });
    case actionTypes.UPDATED_USER_DETAILS_FOR_SETTINGS_PAGE:
      const userDetails = action.onboardingState.user;
      return state.merge({
        picture: userDetails.picture,
        avatar: userDetails.avatar || userDetails.picture,
        bio: userDetails.bio,
        handle: userDetails.handle?.substr(1)
      });
    case actionTypes.SET_CURRENT_USER_INFO:
      return state.merge(action.userData);
    case actionTypes.ERROR_INIT_USER:
      localStorage.setItem('isLoggedIn', false);
      return state.set('isLoggedIn', false);
    case actionTypes.USER_LOG_OUT:
      localStorage.setItem('isLoggedIn', false);
      localStorage.setItem('afterLoginContentURL', '/');
      localStorage.setItem('afterOnboardingURL', '/');
      return state.set('isLoggedIn', false);
    case actionTypes.ERROR_USER_LOGIN:
      const mergeObj = {
        invalidEmailInput: true,
        invalidPasswordInput: true,
        locked: false,
        isLoggedIn: false
      };
      if (action.errorMsg == 'Your account is locked.') {
        mergeObj.locked = true;
      }
      return state.merge(mergeObj);
    case actionTypes.ERROR_UPDATED_USER_INFO:
      return state.set('updateError', true);
    
    default:
      return state;
  }
}
