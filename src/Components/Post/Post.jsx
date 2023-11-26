import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import React, { useEffect } from 'react';
import { selectPosts, loadPosts } from '../../Redux/feedSlice';
import { Link } from 'react-router-dom';
import styles from './Post.module.css';
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

function Post() {

  const posts = useSelector(selectPosts);
  const dispatch = useDispatch();
  const { subReddit, option } = useParams();
  
  useEffect(() => {
    dispatch(loadPosts({ subReddit, option }));
  }, [dispatch, subReddit, option]);

  if (posts.isLoading) {
    return <div>Loading...</div>;
  }

  if (posts.hasError) {
    return <div>Error: {posts.error}</div>;
  }

  
  const limitText = (text, limit) => {
    if (text.length <= limit) {
      return text;
    }
    return text.slice(0, limit) + '...';
  };


  // Handling videos start
  const audioUrl = (url) => {
    return url.replace(/(DASH_)(\d+)/, '$1AUDIO_128');
  }

  const handlePlay = (index) => {
    const video = document.getElementById(`video_${index}`);
    const audio = document.getElementById(`audio_${index}`);
    audio.play();
  };
  
  const handlePause = (index) => {
    const video = document.getElementById(`video_${index}`);
    const audio = document.getElementById(`audio_${index}`);
    audio.pause();
  };
  
  const handleTimeUpdate = (index) => {
    const video = document.getElementById(`video_${index}`);
    const audio = document.getElementById(`audio_${index}`);
    audio.currentTime = video.currentTime;
  };
  //handling videos end
  
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



  return (
    <div>

      {posts.length ? (

        <div>

          {posts[0].data.children.map((child, index) => (

            <div className={styles.postContainer} key={child.data.id}>

              <div className={styles.mainPost}>

                <div className={styles.voteContainer}>

                  <div className={styles.upVote}>

                    <div className={styles.voteSymbol}>⇧</div>

                    {formatNumber(child.data.ups)}

                    <div className={styles.voteSymbol}>⇩</div>

                  </div>

                </div>

                <div className={styles.postPreview}>

                  <div className={styles.postInfoContainer}>

                    <h5 className={styles.subredditName}>
                      <Link to={`/r/${child.data.subreddit}`} id={styles.subredditName}>
                      {child.data.subreddit_name_prefixed}
                      </Link> 
                      <span className={styles.authorName}> Posted by {child.data.author}</span>
                    </h5>

                  </div>
                  

                  <div className={styles.postTitle}><Link to={`/r/${child.data.subreddit}/${child.data.id}`} id={styles.postTitle}>{child.data.title}</Link></div>

                  {child.data.is_video && child.data.secure_media.reddit_video.has_audio && (

                    <div className={styles.videoContainer}>

                        <video id={`video_${index}`} controls className={styles.video}
                                                    onPlay={() => handlePlay(index)} 
                                                    onPause={() => handlePause(index)} 
                                                    onTimeUpdate={() => handleTimeUpdate(index)}>
                            <source src={child.data.secure_media.reddit_video.fallback_url} type="video/mp4" />                         
                        </video>  
                        <video  id={`audio_${index}`} className={styles.audio}>
                            <source src={audioUrl(child.data.secure_media.reddit_video.fallback_url)} type="video/mp4" />
                        </video>                 

                    </div>

                  )}

                  {child.data.is_video && !child.data.secure_media.reddit_video.has_audio && (

                    <div className={styles.videoContainer}>

                      <video controls className={styles.video}>
                        <source src={child.data.secure_media.reddit_video.fallback_url} type="video/mp4" />                         
                      </video>                  

                    </div>

                  )}

                  {child.data.url && child.data.url.match(/\.(jpeg|jpg|png|gif)$/) && (

                      <img src={child.data.url} alt="Image" className={styles.postImage} />
                      
                  )}

                  {child.data.gallery_data && (

                    <div className={styles.galleryContainer}>
                        {renderGallery(child.data.gallery_data, child.data.media_metadata)}
                    </div>

                  )}

                  {child.data.selftext && (

                    <div className={styles.postText}>{limitText(child.data.selftext, 100)}</div>

                  )}

                </div>
                
                <div className={styles.commentInfo}>
                  <Link to={`/r/${child.data.subreddit}/${child.data.id}`}id ={styles.commentInfo}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    id="Layer_1"
                    viewBox="0 0 24 24"
                    className={styles.commentIcon}
                  >
                    <path d="M12.005,23.663c-.356,0-.716-.126-1.001-.379l-3.898-3.284H0V2.5C0,1.122,1.121,0,2.5,0H21.5c1.379,0,2.5,1.122,2.5,2.5V20h-7.032l-3.985,3.295c-.275,.245-.626,.368-.978,.368ZM1,19H7.471l4.188,3.527c.2,.177,.485,.176,.674,.008l4.276-3.536h6.392V2.5c0-.827-.673-1.5-1.5-1.5H2.5c-.827,0-1.5,.673-1.5,1.5V19Z" />
                  </svg>
                  {formatNumber(child.data.num_comments)} Comments <span id={styles.mobileVoteInfo}>⇧{formatNumber(child.data.ups)}⇩</span>
                  </Link>
                  
                </div>

              </div>

            </div>

          ))}

        </div>

      ) : (
        <div>No posts available</div>
      )}

    </div>

  );
}

export default Post;