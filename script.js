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

document.addEventListener('DOMContentLoaded', () => {
    const iconContainer = document.createElement('div');
    iconContainer.classList.add('icon-container');

    iconContainer.innerHTML = `
        <i data-lucide="moon"></i>
        <i data-lucide="sun"></i>
    `;

    document.body.appendChild(iconContainer);

    lucide.createIcons();

    // Toggle dark mode when the moon icon is clicked
    const moonIcon = document.querySelector('[data-lucide="moon"]');
    moonIcon.addEventListener('click', () => {
        document.body.classList.add('dark-mode');
        const container = document.querySelector('.container');
        if (container) {
            container.classList.add('dark-mode');
        }
        console.log('Dark mode activated!');
    });

    // Toggle light mode when the sun icon is clicked
    const sunIcon = document.querySelector('[data-lucide="sun"]');
    sunIcon.addEventListener('click', () => {
        document.body.classList.remove('dark-mode');
        const container = document.querySelector('.container');
        if (container) {
            container.classList.remove('dark-mode');
        }
        console.log('Light mode activated!');
    });
});


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
        
        const existingTitle = summaryDiv.querySelector('.video-title');
        if (existingTitle) {
            existingTitle.remove();
        }

        const titleElement = document.createElement('h2');
        titleElement.textContent = data.title;
        titleElement.classList.add('video-title');
        summaryDiv.insertBefore(titleElement, summaryDiv.firstChild);

        descriptionSection.innerHTML = `
            <p>${formattedDescription}</p>
        `;

        if (videoId) {
            const videoEmbedUrl = `https://www.youtube.com/embed/${videoId}`;
            descriptionSection.innerHTML += `
                <iframe width="100%" height="315" src="${videoEmbedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            `;
        }

        keyPointsSection.innerHTML = `
            <h2>Key Points</h2>
            <p>${formattedKeyPoints}</p>
        `;
    } catch (error) {
        summaryDiv.style.display = 'block';
        summaryDiv.innerText = 'Error: ' + error.message;
    } finally {
        button.textContent = 'Summarize Another Video';
    }
});
