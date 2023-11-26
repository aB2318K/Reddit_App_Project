import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import { Routes, Route, MemoryRouter } from "react-router-dom"; // Import MemoryRouter
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Comment from "../Components/Comment/Comment";
import commentReducer from "../Redux/commentSlice";

describe("Comment component", () => {
  it("Renders comment data", async () => {
    const mockComments = [
      [
        {
          data: {
            children: [
              {
                data: {
                  ups: 50,
                  subreddit_name_prefixed: "r/test",
                  author: "testName",
                  title: "Test Post",
                },
              },
            ],
          },
        },
        {
          data: {
            children: [
              {
                data: {
                  id: "1a",
                  author: "commentAuthor",
                  body: "Test Comment",
                  ups: 23,
                  replies: {
                    data: {
                        children: [
                            {
                                data: {
                                    id: "1aa",
                                    author: "replyAuthor",
                                    body: "Test Reply",
                                    ups: 30,
                                },
                            },
                        ],
                    },
                    
                  },
                },
              },
            ],
          },
        },
      ],
    ];

    const store = configureStore({
      reducer: {
        comment: commentReducer,
      },
      preloadedState: {
        comment: {
          comments: mockComments,
        },
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/r/test/1"]}>
          {/* Use MemoryRouter and set the initial entry */}
          <Routes>
            <Route path="r/:subReddit/:postId" element={<Comment />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    //Post assertions
    expect(screen.getByText(/Test Post/)).toBeInTheDocument();
    expect(screen.getByText("r/test")).toBeInTheDocument();
    expect(screen.getByText(/Posted by testName/)).toBeInTheDocument();

    //Comments assertions
    expect(screen.getByText(/commentAuthor/)).toBeInTheDocument();
    expect(screen.getByText(/Test Comment/)).toBeInTheDocument();
    expect(screen.getByText(/23/)).toBeInTheDocument();


    //Reply assertions
    expect(screen.getByText(/replyAuthor/)).toBeInTheDocument();
    expect(screen.getByText(/Test Reply/)).toBeInTheDocument();
    expect(screen.getByText(/30/)).toBeInTheDocument();
  });
});
