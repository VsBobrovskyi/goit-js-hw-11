import { ImgApiService } from './components/api-service';
import { createImgMarkup } from './components/createMarkup';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { refs } from './components/refs';
import './css/styles.css';

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

const imagesApiService = new ImgApiService();

let lightbox = new SimpleLightbox('.photo-card a', {
  captionPosition: 'bottom',
  captionsData: 'alt',
  captionDelay: 250,
});

let imagesShown = 0;

function onFormSubmit(evt) {
  evt.preventDefault();

  clearMarkup();

  refs.loadMoreBtn.classList.add('is-hidden');

  imagesApiService.resetPage();

  imagesApiService.query = evt.currentTarget.elements.searchQuery.value.trim();

  if (!imagesApiService.query) {
    Notify.info('Empty request, please type not only spaces');
    return;
  }
  fetchImg();
}

async function fetchImg() {
  try {
    const { hits, totalHits, total } = await imagesApiService.fetchImg();

    if (!hits.length) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    refs.gallery.insertAdjacentHTML('beforeend', createImgMarkup(hits));

    if (imagesApiService.page > 2) {
    }

    if (!imagesShown) {
      Notify.success(
        `We found ${totalHits} , buy licence to get more, total found ${total}`
      );
    }

    imagesShown += hits.length;
    lightbox.refresh();

    if (imagesShown < totalHits) {
      refs.loadMoreBtn.classList.remove('is-hidden');
    } else {
      refs.loadMoreBtn.classList.add('is-hidden');
      Notify.info(
        `We are sorry, but you have reached the end of search results. Totally shown: ${imagesShown} images`
      );
    }
  } catch (error) {
    Notify.failure(`${error}`);
  }
}

function clearMarkup() {
  refs.gallery.innerHTML = ``;
}

function onLoadMore() {
  fetchImg();
}
