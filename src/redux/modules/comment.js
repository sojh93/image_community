import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore, realtime } from "../../shared/firebase";
import "moment";
import moment from "moment";

import firebase from "firebase/app";

import { actionCreators as postActions} from "./post";

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

const addCommentFB = (post_id, contents) => {
  return function(dispatch, getState, {history}) {
    const commentDB = firestore.collection("comment");
    const user_info = getState().user.user;

    // comment 1개에 대한 데이터
    let comment = {
      post_id: post_id,
      user_id: user_info.uid,
      user_name: user_info.user_name,
      user_profile: user_info.user_profile,
      contents: contents,
      insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
    }

    commentDB.add(comment).then((doc) => {
      const postDB = firestore.collection("post");
      // 리덕스에 있는 거 가지고 온다.
      const post = getState().post.list.find((l) => l.id === post_id);
      // increment는 .increment(숫자) 숫자만큼을 현재 가지고 있는 값에서 추가(+)해주는 친구.
      // 댓글은 1개만 작성할 것이기 때문에 1 넣음.
      const increment = firebase.firestore.FieldValue.increment(1);


      comment = {...comment, id: doc.id};
      // let a = 5; a = a+1 => comment_cnt + 1
      postDB.doc(post_id).update({comment_cnt: increment}).then((_post) => {
        
      
      dispatch(addComment(post_id, comment));
       
      // parseInt는 형변환 해주는 것.
      // 자바스크립트는 묵시적 형변환 지원해준다.
      // '0' + 1(숫자) = '01'(문자열)을 반환한다.\
      // 이를 예방하기 위해 parseInt()를 활용해서 ()값을 숫자로 바꿔준다.
      // editpost는 post하나에 대한 수정을 함. comment_cnt를 수정해준다.
      if(post){
        dispatch(postActions.editPost(post_id, {comment_cnt: parseInt(post.comment_cnt) + 1,
        })
        );


        // 게시글을 작성한 사람한테 알람이 간다.
        const _noti_item = realtime.ref(`noti/${post.user_info.user_id}/list`).push();

        _noti_item.set({
          post_id: post.id,
          user_name: comment.user_name,
          image_url: post.image_url,
          insert_dt: comment.insert_dt
        }, (err) => {
          if(err){
            console.log("알림 저장에 실패했어요!");
          } else {
            const notiDB = realtime.ref(`noti/${post.user_info.user_id}`)

            notiDB.update({read: false});
          }
        });
         
      }
      // dispatch()
    })
  })
}}

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

// reducer
export default handleActions(
    {
        [SET_COMMENT]: (state, action) => produce(state, (draft) => {
          // let data = {[post_id]: comment_list, ...}
          // post_id로 댓글이 들어갈 방 만들어 주는 거임
          draft.list[action.payload.post_id] = action.payload.comment_list;
        }),
        [ADD_COMMENT]: (state, action) => produce(state, (draft) => {
          // push는 배열의 뒤에 값 넣어주고 unshift는 앞으로 넣어준다.
          draft.list[action.payload.post_id].unshift(action.payload.comment);
        }),
        [LOADING]: (state, action) =>
            produce(state, (draft) => {
                draft.is_loading = action.payload.is_loading;
            }),
    },
    initialState
);

const actionCreators = {
    getCommentFB,
    addCommentFB,
    setComment,
    addComment,
};

export { actionCreators };
