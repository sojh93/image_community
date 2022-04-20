import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators as imageActions } from "../redux/modules/image";
import { Button } from "../elements";

const Upload = (props) => {

    const dispatch = useDispatch();
    const is_uploading = useSelector((state) => state.image.uploading);

    const fileInput = React.useRef();

    const selectFile = (e) => {
        // 인풋 그 자체
        console.log(e.target);

        console.log(e.target.files[0]);

        console.log(fileInput.current.files[0]);

        const reader = new FileReader();
        const file = fileInput.current.files[0];

        reader.readAsDataURL(file);

        reader.onloadend = () => {
            console.log(reader.result);
            dispatch(imageActions.setPreview(reader.result));
        }
    };
    
    const uploadFB = () => {
        let image = fileInput.current.files[0];
        dispatch(imageActions.uploadImageFB(image));

    }

    return (
        <React.Fragment>
            {/* 파일 리스트라는 객체(= 파일의 목록) 아래에 파일을 가지고 있다. */}
            {/* 파일이 업로드되는 도중에는 '파일선택'버튼이 disable된다. */}
            <input type="file" onChange={selectFile} ref={fileInput} disabled={is_uploading}/>
            <Button _onClick={uploadFB}>업로드하기</Button>
        </React.Fragment>
    );
};

export default Upload;
