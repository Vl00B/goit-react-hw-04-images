import { useState } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import s from 'components/styles.module.css';

export default function Searchbar({ onSubmit }) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.warning('Input your request!');
      return;
    }
    onSubmit(prompt.trim().toLowerCase());
  };

  return (
    <header className={s.Searchbar}>
      <form className={s.SearchForm} onSubmit={handleSubmit}>
        <button type="submit" className={s.SearchForm_button}></button>

        <input
          className={s.SearchForm_input}
          type="text"
          autoComplete="off"
          autoFocus
          value={prompt}
          placeholder="Search images and photos"
          onChange={event => {
            setPrompt(event.currentTarget.value);
          }}
          // onFocus={handleFocus}
        />
      </form>
    </header>
  );
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
