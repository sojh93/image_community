import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore } from "../../shared/firebase";
import "moment";
import moment from "moment";

// Action type
const SET_COMMENT = "SET_COMMENT";
const ADD_COMMENT = "ADD_COMMENT";

const LOADING = "LOADING";

// Action 생성자
const setComment = createAction(SET_COMMENT, (post_id, comment_list) => ({
    post_id,
    comment_list,
}));
const addComment = createAction(ADD_COMMENT, (post_id, comment) => ({
    post_id,
    comment,
}));

const loading = createAction(LOADING, (is_loading) => ({ is_loading }));

// initialState
const initialState = {
    list: {},
    is_loading: false,
};

// 함수
const getCommentFB = (post_id = null) => {
    return function (dispatch, getState, { history }) {
        if (!post_id) {
            return;
        }
        const commentDB = firestore.collection("comment");
        // 역순정렬 -> desc로
        commentDB
            .where("post_id", "==", post_id)
            .orderBy("insert_dt", "desc")
            .get()
            .then((docs) => {
              let list = [];

              docs.forEach((doc) => {
                list.push({...doc.data(), id: doc.id});
              })


              dispatch(setComment(post_id, list));
            }).catch(err => { 
              console.log('댓글 정보를 가져올 수가 없네요!', err);

            });
          };
};

export default handleActions(
    {
        [SET_COMMENT]: (state, action) => produce(state, (draft) => {
          // let data = {[post_id]: comment_list, ...}
          // post_id로 댓글이 들어갈 방 만들어 주는 거임
          draft.list[action.payload.post_id] = action.payload.comment_list;
        }),
        [ADD_COMMENT]: (state, action) => produce(state, (draft) => {}),
        [LOADING]: (state, action) =>
            produce(state, (draft) => {
                draft.is_loading = action.payload.is_loading;
            }),
    },
    initialState
);

const actionCreators = {
    getCommentFB,
    setComment,
    addComment,
};

export { actionCreators };
