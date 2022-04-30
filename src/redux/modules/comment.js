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
const setComment = createAction(SET_COMMENT, (post_id, comment_list) => ({post_id, comment_list}));
const addComment = createAction(ADD_COMMENT, (post_id, comment) => ({post_id, comment}));

const loading = createAction(LOADING, (is_loading) => ({ is_loading }));

// initialState
const initialState = {
  list: {},
  is_loading: false,
};

// 함수
const getCommentFB = (post_id) => {
    return function(dispatch, getState, {history}){

    }
}


export default handleActions(
  {
      [SET_COMMENT]: (state, action) => produce(state, (draft) => {

      }),
      [ADD_COMMENT]: (state, action) => produce(state, (draft)=> {

      }),
      [LOADING]: (state, action) => 
      produce(state, (draft) => {
        draft.is_loading = action.payload.is_loading;
      })
  },
  initialState
);

const actionCreators = {
  getCommentFB,
  setComment,
  addComment,
};

export { actionCreators };