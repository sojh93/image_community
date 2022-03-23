import React from "react";

// import elements
import Grid from "../elements/Grid";

const Post = (props) => {
    console.log(props);
    return (
        <React.Fragment>
            <Grid padding="16px">
            {/* Grid로 묶어줬기 때문에 밑에 자식들은 children으로 넘어가게 됨. */}
            <div>img / nickname / time / btn</div>
            <div>contents</div>
            <div>image</div>
            <div>comment cnt</div>
            </Grid>
        </React.Fragment>
    );
};
Post.defaultProps = {
    user_info: {
        user_name: "mean0",
        user_profile:
            "https://mean0images.s3.ap-northeast-2.amazonaws.com/4.jpeg",
    },
    image_url: "https://mean0images.s3.ap-northeast-2.amazonaws.com/4.jpeg",
    contents: "고양이네요!",
    comment_cnt: 10,
    insert_dt: "2021-02-27 10:00:00",
};

export default Post;