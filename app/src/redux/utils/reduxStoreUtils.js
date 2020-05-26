import { readConfigRequest, readConfigResponse, writeConfigRequest, writeConfigResponse } from "secure-electron-store";

export const PLAYLIST_IDS_PROP = "playlistIds";
export const REMEMBER_PLAYLIST = "rememberPlaylistsSelection";
export const PLAYLIST_ITEMS_PROP = playlistId => `playlist-${playlistId}`;

export function writeValue(propName, value) {
  return sendStoreRequestAndRegisterForResponse({
    requestType: writeConfigRequest,
    responseType: writeConfigResponse,
    additionalParams: [propName, value]
  }).then(() => value);
}

export function readValue(propName, clearBindings = true) {
  return sendStoreRequestAndRegisterForResponse({
    requestType: readConfigRequest,
    responseType: readConfigResponse,
    clearBindings,
    additionalParams: [propName]
  }).then(args => {
    const { key, success, value } = args;

    if (key === propName && success && value) {
      return args.value;
    }

    return Promise.reject();
  })
}

function sendStoreRequestAndRegisterForResponse({ requestType, responseType, clearBindings = true, additionalParams = [] }) {
  if (clearBindings) {
    window.api.store.clearRendererBindings();
  }

  return new Promise(resolve => {
    window.api.store.onReceive(responseType, resolve);

    window.api.store.send(requestType, ...additionalParams);
  });
}