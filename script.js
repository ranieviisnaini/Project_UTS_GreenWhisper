// =======================================================
// PENTING: Ganti dengan API Key Trefle kamu:
// =======================================================
const TREFLE_API_KEY = "usr-zPHsJSDqbmpFJOpverrlW9bwidC8FUq-fiSmQL3aYgs"; // API KEY YANG KAMU BERIKAN

// Element HTML
const plantGallery = document.getElementById('plantGallery');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

// Fungsi untuk membuat elemen kartu tanaman
function createPlantCard(plant) {
    const card = document.createElement('div');
    card.className = 'plant-card';

    // Menggunakan gambar dari Trefle, atau placeholder jika tidak ada
    const imageUrl = plant.image_url || 'https://via.placeholder.com/300x200?text=Flora+Vista'; 
    
    card.innerHTML = `
        <img src="${imageUrl}" alt="${plant.common_name || plant.scientific_name}" class="plant-card-image">
        <div class="plant-card-content">
            <h3>${plant.common_name || 'Nama Umum Tidak Ada'}</h3>
            <p>${plant.scientific_name ? `<i>${plant.scientific_name}</i>` : 'Nama Ilmiah Tidak Tersedia'}</p>
            <span>Famili: ${plant.family || 'Tidak Diketahui'}</span>
        </div>
    `;
    return card;
}

// Fungsi untuk mengambil data tanaman dari Trefle API
async function fetchPlants(searchTerm = '') {
    plantGallery.innerHTML = `
        <div class="loading-state">
            <i class="fas fa-spinner fa-spin"></i> Memuat data tanaman...
        </div>
    `;

    try {
        let endpoint = searchTerm ? 'search' : 'plants';
        
        // --- PERUBAHAN KRITIS ADA DI URL INI ---
        // Kita panggil endpoint /api/ yang akan diproxy oleh Vercel/Netlify
        let apiUrl = `/api/${endpoint}?token=${TREFLE_API_KEY}&limit=20`; 
        
        if (searchTerm) {
            apiUrl += `&q=${encodeURIComponent(searchTerm)}`;
        }

        const response = await fetch(apiUrl);
        
        // Cek jika response tidak OK (misal 401 Unauthorized karena API Key salah)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}. Cek API Key.`);
        }
        
        const data = await response.json();

        plantGallery.innerHTML = ''; 
        if (data.data && data.data.length > 0) {
            data.data.forEach(plant => {
                plantGallery.appendChild(createPlantCard(plant));
            });
        } else {
            plantGallery.innerHTML = `
                <div class="loading-state">
                    <i class="fas fa-exclamation-circle"></i> Tidak ada tanaman ditemukan untuk "${searchTerm}".
                </div>
            `;
        }

    } catch (error) {
        console.error("Gagal mengambil data tanaman:", error);
        plantGallery.innerHTML = `
            <div class="loading-state error" style="color: #D32F2F;">
                <i class="fas fa-exclamation-triangle"></i> Gagal memuat data. Periksa konsol browser untuk detail error.
            </div>
        `;
    }
}

// Event listeners tetap sama
searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();
    fetchPlants(searchTerm);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchButton.click();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    fetchPlants(); 
});