function applyThemeBasedOnTime() {
    const hour = new Date().getHours();
    const isDayTime = hour >= 6 && hour < 18;

    document.body.classList.toggle('dark-mode', !isDayTime);

    const container = document.querySelector('.container');
    if (container) {
        container.classList.toggle('dark-mode', !isDayTime);
    }

    console.log(`Current hour: ${hour}`);
    console.log(`Is it daytime? ${isDayTime}`);
    console.log(`Dark mode applied to container: ${container?.classList.contains('dark-mode')}`);
}

applyThemeBasedOnTime();

const form = document.getElementById('summarizerForm');
const summaryDiv = document.getElementById('summary');
const descriptionSection = document.getElementById('descriptionSection');
const keyPointsSection = document.getElementById('keyPointsSection');
const container = document.getElementById('container');
const button = form.querySelector('button');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const youtubeLink = document.getElementById('youtubeLink').value;
    button.textContent = 'Getting Summary...';

    try {
        const response = await fetch('https://renderbackend-xfh6.onrender.com/summarize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: youtubeLink }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch the summary');
        }

        const data = await response.json();

        container.style.width = '100%';
        container.style.maxWidth = "800px";

        summaryDiv.classList.add('show');

        let formattedDescription = data.description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formattedDescription = formattedDescription.replace(/\n/g, '<br>');

        let formattedKeyPoints = data.key_points.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formattedKeyPoints = formattedKeyPoints.replace(/\n/g, '<br>');

        const videoId = youtubeLink.split('v=')[1]?.split('&')[0];

        descriptionSection.innerHTML = `
            <h3>Description</h3>
            <p>${formattedDescription}</p>
        `;

        if (videoId) {
            const videoEmbedUrl = `https://www.youtube.com/embed/${videoId}`;
            descriptionSection.innerHTML += `
                <h3>Video</h3>
                <iframe width="100%" height="315" src="${videoEmbedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            `;
        }

        keyPointsSection.innerHTML = `
            <h3>Key Points</h3>
            <p>${formattedKeyPoints}</p>
        `;
    } catch (error) {
        summaryDiv.style.display = 'block';
        summaryDiv.innerText = 'Error: ' + error.message;
    } finally {
        button.textContent = 'Summarize Another Video';
    }
});
