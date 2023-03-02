import React, { useEffect, useState } from 'react';
// import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Searchbar from './SearchBar/SearchBar';
import ImageGallery from 'components/ImageGallery/ImageGallery';
import s from 'components/styles.module.css';
import Button from 'components/Button/Button';
import api from './API';

import { Modal } from 'components/Modal/Modal';
import Loader from './Loader/Loader';

export default function App() {
  const [pictures, setPictures] = useState([]);
  const [page, setPage] = useState(1);
  const [request, setRequest] = useState('');
  const [isActive, setIsActive] = useState(false);
  // const [modalAlt, setModalAlt] = useState('');
  // const [showModal, setModal] = useState(false);
  // const [modalImg, setModalImg] = useState('');
  // const [error, setError] = useState(false);

  useEffect(() => {
    if (request === '') {
      return;
    }

    const getPictures = async () => {
      api.fetchQuery(request, page).then(({ hits, totalHits }) => {
        // const total = totalHits;
        const images = hits.map(({ id, webformatURL, largeImageURL, tags }) => {
          return { id, webformatURL, largeImageURL, tags };
        });
        if (images.length > 0) {
          setPictures(prevPictures => {
            return [...prevPictures, ...images];
          });
          setIsActive(true);
        } else {
          alert('No results! Try other request!');
        }
      });
    };

    getPictures();
  }, [request, page]);

  const handleRequest = prompt => {
    setPictures([]);
    setRequest(prompt);
    setPage(1);
  };

  const toLoadMore = () => {
    setPage(page => page + 1);
  };

  return (
    <>
      <Searchbar onSubmit={handleRequest} />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <ImageGallery gallery={pictures} />

      {false && (
        <div className={s.Loader}>
          <Loader color="#27f00c" />
        </div>
      )}

      {isActive && <Button handleClickBtn={toLoadMore} />}
    </>
  );
}
