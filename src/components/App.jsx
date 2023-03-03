import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Searchbar from './SearchBar/SearchBar';
import ImageGallery from 'components/ImageGallery/ImageGallery';
import Button from 'components/Button/Button';
import Loader from './Loader/Loader';
import { Modal } from './Modal/Modal';

import api from './API';
import s from 'components/styles.module.css';

export default function App() {
  const [pictures, setPictures] = useState([]);
  const [page, setPage] = useState(1);
  const [request, setRequest] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [showModal, setModal] = useState(false);
  const [modalAlt, setModalAlt] = useState('');
  const [modalImg, setModalImg] = useState('');

  useEffect(() => {
    if (request === '') {
      return;
    }

    const getPictures = async () => {
      setIsLoading(true);

      api.fetchQuery(request, page).then(({ hits, totalHits }) => {
        const total = totalHits;
        const images = hits.map(({ id, webformatURL, largeImageURL, tags }) => {
          return { id, webformatURL, largeImageURL, tags };
        });

        if (page === Math.ceil(total / 12)) {
          setIsActive(false);
          setIsLoading(false);
          return toast.warn(
            "We're sorry, but you've reached the end of your query."
          );
        }

        if (images.length === 0) {
          toast.error('There are no matching images. Please, tey again');
          setIsLoading(false);
        }

        if (images.length > 0) {
          setPictures(prevPictures => {
            return [...prevPictures, ...images];
          });
          setIsActive(true);
          setIsLoading(false);
        } else {
          setIsActive(false);
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

  const handleModal = event => {
    const imgForModal = event.target.dataset.src;
    const altForModal = event.target.alt;
    setModal(true);
    setModalAlt(altForModal);
    setModalImg(imgForModal);
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

      <ImageGallery gallery={pictures} onClickImg={handleModal} />

      {isLoading && (
        <div className={s.Loader}>
          <Loader color="#27f00c" />
        </div>
      )}

      {isActive && <Button handleClickBtn={toLoadMore} />}
      {showModal && (
        <Modal
          onClose={() => {
            setModal(!showModal);
          }}
        >
          <img src={modalImg} alt={modalAlt} />
        </Modal>
      )}
    </>
  );
}
