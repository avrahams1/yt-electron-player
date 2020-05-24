import React from 'react';
import ReactDom from "react-dom";
import { connect } from "react-redux";
import { debounce } from "lodash";
import classNames from "classnames";
import FlexView from 'react-flexview';
import { setNewSongIndex } from "Redux/components/player/playerSlice";

import styles from "./playlist-list.scss";

class PlaylistList extends React.Component {
  constructor(props) {
    super(props);

    this.onSearchTermChangedDebounced = debounce(query => this.setState({ currentSearchTerm: query }), 700);

    this.state = {
      displaySearchTerm: "",
      currentSearchTerm: ""
    };
  }

  componentDidUpdate(prevProps, prevState) {
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
      <div className={classes} {...extraProps} key={item.id}>
        <span className={styles.number}>{index + 1} - </span>
        <a href="" onClick={onClick}>{item.name}</a>
      </div>
    )
  }

  render() {
    const { currentSong, list } = this.props;
    const { currentSearchTerm, displaySearchTerm } = this.state;

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

    return (
      <FlexView column hAlignContent="left">
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