import React, { useState } from "react";
import { connect } from "react-redux";
import FlexView from "react-flexview";
import classNames from "classnames";
import { FaSpinner } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import { FiMinusCircle } from "react-icons/fi";
import { removePlaylistID } from "Redux/components/playlist-picker/playlistPickerSlice";

import styles from "./item.scss";

const Item = ({ playlistId, currPlaylistDetails, removePlaylistID }) => {
    const [removeButtonMouseHover, setRemoveButtonMouseHover] = useState("");

    const itemClasses = classNames(styles.item, {
        [styles.mouseHoveredOverRemove]: removeButtonMouseHover === playlistId
    });

    let playlistDetailsRender;

    if (currPlaylistDetails) {
        const { success } = currPlaylistDetails;

        if (success) {
            const { title, itemCount } = currPlaylistDetails;
            playlistDetailsRender = successItem(title, itemCount);
        } else {
            playlistDetailsRender = failureItem(playlistId);
        }
    } else {
        playlistDetailsRender = preLoadingItem(playlistId);
    }

    return (
        <FlexView className={itemClasses} style={{ justifyContent: "space-between" }}>
            <div><span className={styles.text}>{playlistDetailsRender}</span></div>
            <button 
                onClick={() => removePlaylistID(playlistId)} 
                className={styles.remove}
                onMouseOver={() => setRemoveButtonMouseHover(playlistId)}
                onMouseOut={() => setRemoveButtonMouseHover("")}><FiMinusCircle /></button>
        </FlexView>
    );
}

function preLoadingItem(playlistId) {
    return (
        <React.Fragment>
            {playlistId}
            <FaSpinner className={styles.spinner} />
        </React.Fragment>
    );
}

function successItem(title, itemCount) {
    return `${title} with ${itemCount} items`;
}

function failureItem(playlistId) {
    return (
        <React.Fragment>
            {playlistId}
            <MdErrorOutline className={styles.loadingError} />
        </React.Fragment>
    );
}

const mapStateToProps = (state, props) => {
    const { playlistDetails } = state.playlistPicker;
    const { playlistId } = props;
    const currPlaylistDetails = playlistDetails[playlistId];

    return { currPlaylistDetails };
};

const mapDispatch = { removePlaylistID };

export default connect(mapStateToProps, mapDispatch)(Item);