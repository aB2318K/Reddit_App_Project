import { useSelector } from "react-redux";
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { selectPosts, loadPostsById } from '../../Redux/feedSlice'

function Feed() {
    const posts = useSelector(selectPosts);

    if (!posts) {
        return <div>Loading...</div>;
    }
    console.log(posts)

    const dispatch = useDispatch();

    useEffect(() => {
        
        dispatch(loadPostsById());
      }, []);
    

    return (
        <div>
            <h2>Feed</h2>
            <ul>
                {posts.map((post) => (
                    <li key={post.id}>
                        <a href={post.url} target="_blank" rel="noopener noreferrer">
                            {post.title}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Feed;