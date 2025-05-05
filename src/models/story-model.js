const BASE_URL = 'https://story-api.dicoding.dev/v1';

export async function fetchStories() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Silakan login terlebih dahulu.');
      return [];
    }

    const response = await fetch(`${BASE_URL}/stories?location=1`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    console.log('Data cerita yang diterima:', data);

    return data.listStory || [];
  } catch (error) {
    console.error('Gagal mengambil data:', error);
    return [];
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
    console.error('Gagal mengunggah:', error);
    alert('Gagal mengunggah data.');
  }
}


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
