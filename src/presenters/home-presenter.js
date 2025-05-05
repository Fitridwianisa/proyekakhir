import { fetchStories } from '../models/story-model.js';

export async function handleHome(renderCallback) {
  const stories = await fetchStories();
  renderCallback(stories);
}
