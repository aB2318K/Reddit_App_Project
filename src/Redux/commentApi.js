require('dotenv').config();
const clientId = process.env.REACT_APP_CLIENT_ID;
const clientSecret = process.env.REACT_APP_CLIENT_SECRET; 


export const fetchComments = async (postId) => {
    try {
      const tokenResponse = await fetch('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
        },
        body: `grant_type=client_credentials`
      });
  
      if (!tokenResponse.ok) {
        throw new Error('Failed to obtain access token');
      }
  
      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;
  
      const response = await fetch(`https://oauth.reddit.com/comments/${postId}.json`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'DeDDit',
          'Authorization': `Bearer ${accessToken}`
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('Request failed with status ' + response.status);
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };
  