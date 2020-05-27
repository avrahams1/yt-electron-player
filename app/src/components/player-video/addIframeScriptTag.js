let didAddScriptTag = false;

export default (loadYTPlayer) => {
    if (didAddScriptTag) {
        loadYTPlayer();
        return;
    };

    const tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
        loadYTPlayer();
        window.onYouTubeIframeAPIReady = undefined;
    };

    didAddScriptTag = true;
}