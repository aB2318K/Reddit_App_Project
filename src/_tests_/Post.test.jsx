import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import Post from '../Components/Post/Post.jsx';
import feedReducer from '../Redux/feedSlice.js';
import '@testing-library/jest-dom';

describe('Post component', () => {
  it('renders post data', async () => {
    const mockPosts = [
      {
        data: {
          children: [
            {
              data: {
                id: '123',
                subreddit_name_prefixed: 'r/testing',
                author: 'testuser',
                title: 'Test Post 1',
                is_video: false,
                url: 'https://example.com/image1.jpg',
                num_comments: 5,
                ups: 10,
              },
            },
          ],
        },
      },
      // Add more posts as needed
    ];

    const store = createStore(
      feedReducer,
      {
        feed: {
          posts: mockPosts,
        },
      },
      applyMiddleware(thunk)
    );

    render(
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<Post />} />
          </Routes>
        </Router>
      </Provider>
    );

    // Assertions
    mockPosts.forEach((post) => {
      console.log(screen.debug());
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
      expect(screen.getByText(/Posted by testuser/)).toBeInTheDocument();
      expect(screen.getByText(/5 Comments/)).toBeInTheDocument();
      expect(screen.getByText(/⇧10⇩/)).toBeInTheDocument();
      
    });
  });
});
