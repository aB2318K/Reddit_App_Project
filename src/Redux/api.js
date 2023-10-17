const clientId = 'qmE3FqJyvsb2Hpulsd1nKA';

export const fetchPosts = async () => {
    try {
        const response = await fetch('https://www.reddit.com/r/popular/hot.json', {
          method: 'GET',
          mode: 'cors',
          credentials: 'omit',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'DeDDit',
            'Authorization': `Bearer ${clientId}`
          },
        });
      
        if (response.ok) {
          const data = await response.json();
          console.log(data);
        } else {
          throw new Error('Request failed with status ' + response.status);
        }
      } catch (error) {
        console.log(error)
      }
};

