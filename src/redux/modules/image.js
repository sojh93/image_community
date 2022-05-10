import {createAction, handleActions} from "redux-actions";
import produce from "immer";

import {storage} from "../../shared/firebase";

const UPLOADING = 'UPLOADING';
const UPLOAD_IMAGE = "UPLOAD_IMAGE";
const SET_PREVIEW = "SET_PREVIEW";


const uploading = createAction(UPLOADING, (uploading) => ({uploading}));
const uploadImage = createAction(UPLOAD_IMAGE, (image_url) => ({image_url}));
const setPreview = createAction(SET_PREVIEW, (preview) => ({preview}));

const initialState = {

    image_url: '',
    uploading: false,
    preview: null,
}

const uploadImageFB = (image) => {
    return function(dispatch, getState, {history}){
        // uploadImageFB랑 handleActions에서 dispatch 두번 쓰게 됨.
        // dispatch는 uploadImageFB에서만 쓸 거임
        dispatch(uploading(true));
        const _upload = storage.ref(`images/${image.name}`).put(image);


        _upload.then((snapshot) => {
            console.log(snapshot);
            // dispatch(uploading(false));

            // snapshot.ref에서 다운로드 링크를 가져올 수 있음.
            snapshot.ref.getDownloadURL().then((url) => {
                dispatch(uploadImage(url));
                console.log(url);
            })
        })
    }
}



export default handleActions({
    [UPLOAD_IMAGE]: (state, action) => produce(state, (draft) => {
        draft.image_url = action.payload.image_url;
        draft.uploading = false;
    }),
    [UPLOADING]: (state, action) => produce(state, (draft) => {
        draft.uploading = action.payload.uploading;
    }),
    [SET_PREVIEW]: (state, action) => produce(state, (draft) => {
        draft.preview = action.payload.preview;
    })
}, initialState);


// UPLOADING은 해줄 필요 없음.
// actionCreators는 액션 내보내는 곳
const actionCreators = {
    uploadImage,
    uploadImageFB,
    setPreview,
};

export {actionCreators};