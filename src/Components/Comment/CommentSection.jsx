import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import { loadComments, selectComment } from "../../Redux/commentSlice";
import styles from './CommentSection.module.css';

function formatNumber(value) {
    if (value >= 1000) {
        const suffixes = ['', 'k', 'M', 'B', 'T'];
        const suffixNum = Math.floor(('' + value).length / 3);
        let shortValue = parseFloat((suffixNum !== 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(2));
        if (shortValue % 1 !== 0) {
            shortValue = shortValue.toFixed(1);
        }
        return shortValue + suffixes[suffixNum];
    }
    return value;
}

//random avatar
function getRandomAnimalEmoji() {
    const animalEmojis = [
      '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🦝', '🐻', '🐼', '🦄',
      '🐨', '🐯', '🐮', '🐷', '🐽', '🐸', '🐙', '🐵', '🦓', '🐆',
      '🦌', '🐴', '🐎', '🐖', '🦔', '🐀', '🐁', '🐓', '🦃', '🦚',
      '🦜', '🦢', '🦩', '🦕', '🐊', '🐢', '🦎', '🐍', '🐲', '🐉',
      '🦕', '🐋', '🦈', '🐬', '🐳', '🐋', '🐙', '🦑', '🦐', '🦞',
      '🦀', '🐜', '🐝', '🐞', '🦗', '🕷️', '🦋', '🐌', '🐛', '🦟',
      '🦠', '🦗'
    ];
  
    const randomIndex = Math.floor(Math.random() * animalEmojis.length);
    return animalEmojis[randomIndex];
  };
  

function CommentSection() {
    const dispatch = useDispatch();
    const comments = useSelector(selectComment);
    const { postId } = useParams();

    useEffect(() => {
        dispatch(loadComments(postId));
    }, [dispatch, postId]);

    if (comments.isLoading) {
        return <div>Loading...</div>;
    }

    if (comments.hasError) {
        return <div>Error loading comments</div>;
    }

    const renderReplies = (replies) => (
        replies.data.children
            .filter(reply => reply.kind !== 'more')
            .map((reply) => (
                <div className={styles.replyContainer} key={reply.data.id}>
                    <div className={styles.authorInfo}>{getRandomAnimalEmoji()}{reply.data.author}</div>
                    <div className={styles.replyBody}>{reply.data.body}</div>
                    <div className={styles.voteContainer}>
                        <div className={styles.upVote}>
                            <div className={styles.voteSymbol}>⇧</div>
                            {formatNumber(reply.data.ups)}
                            <div className={styles.voteSymbol}>⇩</div>
                        </div>
                    </div>
                    {reply.data.replies && reply.data.replies.data.children.length > 0 && renderReplies(reply.data.replies)}
                </div>
            ))
    );

    const renderComment = (comment) => {
        if (comment.kind === 'more') {
            return (
                    <div className={styles.moreComments}><a href={`https://www.reddit.com/${postId}`} target="_blank">{comment.data.count} more comments</a></div>
            );
        }

        return (
            <div className={styles.commentContainer} key={comment.data.id}>
                <div className={styles.authorInfo}>{getRandomAnimalEmoji()}{comment.data.author}</div>
                <div className={styles.commentBody}>{comment.data.body}</div>
                <div className={styles.voteContainer}>
                    <div className={styles.upVote}>
                        <div className={styles.voteSymbol}>⇧</div>
                        {formatNumber(comment.data.ups)}
                        <div className={styles.voteSymbol}>⇩</div>
                    </div>
                </div>
                {comment.data.replies && comment.data.replies.data.children.length > 0 && renderReplies(comment.data.replies)}
            </div>
        );
    };

    return (
        <div>
            {comments[0][1].data.children.map((comment) => renderComment(comment))}
        </div>
    );
}

export default CommentSection;
