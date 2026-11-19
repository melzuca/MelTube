/* ==================================================
   MELTUBE — SISTEMA DE PESQUISA FUNCIONAL
================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-box input');
    const searchBtn = document.querySelector('.search-btn');

    if (!searchInput) return;

    function executeSearch() {
        const query = searchInput.value.trim();
        const isWatchPage = window.location.pathname.includes('/pages/');

        if (isWatchPage) {
            // Se estivermos numa página de vídeo, redireciona para o index com o termo
            if (query) {
                window.location.href = `../index.html?search=${encodeURIComponent(query)}`;
            } else {
                window.location.href = `../index.html`;
            }
        } else {
            // Se já estivermos no index, filtra os cartões diretamente
            filterVideos(query);
            const newUrl = query ? `${window.location.pathname}?search=${encodeURIComponent(query)}` : window.location.pathname;
            window.history.replaceState({}, '', newUrl);
        }
    }

    function filterVideos(query) {
        const videoCards = document.querySelectorAll('.vid-list');
        const heading = document.querySelector('.section-heading h2');
        const listContainer = document.querySelector('.list-container');
        if (!videoCards.length || !listContainer) return;

        let noResults = document.getElementById('noResultsBox');
        if (!noResults) {
            noResults = document.createElement('div');
            noResults.id = 'noResultsBox';
            noResults.style.cssText = 'padding: 40px 20px; font-size: 15px; color: #555; grid-column: 1 / -1; text-align: center;';
            listContainer.appendChild(noResults);
        }

        let count = 0;
        const q = query.toLowerCase();

        videoCards.forEach(card => {
            const title = card.querySelector('.video-title')?.textContent.toLowerCase() || '';
            const channel = card.querySelector('.channel-name')?.textContent.toLowerCase() || '';

            if (!q || title.includes(q) || channel.includes(q)) {
                card.style.display = '';
                count++;
            } else {
                card.style.display = 'none';
            }
        });

        if (heading) {
            heading.textContent = query ? `Search results for "${query}" (${count})` : 'Recommended';
        }

        if (count === 0 && query) {
            noResults.style.display = 'block';
            noResults.innerHTML = `No results found for "<b>${query}</b>". Try checking your spelling or use different keywords.`;
        } else {
            noResults.style.display = 'none';
        }
    }

    // Se o index abrir com ?search= na URL, aplica o filtro automaticamente
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
        searchInput.value = searchParam;
        filterVideos(searchParam);
    }

    // Ao clicar na lupa
    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            executeSearch();
        });
    }

    // Ao pressionar Enter no input
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            executeSearch();
        }
    });

    // Filtro instantâneo ao digitar na página inicial
    if (!window.location.pathname.includes('/pages/')) {
        searchInput.addEventListener('input', () => {
            filterVideos(searchInput.value.trim());
        });
    }
});
