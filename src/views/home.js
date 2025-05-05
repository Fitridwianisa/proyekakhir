import { handleHome } from '../presenters/home-presenter.js';

export function renderHome() {
  document.getElementById('app').innerHTML = `
    <section>
      <h2>Catatan Liburan Terbaru</h2>
      <div id="story-list">Memuat data...</div>
      <div id="map" style="height: 400px; margin-top: 1rem;"></div>
    </section>
  `;

  handleHome((stories) => {
    const storyList = document.getElementById('story-list');

    if (stories.length === 0) {
      storyList.innerHTML = '<p>Tidak ada catatan liburan yang tersedia.</p>';
      return;
    }

    storyList.innerHTML = stories.map((story) => `
      <article class="story-item">
        <img src="${story.photoUrl}" alt="Foto dari ${story.name}" loading="lazy" />
        <h3>${story.name}</h3>
        <p>${story.description}</p>
        <p><small>🗓️ ${new Date(story.createdAt).toLocaleDateString('id-ID')}</small></p>
      </article>
    `).join('');

    const map = L.map('map').setView([-2.5489, 118.0149], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    stories.forEach(story => {
      if (story.lat && story.lon) {
        L.marker([story.lat, story.lon])
          .addTo(map)
          .bindPopup(`<strong>${story.name}</strong><br>${story.description}`);
      }
    });
  });
}
