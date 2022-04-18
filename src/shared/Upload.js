import React from "react";
import { storage } from "./firebase";

import { Button } from "../elements";

const Upload = (props) => {
    const fileInput = React.useRef();

    const selectFile = (e) => {
        // change가 된 이벤트
        console.log(e);
        // 인풋 그 자체
        console.log(e.target);

        console.log(e.target.files[0]);

        console.log(fileInput.current.files[0]);
    };
    
    const uploadFB = () => {
        let image = fileInput.current.files[0];
        const _upload = storage.ref(`images/${image.name}`).put(image);


        _upload.then((snapshot) => {
            console.log(snapshot);

            // snapshot.ref에서 다운로드 링크를 가져올 수 있음.
            snapshot.ref.getDownloadURL().then((url) => {
                console.log(url);
            })
        })
    }

    return (
        <React.Fragment>
            {/* 파일 리스트라는 객체(= 파일의 목록) 아래에 파일을 가지고 있다. */}
            <input type="file" onChange={selectFile} ref={fileInput} />
            <Button _onClick={uploadFB}>업로드하기</Button>
        </React.Fragment>
    );
};

export default Upload;
