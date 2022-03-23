import styled from 'styled-components';
import React from 'react';

const Image = (props) => {

    const {shape, src, size} = props;

    return (

        <React.Fragment>

            
        </React.Fragment>


    );
};

Image.defaultProps = {
    shape: "circle",
    src: "https://mean0images.s3.ap-northeast-2.amazonaws.com/4.jpeg",
    size: 36,
}

// div의 백그라운드 이미지로 조정해줄거임.
const ImageCircle = styled.div`
`

export default Image;