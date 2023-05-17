import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/?';
const API_KEY = '36419624-85580c17cb8c97bb743138bb8';

const searchParams = new URLSearchParams({
  key: API_KEY,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
  per_page: 40,
});

class ImgApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImg() {
    try {
      const response = await axios.get(
        `${BASE_URL}${searchParams}&q=${this.searchQuery}&page=${this.page}`
      );
      this.incrementPage();
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}

export { ImgApiService };
