import React from "react";
import styled from "styled-components";
const Grid = (props) => {
    const { is_flex, width, margin, padding, bg, children } = props;
    const styles = {
        is_flex: is_flex,
        width: width,
        margin: margin,
        padding: padding,
        bg: bg,
    };
    return (
        <React.Fragment>
            {/* Grid는 외부를 싸주는 거라... Grid 안에 들어오는 거는 위에서 Child로 받아줘야함. props에 children 추가하고 GridBox안에 children 추가됨. */}
            <GridBox {...styles}>{children}</GridBox>
        </React.Fragment>
    );
};
Grid.defaultProps = {
    chidren: null,
    is_flex: false,
    width: "100%",
    padding: false,
    margin: false,
    bg: false,
};
// `padding: , `margin: , 이런애들은 속성이름 주는 거임.
const GridBox = styled.div`
    width: ${(props) => props.width};
    height: 100%;
    box-sizing: border-box;
    ${(props) => (props.padding ? `padding: ${props.padding};` : "")}
    ${(props) => (props.margin ? `margin: ${props.margin};` : "")}
    ${(props) => (props.bg ? `background-color: ${props.bg};` : "")}
    ${(props) =>
        props.is_flex
            ? `display: flex; align-items: center; justify-content: space-between; `
            : ""}
`;
export default Grid;
