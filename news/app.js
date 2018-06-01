const apiKey = 'c9ca698dd5b14410a9ff27c4277fe550';
const main = document.querySelector('main');
const sourceSelector = document.querySelector("#sourceSelector");
const defaultSource = 'the-washington-post';

window.addEventListener('load',  e => {
    updateNews();
    updateSourcs();
    sourceSelector.value = defaultSource;

    sourceSelector.addEventListener('change', e => {
        updateNews(e.target.value);
    });

    if('serviceWorker' in navigator) {
        try {
            // navigator.serviceWorker.register('serviceWorker.js');
            navigator.serviceWorker.register('serviceWorkerWithWorkbox.js');
            console.log('Service worker registered');
        } catch (error) {
            console.log('Service worker failed');
        }
    }
});

async function updateSourcs() {
    const res = await fetch(`https://newsapi.org/v1/sources`);
    const json =  await res.json();
    sourceSelector.innerHTML = json.sources.map(src => `<option value='${src.id}'>${src.name}</option>`).join('\n');
    sourceSelector.value = defaultSource;
}

async function updateNews(source = defaultSource) {
    const res = await fetch(`https://newsapi.org/v1/articles?source=${source}&apiKey=${apiKey}`);
    const json = await res.json();
    main.innerHTML = json.articles.map(createArticle).join('\n');
}

function createArticle(article) {
    return `
        <div class='article'>
            <a href='${article.url}'>
                <h2>${article.title}</h2>
                <img src='${article.urlToImage}'/>
                <p>${article.description}</p>
            </a>
        </div>
    `;
}

  