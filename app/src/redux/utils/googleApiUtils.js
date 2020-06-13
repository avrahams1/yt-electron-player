import axios from "axios";
import googleApiToken from "./googleApiToken";

export function loadPlaylistChunkApi(playlistId, pageToken = "") {
    const url = `${getBaseUrl("playlistItems")}part=snippet&maxResults=50&playlistId=${playlistId}&pageToken=${pageToken}`;

    return doCallAndExtractData(url);
}

export function loadPlaylistDetails(playlistId) {
    const url = `${getBaseUrl("playlists")}part=contentDetails,snippet&id=${playlistId}`;

    return doCallAndExtractData(url);
}

function doCallAndExtractData(url) {
    return axios.get(url).then(response => response.data);
}

function getBaseUrl(api) {
    return `https://www.googleapis.com/youtube/v3/${api}?key=${googleApiToken}&`;
}