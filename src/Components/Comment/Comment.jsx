import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import { loadComments, selectComment } from "../../Redux/commentSlice";
import CommentSection from "./CommentSection";
import styles from './Comment.module.css';
import MarkdownIt from 'markdown-it';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

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

function Comment() {
  const dispatch = useDispatch();
  const comments = useSelector(selectComment);
  const { postId } = useParams();

  useEffect(() => {
    dispatch(loadComments(postId));
  }, [dispatch, postId]);

  if (comments.isLoading) {
    return <div>Loading...</div>;
  }

  const md = new MarkdownIt();

  // Handling videos start...
  const audioUrl = (url) => {
    return url.replace(/(DASH_)(\d+)/, '$1AUDIO_128');
  };

  const handlePlay = () => {
    const video = document.getElementById(`video`);
    const audio = document.getElementById(`audio`);
    audio.play();
  };

  const handlePause = () => {
    const video = document.getElementById(`video`);
    const audio = document.getElementById(`audio`);
    audio.pause();
  };

  const handleTimeUpdate = () => {
    const video = document.getElementById(`video`);
    const audio = document.getElementById(`audio`);
    audio.currentTime = video.currentTime;
  };
  // Handling videos end...


// Handling gallery
  const renderGallery = (galleryData, mediaMetadata) => {

  
    if (!galleryData || !mediaMetadata) {
      // Add proper error handling or return a message for missing data
      return <div>Error: Gallery data or media metadata is missing.</div>;
    }
  
    return (
      <Carousel showThumbs={false}>
        {galleryData.items.map((item) => {
          const mediaId = item.media_id;
          const imageData = mediaMetadata[mediaId];
  
          if (!imageData || !imageData.p) {
            return <div>Error: Image cannot be displayed.</div>;
          }
  
          const highestResolutionSource = imageData.p.slice(-1)[0].u;
          const unencodedSource = highestResolutionSource.replace(/&amp;/g, '&'); // Replace &amp; with &
  
          return (
            <div key={mediaId}>
              <img
                src={unencodedSource}
                alt={item.caption}
                className={styles.galleryImage}
              />
            </div>
          );
        })}
      </Carousel>
    );
  };

  // Handling unrecognized media
  const renderUnrecognizedMedia = (url, thumbnail) => {
    // Check if the URL is from reddit.com
    const isRedditUrl = url.includes('reddit.com');
  
    if (!isRedditUrl) {
      return (
        <div>
          <p>
            <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
          </p>
          {thumbnail && <img className={styles.thumbnail} src={thumbnail} alt="Thumbnail" />}
        </div>
      );
    }
  
    
    return null;
  };
    

  return (
    <>
      {comments.length ? (

        <div className={styles.body}>

          <div className={styles.postContainer}>

            <div className={styles.mainPost}>

              <div className={styles.voteContainer}>

                <div className={styles.upVote}>
                  <div className={styles.voteSymbol}>⇧</div>
                  {formatNumber(comments[0][0].data.children[0].data.ups)}
                  <div className={styles.voteSymbol}>⇩</div>
                </div>
              </div>


              <div className={styles.postBody}>

                <div className={styles.postInfoContainer}>

                    <h5 className={styles.subredditName}>
                      <Link to={`/r/${comments[0][0].data.children[0].data.subreddit}`} id={styles.subredditName}>
                      {comments[0][0].data.children[0].data.subreddit_name_prefixed}
                      </Link> 
                      <span className={styles.authorName}> Posted by {comments[0][0].data.children[0].data.author}</span>
                    </h5>

                  </div>

                <div className={styles.postTitle}>{comments[0][0].data.children[0].data.title}</div>

                {comments[0][0].data.children[0].data.is_video && comments[0][0].data.children[0].data.secure_media.reddit_video.has_audio && (
                  <div className={styles.videoContainer}>
                    <video id={`video`} controls className={styles.video} onPlay={handlePlay} onPause={handlePause} onTimeUpdate={handleTimeUpdate}>
                      <source src={comments[0][0].data.children[0].data.secure_media.reddit_video.fallback_url} type="video/mp4" />
                    </video>
                    <video id={`audio`} className={styles.audio}>
                      <source src={audioUrl(comments[0][0].data.children[0].data.secure_media.reddit_video.fallback_url)} type="video/mp4" />
                    </video>
                  </div>
                )}

                {comments[0][0].data.children[0].data.is_video && !comments[0][0].data.children[0].data.secure_media.reddit_video.has_audio && (
                  <div className={styles.videoContainer}>
                    <video controls className={styles.video}>
                      <source src={comments[0][0].data.children[0].data.secure_media.reddit_video.fallback_url} type="video/mp4" />
                    </video>
                  </div>
                )}

                {comments[0][0].data.children[0].data.url && comments[0][0].data.children[0].data.url.match(/\.(jpeg|jpg|png|gif)$/) && (
                  <img src={comments[0][0].data.children[0].data.url} alt="Image" className={styles.postImage} />
                )}

                {comments[0][0].data.children[0].data.gallery_data && (
                <div className={styles.galleryContainer}>
                    {renderGallery(comments[0][0].data.children[0].data.gallery_data, comments[0][0].data.children[0].data.media_metadata)}
                </div>
                )}

                {comments[0][0].data.children[0].data.selftext && (
                  <div className={styles.selfText}>
                    <div dangerouslySetInnerHTML={{ __html: md.render(comments[0][0].data.children[0].data.selftext) }} />
                  </div>
                )}

                {comments[0][0].data.children[0].data.url &&
                !comments[0][0].data.children[0].data.url.match(/\.(jpeg|jpg|png|gif)$/) &&
                !comments[0][0].data.children[0].data.media &&
                !comments[0][0].data.children[0].data.selftext &&
                !comments[0][0].data.children[0].data.gallery_data && (
                <div className={styles.unrecognizedMedia}>
                    {renderUnrecognizedMedia(comments[0][0].data.children[0].data.url, comments[0][0].data.children[0].data.thumbnail)}
                </div>
                )}
              
                <div className={styles.commentInfo}>
                  <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" viewBox="0 0 24 24" className={styles.commentIcon}>
                    <path d="M12.005,23.663c-.356,0-.716-.126-1.001-.379l-3.898-3.284H0V2.5C0,1.122,1.121,0,2.5,0H21.5c1.379,0,2.5,1.122,2.5,2.5V20h-7.032l-3.985,3.295c-.275,.245-.626,.368-.978,.368ZM1,19H7.471l4.188,3.527c.2,.177,.485,.176,.674,.008l4.276-3.536h6.392V2.5c0-.827-.673-1.5-1.5-1.5H2.5c-.827,0-1.5,.673-1.5,1.5V19Z" />
                  </svg>
                  {formatNumber(comments[0][0].data.children[0].data.num_comments)} Comments <span id={styles.mobileVoteInfo}>⇧{formatNumber(comments[0][0].data.children[0].data.ups)}⇩</span>
                </div>

              </div>

            </div>

            <div className={styles.commentSection}>
              <CommentSection />
            </div>

          </div>
          
        </div>
      ) : (
        <div>No posts available</div>
      )}
    </>
  );
}

export default Comment;
