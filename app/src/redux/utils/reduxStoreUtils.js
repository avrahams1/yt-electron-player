import { readConfigRequest, readConfigResponse, writeConfigRequest, writeConfigResponse } from "secure-electron-store";

export const PLAYLIST_IDS_PROP = "playlistIds";
export const REMEMBER_PLAYLIST = "rememberPlaylistsSelection";
export const PLAYLIST_ITEMS_PROP = playlistId => `playlist-${playlistId}`;

export function writeValue(propName, value) {
  return sendStoreRequestAndRegisterForResponse(
    writeConfigRequest,
    writeConfigResponse,
    true,
    propName,
    value
  ).then(() => value);
}

export function readValue(propName, clearBindings = true) {
  return sendStoreRequestAndRegisterForResponse(
    readConfigRequest,
    readConfigResponse,
    clearBindings,
    propName
  ).then(args => {
    const { key, success, value } = args;

    if (key === propName && success && value) {
      return value;
    }

    return Promise.reject();
  })
}

function sendStoreRequestAndRegisterForResponse(requestType, responseType, clearBindings, ...additionalParams) {
  const { store } = window.api;

  if (clearBindings) {
    store.clearRendererBindings();
  }

  return new Promise(resolve => {
    store.onReceive(responseType, resolve);
    store.send(requestType, ...additionalParams);
  });
}