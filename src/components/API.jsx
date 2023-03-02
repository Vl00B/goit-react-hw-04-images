const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '30166248-c6812272da7f4e3caf06b5606';

function fetchQuery(searchQuery, page) {
  return fetch(
    `${BASE_URL}/?key=${API_KEY}&q=${searchQuery}
      &image_type=photo&orientation=horizontal&page=
      ${page}&per_page=12`
  ).then(response => response.json());
}

const api = { fetchQuery };

export default api;
