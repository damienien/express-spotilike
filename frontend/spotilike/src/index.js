import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Components/login/login";
import Register from "./Components/register/register";
import Album from "./Components/Home/albumsList/albumList";
import AlbumDetail from "./Components/Home/albumsList/AlbumDetail";
import AlbumEdit from "./Components/Home/albumsList/albumEdit";
import AlbumCreate from "./Components/Home/albumsList/AlbumCreate";
import Artistes from "./Components/Home/artistes/artistList";
import ArtisteEdit from "./Components/Home/artistes/artistEdit";
import ArtistDetail from "./Components/Home/artistes/artistDetails";
import ArtistCreate from "./Components/Home/artistes/artistCreate";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/home",
    element: <App />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/albums",
    element: <Album />,
  },
  {
    path: "/albums/:id",
    element: <AlbumDetail />,
  },
  { path: "/albums/edit/:id", 
    element: <AlbumEdit /> 
  },
  {
    path: '/albums/create',
    element: <AlbumCreate />
  },
  {
    path: '/artists',
    element: <Artistes />
  },
  {
    path:'/artists/edit/:id',
    element: <ArtisteEdit />
  },
  {
    path: '/artists/:id',
    element: <ArtistDetail />
  },
  {
    path: '/artists/create',
    element: <ArtistCreate />
  }
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // disable to avoid twice rendering
  // <React.StrictMode>
  <RouterProvider router={router} />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
