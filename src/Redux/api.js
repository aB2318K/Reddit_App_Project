const clientId = 'v9b1jUBc-grV10iAymubYw';
const clientSecret = 'dYbTKGrFzCoyOZLXitAdi-hru_6BAg';
//const redirectUri = 'http://localhost:5173/';
const userAgent = 'DeDDit';


//Fetching access token
const fetchAccessToken = async () => {
  try {
    const tokenResponse = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
      },
      body: 'grant_type=client_credentials'
    });

    if (!tokenResponse.ok) {
      throw new Error(`Failed to obtain access token. Status: ${tokenResponse.status}`);
    }

    const tokenData = await tokenResponse.json();
    return tokenData.access_token;
  } catch (error) {
    console.error('Error fetching access token:', error);
    throw error;
  }
};


//Fetching posts for home page
export const fetchPosts = async () => {
  try {
    const accessToken = await fetchAccessToken();

    const response = await fetch('https://oauth.reddit.com/r/popular/hot.json', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': userAgent,
        'Authorization': `Bearer ${accessToken}`
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error(`Request to /r/popular/hot.json failed. Status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

//Fetching posts for subreddit page
export const fetchSubRedditPosts = async (subReddit) => {
  try {
    const accessToken = await fetchAccessToken();

    const response = await fetch(`https://oauth.reddit.com/r/${subReddit}.json`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': userAgent,
        'Authorization': `Bearer ${accessToken}`
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error(`Request to /r/${subReddit}.json failed. Status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};


//Fetching posts by filter 
export const fetchPostsByFilter = async (filter) => {
  try {
    const accessToken = await fetchAccessToken();

    const response = await fetch(`https://oauth.reddit.com/r/popular/${filter}.json`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': userAgent,
        'Authorization': `Bearer ${accessToken}`
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error(`Request to /r/${subReddit}.json failed. Status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};




//Fetching search results
export const fetchSearchResults = async (searchQuery, type) => {
  try {
    const accessToken = await fetchAccessToken();
    const fetchUrl = `https://oauth.reddit.com/search.json?q=${searchQuery}&type=${type}`;
    const response = await fetch(fetchUrl, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': userAgent,
        'Authorization': `Bearer ${accessToken}`
      },
    });

    console.log("The fetch URL is " + fetchUrl + " and type is " + type);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error(`Request to /search.json failed. Status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};