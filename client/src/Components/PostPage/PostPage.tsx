import { useEffect, useState } from "react";
import { getCommentsById, getPostById } from "../../Services/serverRequests";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Post } from "../../Types/postTypes";
import { Comment } from "../../Types/commentTypes";
import CommentBox from "./CommentSection";
import ImagesList from "../ImagesList";

const PostPage = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState<Post>();
    const [comments, setComments] = useState<Comment[]>([]);
    const [ErrorMessage, setErrorMessage] = useState("");
    const [imagesList, setImagesList] = useState(restaurant?.photosUrl.map(url => `${process.env.REACT_APP_SERVER_URL}/media/posts/${url}`) ?? [])

    useEffect(() => {
        if (restaurant)
            setImagesList(restaurant.photosUrl.map(url => `${process.env.REACT_APP_SERVER_URL}/media/posts/${url}`));
    }, restaurant?.photosUrl)
    useEffect(() => {
        const getRestaurant = async () => {
            if (id) {
                const response = await getPostById(id);
                if (!axios.isAxiosError(response))
                    setRestaurant(response as Post)
            }
        };

        getRestaurant();
    }, [id]);

    useEffect(() => {
        const getComments = async () => {
            if (restaurant?._id) {
                const response = await getCommentsById(restaurant._id);
                if (!axios.isAxiosError(response))
                    setComments(response as Comment[])
            }
        };

        getComments();
    }, [restaurant])

    return (
        <div style={{ padding: '20px', width: '90vw' }}>
            {restaurant ?
                <div style={styles.content}>
                    <div style={styles.imageContainer} dir='rtl'>
                        <ImagesList
                            isAbleToAdd={false}
                            imagesUrl={imagesList}
                            setImagesUrl={setImagesList}
                            setErrorMessage={setErrorMessage}
                            height={"80vh"}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <h1>{restaurant.restaurantName}</h1>
                        <div style={{display: 'flex', width: '15vw', justifyContent: 'space-between'}}>
                            <h3> {`דירוג - ${restaurant.rating}`} </h3>
                            <h3> {`דירוג מגוגל -  ${restaurant.googleApiRating}`} </h3>
                        </div>
                        
                        <p style={{width: '24vw', maxHeight: '8vh', direction: 'rtl', overflowY: 'auto'}}>{restaurant.description}</p>
                        <h2>תגובות</h2>
                        <CommentBox comments={comments} post={restaurant} />
                    </div>
                </div>
                : <div> מסעדה לא נמצאה </div>}
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
    },
    backButton: {
        marginBottom: '10px',
        padding: '8px 12px',
        cursor: 'pointer',
        borderRadius: '5px',
        border: '1px solid #ccc',
        backgroundColor: '#f8f8f8',
    },
    content: {
        display: 'flex',
        gap: '20px',
    },
    imageContainer: {
        flex: '1',
    },
    image: {
        width: '70vw',
        Height: '50vh',
        borderRadius: '8px',
    },
    detailsContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    commentsContainer: {
        marginTop: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    commentCard: {
        display: 'flex',
        gap: '12px',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
    },
    avatar: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        objectFit: 'cover',
    },
};


export default PostPage;
