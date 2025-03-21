import React, { useEffect, useState } from 'react';
import {
    Card,
    CardHeader,
    Avatar,
    Typography,
} from '@mui/material';
import { useUser } from '../../Context/useUser';
import { Comment } from '../../Types/commentTypes';
import { getUserById } from '../../Services/serverRequests';
import axios from 'axios';
import { User } from '../../Types/userTypes';

type CommentProps = {
    comment: Comment;
};

const SingleComment = ({ comment }: CommentProps) => {
    const { user } = useUser();
    const [commentUser, setCommentUser] = useState(user);

    useEffect(() => {
        const getUser = async (senderId?: string) => {
            if (senderId) {
                const response = await getUserById(senderId);
                if (!axios.isAxiosError(response))
                    setCommentUser(response as User);
            }
        }
        getUser(comment.senderId);

    }, [])

    return (
        <Card key={comment.message} variant="outlined" sx={{ mb: 2 }}>
            <CardHeader
                avatar={<Avatar src={commentUser?.profilePictureExtension} alt={"profile"} />}
                title={<Typography variant="subtitle1" style={{ marginLeft: "2vh" }}>{commentUser?.username}</Typography>}
                subheader={<Typography variant="body2" style={{ marginLeft: "2vh" }}>{comment.message}</Typography>}
            />
        </Card>

    );
};

export default SingleComment;
