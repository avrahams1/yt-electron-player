import React from "react";
import Tooltip from "react-tooltip-lite";

function MyTooltip(props) {
    const { children, text, ...otherProps } = props;

    return (
        <Tooltip content={text} direction="top" background="black" color="white" {...otherProps}>{children}</Tooltip>
    );
}

export default MyTooltip;