// import React, { Component, useEffect, useState } from 'react';
import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Searchbar from './SearchBar/SearchBar';
import ImageGallery from 'components/ImageGallery/ImageGallery';
import s from 'components/styles.module.css';
import Button from 'components/Button/Button';
import api from './API/API';

import { Modal } from 'components/Modal/Modal';
import Loader from './Loader/Loader';

// export const Appp = () => {
// const [status, setStatus] = useState("idle");
// const [query, setQuery] = useState([]);
// const [page, setPage] = useState(1);
// const [name, setName] = useState("");
// const [modalAlt, setModalAlt] = useState("");
// const [showModal, setModal] = useState(false);
// const [modalImg, setModalImg] = useState("");
// const [error, setError] = useState(null);

// useEffect({}, []);
// }

export default class App extends Component {
  state = {
    status: 'idle',
    query: [],
    page: 1,
    name: '',
    modalAlt: '',
    showModal: false,
    modalImg: '',
    error: null,
  };

  componentDidUpdate(_, prevState) {
    const prevQuery = prevState.name;
    const nextQuery = this.state.name;

    const prevPage = prevState.page;
    const nextPage = this.state.page;

    if (nextPage > 1) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
    }

    if (prevQuery !== nextQuery) {
      this.setState({
        query: [],
        status: 'pending',
      });
    }

    if (prevQuery !== nextQuery || prevPage !== nextPage) {
      api
        .fetchQuery(nextQuery, nextPage)
        .then(({ hits }) => {
          const images = hits.map(
            ({ id, webformatURL, largeImageURL, tags }) => {
              return { id, webformatURL, largeImageURL, tags };
            }
          );
          if (images.length > 0) {
            this.setState(prevState => {
              return {
                query: [...prevState.query, ...images],
                status: 'resolved',
              };
            });
          } else {
            this.setState({ status: 'rejected' });
            alert('No results! Try other request!');
          }
        })
        .catch(error => this.setState({ error, status: 'rejected' }));
    }
  }

  handleRequest = newQuery => {
    if (newQuery !== this.state.name) {
      this.setState({ name: newQuery, page: 1, status: 'pending' });
    }
  };

  handleModal = event => {
    const imgForModal = event.target.dataset.src;
    const altForModal = event.target.alt;
    this.setState({
      showModal: true,
      modalImg: imgForModal,
      modalAlt: altForModal,
    });
  };

  toLoadMore = () => {
    this.setState(({ page }) => {
      return { page: page + 1, status: 'pending' };
    });
  };

  toggleModal = () => {
    this.setState(({ showModal }) => ({
      showModal: !showModal,
    }));
  };

  render() {
    const { query, showModal, modalImg, modalAlt, status } = this.state;

    if (status === 'idle') {
      return (
        <>
          <Searchbar onSubmit={this.handleRequest} />
          <ToastContainer
            position="top-center"
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
        </>
      );
    }

    if (status === 'pending') {
      return (
        <>
          <Searchbar onSubmit={this.handleRequest} />
          {query.length > 0 && <ImageGallery query={query} />}
          <div className={s.Loader}>
            <Loader color="#27f00c" />
          </div>
        </>
      );
    }

    if (status === 'resolved') {
      return (
        <>
          {showModal && (
            <Modal onClose={this.toggleModal}>
              <img src={modalImg} alt={modalAlt} />
            </Modal>
          )}
          <div>
            <Searchbar onSubmit={this.handleRequest} />
            <ImageGallery
              onClickImg={this.handleModal}
              query={this.state.query}
            />
            <Button handleClickBtn={this.toLoadMore} />
          </div>
        </>
      );
    }

    if (status === 'rejected') {
      return (
        <>
          <Searchbar onSubmit={this.handleRequest} />
          <div className={s.Loader}>
            <Loader color="#ff0000" />
          </div>
        </>
      );
    }
  }
}
