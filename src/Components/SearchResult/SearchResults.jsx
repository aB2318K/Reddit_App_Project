import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SearchFilter from './SearchFilter';
import { useSelector, useDispatch } from 'react-redux';
import { loadResults, selectSearchResults } from '../../Redux/searchSlice';
import styles from './SearchResults.module.css';
import { Link } from 'react-router-dom';

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

function SearchResults() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const dispatch = useDispatch();
  const results = useSelector(selectSearchResults);
  
  // Access the values of 'q' and 'type'
  const searchQuery = searchParams.get('q');
  const searchType = searchParams.get('type');


  useEffect(() => {
    dispatch(loadResults({ searchQuery, type: searchType }));
  }, [dispatch, searchQuery, searchType]);

 
    //render results
    const renderResults = () => {
        if (results && results.length > 0 && results[0].data && results[0].data.children) {
        const items = results[0].data.children;
          console.log(items);
        if (searchQuery && searchType) {
            if (searchType === "link") {
                return (
                    <div>
                      {items.map((item) => (
                        <Link to={`/r/${item.data.subreddit}/${item.data.id}`} key={item.data.id} className={styles.container}>

                            <div className={styles.postContainer}>
                                <div className={styles.subRedditName}>r/{item.data.subreddit}</div>
                                <div className={styles.postTitle}>{item.data.title}</div>                        
                                <div className={styles.postInfo}>{formatNumber(item.data.ups)} Votes {formatNumber(item.data.num_comments)} Comments </div>
                            </div>

                            <div className={styles.imageContainer}>
                                {item.data.thumbnail && item.data.thumbnail_height && item.data.thumbnail_height >= 100 &&  item.data.thumbnail != "nsfw" && (
                                    <div className={styles.postImage}>
                                      <img src={item.data.thumbnail} />
                                    </div>
                                )}
                            </div>

                        </Link>
                      ))}
                    </div>
                  );
            } else if (searchType === "sr") {
            
            return (
                <div>
                {items.map((item) => (
                    <div key={item.data.id} className={styles.communityContainer}>

                      <Link to={item.data.url}>

                        <div className={styles.communityName}>{item.data.url}</div>

                        <div className={styles.communityInfo}>{formatNumber(item.data.subscribers)} Members</div>
                        
                        <div className={styles.communityDescription}>{item.data.public_description}</div>

                      </Link>
                  </div>
                ))}
                </div>
            );
            }
        }  else {
          return (
            <div className={styles.error}>CANNOT LOAD RESULTS</div>
          )
        }
        } else {
          return (
            <div className={styles.error}>CANNOT LOAD RESULTS</div>
          )
        };
    
    };

    return (
        <div>

            <div  className={styles.searchFilter}><SearchFilter searchQuery={searchQuery}/> </div>
        
            <div>
                {renderResults()}
            </div>


        </div>
    );
}

export default SearchResults;
