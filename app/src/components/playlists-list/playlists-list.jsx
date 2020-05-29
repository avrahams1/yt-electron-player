import React, { useEffect, useState, useCallback } from "react";
import { connect, useDispatch } from "react-redux";
import FlexView from "react-flexview";
import classNames from "classnames";
import { actions as toastrActions } from 'react-redux-toastr'
import { FiPlusCircle, FiMinusCircle } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import { addPlaylistId, removePlaylistID, loadDetails } from "Redux/components/playlist-picker/playlistPickerSlice";

import styles from "./playlists-list.scss";

const PlaylistsList = ({ playlistIDs, playlistDetails, addPlaylistId, removePlaylistID, addToastr }) => {
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newPlaylistId, setNewPlaylistId] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        if (!playlistIDs) return;
        dispatch(loadDetails());
    }, [playlistIDs]);

    const focusCallback = useCallback(node => {
        if (!node) return;
        node.focus();
    }, [])

    if (!playlistIDs) return null;

    const startAddNew = () => {
        if (isAddingNew) {
            return;
        }

        setIsAddingNew(true);
    };

    const addNew = () => {
        setIsAddingNew(false);

        const hasValue = !!newPlaylistId;
        const alradyExists = playlistIDs.indexOf(newPlaylistId) !== -1;

        if (hasValue && !alradyExists) {
            addPlaylistId(newPlaylistId);
        }

        if (hasValue && alradyExists) {
            addToastr({
                type: 'warning',
                title: `Playlist "${newPlaylistId}" was already added, ignoring...`,
            });
        }

        setNewPlaylistId("");
    }

    return (
        <FlexView column hAlignContent="left" className={styles.container}>
            <button className={classNames(styles.addButton)} onClick={startAddNew}><FiPlusCircle /></button>
            {!!playlistIDs.length && playlistIDs.map(createListItem(playlistDetails, removePlaylistID))}
            {(!playlistIDs.length && !isAddingNew) && <div>No playlists added, click the + button to add a playlist</div>}
            {isAddingNew && renderNewItem(focusCallback, newPlaylistId, setNewPlaylistId, addNew)}
        </FlexView>
    )
};

function renderNewItem(focusCallback, newPlaylistId, setNewPlaylistId, addNew) {
    const setValue = event => {
        setNewPlaylistId(event.target.value);
    }

    const onKeyDown = event => {
        if (event.key === 'Enter') {
            addNew();
        }
    };

    return (
        <input 
            type="text" 
            className={styles.newItem} 
            value={newPlaylistId}
            onChange={setValue}
            onBlur={addNew}
            onKeyDown={onKeyDown}
            placeholder="Playlist ID, e.g. PL8wFHI7-y_0w4AShZqurXcJIayFB9_jCa"
            ref={focusCallback} />
    );
}

function createListItem(playlistDetails, removePlaylistID) {
    return playlistId => {
        const currPlaylistDetails = playlistDetails[playlistId];
        let playlistDetailsRender;
        
        if (!currPlaylistDetails) {
            playlistDetailsRender =
             <span>
                {playlistId}
                <FaSpinner className={styles.spinner} />
            </span>;
        } else {
            const { title, itemCount, success } = currPlaylistDetails;

            if (success) {
                playlistDetailsRender = 
                    <span>
                        {title} with {itemCount} items
                    </span>
            } else {
                playlistDetailsRender =
                    <span>
                        {playlistId}
                        <MdErrorOutline className={styles.loadingError} />
                    </span>
            }
        }

        return (
            <React.Fragment key={playlistId}>
                <FlexView className={styles.item} style={{ justifyContent: "space-between" }}>
                    <div>{playlistDetailsRender}</div>
                    <button onClick={() => removePlaylistID(playlistId)} className={styles.remove}><FiMinusCircle /></button>
                </FlexView>
            </React.Fragment>
        );
    };
}

const mapStateToProps = (state, props) => {
    const { playlistIDs, playlistDetails } = state.playlistPicker;
  
    return { playlistIDs, playlistDetails };
};

const mapDispatch = { addPlaylistId, removePlaylistID, addToastr: toastrActions.add };

export default connect(mapStateToProps, mapDispatch)(PlaylistsList);