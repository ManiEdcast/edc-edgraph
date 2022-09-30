import { getiframeEmbedURL } from '../requests/embed';

export function getEmbedURL(query) {
  return getiframeEmbedURL(query).then(url_link => url_link);
}