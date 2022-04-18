import {createAction, handleActions} from "redux-actions";
import {produce} from "immer";
import { firestore } from "../../shared/firebase";

// SET_POST = 목록 넣어주는 애
const SET_POST = "SET_POST";
// ADD_POST = 목록 추가해주는 애
const ADD_POST = "ADD_POST";

const setPost = createAction(SET_POST, (post_list) => ({post_list}));
const addPost = createAction(ADD_POST, (post) => ({post}));

const initialState = {
    list: [],

}

const initialPost = {
    id:0,
    user_info: {
    user_name: "Mint",
    user_profile: "http://yomidog.com/preSaleUpFile/200121_%EA%B9%80%ED%8F%AC%EB%A7%90%ED%8B%B0%EC%A6%88_638.jpg",
  },
  image_url: "http://yomidog.com/preSaleUpFile/200121_%EA%B9%80%ED%8F%AC%EB%A7%90%ED%8B%B0%EC%A6%88_638.jpg",
  contents: "귀여운 멍멍이네요!",
  comment_cnt: 10,
  insert_dt: "2021-02-27 10:00:00",
};

// 일단은 다 가져올 것이기 때문에 ()안은 공란으로 둔다.
const getPostFB = () => {
    return function (dispatch, getState, {history}) {
        // firestore내 collection 선택
        const postDB = firestore.collection("post");
        postDB.get().then((docs) => {
            let post_list = [];
            docs.forEach((doc) => {
               let _post = doc.data();

               // ['comment_cnt', 'contents', ..]
               // (누산된 값, 현재 값) // (accumulator, currentValue)
               // 키 값만 뽑아서 배열로 만들어주려고 다음 식 사용() reduce써서 예쁘게 잘 만듦.)
               let post = Object.keys(_post).reduce((acc, cur) => {

                // 키 값에 user_가 포함 돼? (-1이 아니다 = 포함이 된다면)
                if(cur.indexOf("user_") !== -1)
                    return {
                        ...acc, 
                        user_info: {...acc.user_info, [cur]: _post[cur]}};
                // [키]: 키에 해당하는 밸류
                return {...acc, [cur]: _post[cur]}
                // doc.data에는 id 안들어가있으니 여기에 id 추가
               }, {id: doc.id, user_info: {}});

               post_list.push(post);
            })

            console.log(post_list);

            dispatch(setPost(post_list));
        })
    }
}

export default handleActions(
    {
        [SET_POST]: (state, action) => produce(state, (draft) => {
            // draft의 list를 action.payload.post_list 로 넘어온 걸로 갈아끼울거임.
            draft.list = action.payload.post_list;
        }),
        [ADD_POST]: (state, action) => produce(state, (draft) => {

        })
    }, initialState

);

const actionCreators = {
    setPost,
    addPost,
    getPostFB,
}

export {actionCreators};