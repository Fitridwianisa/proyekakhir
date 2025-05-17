import { StoryDB, PendingDB } from '../utils/indexeddb.js';

const BASE_URL = 'https://story-api.dicoding.dev/v1';

export async function fetchStories() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Silakan login terlebih dahulu.');
    return [];
  }

  try {
    const response = await fetch(`${BASE_URL}/stories?location=1`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    const stories = data.listStory || [];

    for (const story of stories) {
      await StoryDB.add({
        id: story.id,
        name: story.name,
        description: story.description,
        image: story.photoUrl,
        lat: story.lat,
        lon: story.lon,
        createdAt: story.createdAt,
      });
    }

    return stories;
  } catch (error) {
    console.warn('Gagal ambil dari API, fallback ke IndexedDB:', error);

    const localStories = await StoryDB.getAll();
    const pending = await PendingDB.getAll();

    return [
      ...localStories.map((story) => ({
        id: story.id,
        name: story.name || 'Tanpa Nama',
        description: story.description || '',
        photoUrl: story.image || '',
        lat: parseFloat(story.lat),
        lon: parseFloat(story.lon),
        createdAt: story.createdAt || new Date().toISOString(),
      })),
      ...pending.map((story) => ({
        id: `pending-${story.localId}`,
        name: 'Offline',
        description: story.description,
        photoUrl: '', // Belum ada URL gambar jika offline
        lat: parseFloat(story.lat),
        lon: parseFloat(story.lon),
        createdAt: story.createdAt,
      }))
    ];
  }
}

export async function uploadStory({ description, imageBlob, lat, lon }) {
  const formData = new FormData();
  formData.append('description', description);
  formData.append('photo', imageBlob);
  formData.append('lat', lat);
  formData.append('lon', lon);

  try {
    const token = localStorage.getItem('token');
    await fetch(`${BASE_URL}/stories`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    alert('Berhasil mengirim data!');
  } catch (error) {
    console.warn('Offline. Simpan ke pendingStories:', error);
    await PendingDB.add({ description, imageBlob, lat, lon, createdAt: new Date().toISOString() });
    alert('Data disimpan offline dan akan dikirim saat online.');
  }
}

window.addEventListener('online', async () => {
  const pending = await PendingDB.getAll();

  for (const item of pending) {
    try {
      const formData = new FormData();
      formData.append('description', item.description);
      formData.append('photo', item.imageBlob);
      formData.append('lat', item.lat);
      formData.append('lon', item.lon);

      const token = localStorage.getItem('token');
      await fetch(`${BASE_URL}/stories`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      await PendingDB.delete(item.localId);
      console.log('Data offline berhasil dikirim:', item);
    } catch (err) {
      console.warn('Gagal upload data offline:', err);
    }
  }
});

export async function loginUser({ email, password }) {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.loginResult.token);
      alert('Berhasil login!');
      return true;
    } else {
      alert(data.message || 'Gagal login');
      return false;
    }
  } catch (err) {
    console.error(err);
    alert('Terjadi kesalahan saat login');
    return false;
  }
}

export async function registerUser({ name, email, password }) {
  try {
    const res = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      alert('Berhasil daftar! Silakan login.');
      return true;
    } else {
      alert(data.message || 'Gagal daftar');
      return false;
    }
  } catch (err) {
    console.error(err);
    alert('Terjadi kesalahan saat daftar');
    return false;
  }
}
