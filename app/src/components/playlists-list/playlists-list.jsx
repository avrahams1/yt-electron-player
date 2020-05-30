import React, { useEffect, useState, useCallback } from "react";
import { connect, useDispatch } from "react-redux";
import FlexView from "react-flexview";
import { actions as toastrActions } from 'react-redux-toastr'
import { FiPlusCircle } from "react-icons/fi";
import { addPlaylistId, loadDetails } from "Redux/components/playlist-picker/playlistPickerSlice";
import Item from "./item";

import styles from "./playlists-list.scss";

const PlaylistsList = ({ playlistIDs, addPlaylistId, addToastr }) => {
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
    }, []);

    if (!playlistIDs) return null;

    const startAddNew = createStartAddNewFunc(isAddingNew, setIsAddingNew);
    const addNew = createAddNewFunc(setIsAddingNew, newPlaylistId, playlistIDs, addPlaylistId, addToastr, setNewPlaylistId);

    return (
        <FlexView column hAlignContent="left" className={styles.container}>
            <button className={styles.addButton} onClick={startAddNew}><FiPlusCircle /></button>
            {!!playlistIDs.length && playlistIDs.map(id => <Item playlistId={id} key={id} />)}
            {(!playlistIDs.length && !isAddingNew) && <div>No playlists added, click the + button to add a playlist</div>}
            {isAddingNew && renderNewItem(focusCallback, newPlaylistId, setNewPlaylistId, addNew)}
        </FlexView>
    );
};

function createStartAddNewFunc(isAddingNew, setIsAddingNew) {
    return () => {
        if (isAddingNew) {
            return;
        }

        setIsAddingNew(true);
    };
}

function createAddNewFunc(setIsAddingNew, newPlaylistId, playlistIDs, addPlaylistId, addToastr, setNewPlaylistId) {
    return () => {
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
    };
}

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

const mapStateToProps = (state, props) => {
    const { playlistIDs } = state.playlistPicker;

    return { playlistIDs };
};

const mapDispatch = { addPlaylistId, addToastr: toastrActions.add };

export default connect(mapStateToProps, mapDispatch)(PlaylistsList);