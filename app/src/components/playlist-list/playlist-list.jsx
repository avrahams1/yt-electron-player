import React from 'react';
import ReactDom from "react-dom";
import { connect } from "react-redux";
import { debounce } from "lodash";
import { MdPlaylistPlay } from "react-icons/md";
import classNames from "classnames";
import FlexView from 'react-flexview';
import { setNewSongIndex } from "Redux/components/player/playerSlice";

import styles from "./playlist-list.scss";

class PlaylistList extends React.Component {
  constructor(props) {
    super(props);

    this.onSearchTermChangedDebounced = debounce(query => this.setState({ currentSearchTerm: query }), 700);
    this.toggleFolded = this.toggleFolded.bind(this);

    this.state = {
      isFolded: false,
      displaySearchTerm: "",
      currentSearchTerm: ""
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isFolded !== prevState.isFolded) {
      // Resize is retarded :(
      for (let i = 0; i < 10; i++) {
        window.dispatchEvent(new Event('resize'));
      }
    }

    if (this.props.currentSong === prevProps.currentSong &&
        this.state.currentSearchTerm === prevState.currentSearchTerm) {
      return;
    }

    const itemComponent = this.refs.currentSong;

    if (!itemComponent) {
      return;
    }

    const domElement = ReactDom.findDOMNode(itemComponent);
    domElement.scrollIntoView(true);
  }

  onSearchTermChanged(event) {
    const { value } = event.target;
    this.setState({ displaySearchTerm: value });
    this.onSearchTermChangedDebounced(value);
  }

  toggleFolded() {
    this.setState(({ isFolded }) => ({ isFolded: !isFolded }));
  }

  renderListItem({ item, index }) {
    const { currentSong, setNewSongIndex } = this.props;

    const isSelected = currentSong.id === item.id;

    const classes = classNames(styles.item, {
      [styles.selected]: isSelected
    });

    const extraProps = isSelected ? {
      ref: "currentSong"
    } : {};

    const onClick = e => {
      setNewSongIndex(index);
      e.preventDefault();
    };

    return (
      <div className={classes} {...extraProps} key={item.id} onClick={onClick}>
        <span>{index + 1} - </span>
        <span>{item.name}</span>
      </div>
    )
  }

  render() {
    const { currentSong, list } = this.props;
    const { currentSearchTerm, displaySearchTerm, isFolded } = this.state;

    if (!currentSong) {
      return <div>Loading...</div>;
    }

    let filteredList = list.map((item, index) => ({ item, index }));

    if (currentSearchTerm) {
      const lowerCaseSearchTerms = currentSearchTerm
        .toLowerCase()
        .split(" ")
        .filter(str => str)
        .map(str => str.trim())
        .filter(str => str);
        
      if (lowerCaseSearchTerms.length) {
        filteredList = filteredList.filter(({ item }) => {
          const currItemName = item.name.toLowerCase();

          return lowerCaseSearchTerms.every(subStr => currItemName.indexOf(subStr) !== -1);
        });
      }
    }

    const containerClasses = classNames(styles.container, {
      [styles.folded]: isFolded
    });

    return (
      <FlexView className={containerClasses} column hAlignContent="left">
        <MdPlaylistPlay className={styles.foldButton} onClick={this.toggleFolded} />
        <input type="text" placeholder="Search" className={styles.searchBar} value={displaySearchTerm} onChange={this.onSearchTermChanged.bind(this)} />
        <FlexView column hAlignContent="left" className={styles.list}>
          {filteredList.map(this.renderListItem.bind(this))}
        </FlexView>
      </FlexView>
    )
  }
}

const mapStateToProps = (state, props) => {
  const { currentSong, list } = state.player;

  return { currentSong, list };
};

const mapDispatch = { setNewSongIndex };

export default connect(mapStateToProps, mapDispatch)(PlaylistList);