import { AddStoryPresenter } from '../presenters/add-story-presenter.js';
import { uploadStory } from '../models/story-model.js';

export function renderAddStory() {
  const presenter = AddStoryPresenter();

  document.getElementById('app').innerHTML = `
    <section>
      <h2>Tambah Cerita Liburan</h2>
      <form id="story-form">
        <label for="name">Nama:</label>
        <input type="text" id="name" required />

        <label for="description">Deskripsi:</label>
        <textarea id="description" required></textarea>

        <label>Foto:</label>
        <video id="video" autoplay playsinline></video>
        <canvas id="canvas" style="display:none;"></canvas>
        <button type="button" id="capture">Ambil Foto</button>

        <div id="photo-container" style="display: none;">
          <h3>Foto yang Diambil:</h3>
          <img id="captured-photo" src="" alt="Foto yang diambil" style="max-width: 100%;"/>
          <button type="button" id="retake">Foto Ulang</button>
        </div>

        <label>Pilih Lokasi:</label>
        <div id="map" style="height: 300px;"></div>
        <input type="hidden" id="lat">
        <input type="hidden" id="lon">

        <button type="submit">Kirim</button>
      </form>
    </section>
  `;

  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const capturedPhoto = document.getElementById('captured-photo');
  const photoContainer = document.getElementById('photo-container');
  const retakeButton = document.getElementById('retake');
  const captureButton = document.getElementById('capture');
  const form = document.getElementById('story-form');

  let photoBlob = null;
  let currentMarker = null;

  presenter.startCamera(video);

  captureButton.addEventListener('click', () => {
    canvas.style.display = 'block';
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      photoBlob = blob;
      capturedPhoto.src = URL.createObjectURL(blob);
      photoContainer.style.display = 'block';
    }, 'image/jpeg');
    stopCamera();
    captureButton.disabled = true;
    retakeButton.style.display = 'inline';
  });

  retakeButton.addEventListener('click', () => {

    photoBlob = null;
    capturedPhoto.src = '';
    photoContainer.style.display = 'none';
    captureButton.disabled = false;
    retakeButton.style.display = 'none';
    presenter.startCamera(video);
  });

  const map = L.map('map').setView([-2.5489, 118.0149], 5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  
  let userMarker = null;
  
  navigator.geolocation.getCurrentPosition((pos) => {
    const { latitude, longitude } = pos.coords;
  
    map.setView([latitude, longitude], 13);
  
    userMarker = L.marker([latitude, longitude], { draggable: true }).addTo(map);
    userMarker.bindPopup(`Lokasi Anda: ${latitude.toFixed(3)}, ${longitude.toFixed(3)}`).openPopup();
  
    document.getElementById('lat').value = latitude;
    document.getElementById('lon').value = longitude;
  
    userMarker.on('dragend', () => {
      const latLng = userMarker.getLatLng();
      document.getElementById('lat').value = latLng.lat;
      document.getElementById('lon').value = latLng.lng;
      userMarker.bindPopup(`Lokasi Dipilih: ${latLng.lat.toFixed(3)}, ${latLng.lng.toFixed(3)}`).openPopup();
    });
  
  }, () => {
    alert('Tidak dapat mengakses lokasi Anda.');
  });
  
  map.on('click', function (e) {
    const { lat, lng } = e.latlng;
  
    if (userMarker) {
      userMarker.setLatLng(e.latlng);
    } else {
      userMarker = L.marker(e.latlng, { draggable: true }).addTo(map);
    }
  
    document.getElementById('lat').value = lat;
    document.getElementById('lon').value = lng;
  
    userMarker.bindPopup(`Lokasi Dipilih: ${lat.toFixed(3)}, ${lng.toFixed(3)}`).openPopup();
  
    userMarker.on('dragend', () => {
      const latLng = userMarker.getLatLng();
      document.getElementById('lat').value = latLng.lat;
      document.getElementById('lon').value = latLng.lng;
      userMarker.bindPopup(`Lokasi Dipilih: ${latLng.lat.toFixed(3)}, ${latLng.lng.toFixed(3)}`).openPopup();
    });
  });
  

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const description = document.getElementById('description').value.trim();
    const lat = document.getElementById('lat').value;
    const lon = document.getElementById('lon').value;

    if (!name || !description || !photoBlob || !lat || !lon) {
      alert('Semua data termasuk foto dan lokasi harus diisi!');
      return;
    }

    await uploadStory({ description: `${name}: ${description}`, imageBlob: photoBlob, lat, lon });
    alert('Cerita berhasil ditambahkan!');
    location.hash = '#/';
  });

  window.addEventListener('hashchange', () => stopCamera());

  function stopCamera() {
    presenter.stopCamera();
  }
}


