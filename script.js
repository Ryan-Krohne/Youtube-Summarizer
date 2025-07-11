function applyThemeBasedOnPreference() {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-mode');
        const container = document.querySelector('.container');
        if (container) {
            container.classList.add('dark-mode');
        }
    } else {
        document.body.classList.remove('dark-mode');
        const container = document.querySelector('.container');
        if (container) {
            container.classList.remove('dark-mode');
        }
    }

}

applyThemeBasedOnPreference();

window.toggleAnswer = function(event) {
    const questionDiv = event.currentTarget;
    const answerDiv = questionDiv.nextElementSibling;
    const dropdownArrow = questionDiv.querySelector('.dropdown-arrow');

    if (answerDiv && dropdownArrow) {
        //console.log("Current display style:", answerDiv.style.display);
        answerDiv.style.display = answerDiv.style.display === 'none' ? 'block' : 'none';
        dropdownArrow.textContent = answerDiv.style.display === 'none' ? '▼' : '▲';
        //console.log("New display style:", answerDiv.style.display);
    } else {
        //console.log("Answer Div or Dropdown Arrow not found!");
    }
};

// Home button changes for github deploy
document.addEventListener("DOMContentLoaded", () => {
    const isGitHubPages = window.location.hostname.includes("github.io");
    const logoLink = document.querySelector(".logo-link");
    if (isGitHubPages && logoLink) {
        logoLink.href = "/Youtube-Summarizer";
    }
});

  

// Day/Night toggles
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
    });

    // Toggle light mode when the sun icon is clicked
    const sunIcon = document.querySelector('[data-lucide="sun"]');
    sunIcon.addEventListener('click', () => {
        document.body.classList.remove('dark-mode');
        const container = document.querySelector('.container');
        if (container) {
            container.classList.remove('dark-mode');
        }
    });
});

//Intro JS stuff
window.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('/summary')) {
        return;  // Skip Intro.js
    }
    const isMobileOrTablet = window.innerWidth <= 1024;
    if (!isMobileOrTablet){
        const hasSeenTour = localStorage.getItem('hasSeenTour');
        if (!hasSeenTour) {
            introJs()
              .setOptions({
                steps: [
                  {
                    element: document.querySelector('#youtubeLink'),
                    intro: 'Paste the link to any YouTube video you want summarized.',
                    position: 'top'
                  },
                  {
                    element: document.querySelector('button[type="submit"]'),
                    intro: 'Click this button to fetch the summary and key points from the video.',
                    position: 'top'
                  }
                ],
                showProgress: true,
                showBullets: true,
                nextLabel: 'Next →',
                prevLabel: '← Back',
                doneLabel: 'Finish'
              })
              .oncomplete(() => {
                localStorage.setItem('hasSeenTour', 'true');
              })
              .onexit(() => {
                localStorage.setItem('hasSeenTour', 'true');
              })
              .start();
          }

    }
  });


  function getItemWidth() {
    const vw = window.innerWidth;
    if (vw >= 768) {
      // Large screen: 4 items per row → ~22% width accounting for gaps
      return '22%';
    } else if (vw >= 480) {
      // Medium screen: 2 items per row → ~46%
      return '46%';
    } else {
      // Small screen: 1 item per row → 90%
      return '90%';
    }
  }
  
  async function loadPopularVideos() {
    const cached = localStorage.getItem('popularVideos');
    const cacheTime = localStorage.getItem('popularVideosTimestamp');
    const now = Date.now();
  
    if (cached && cacheTime && now - cacheTime < 3600000) {
      renderPopularVideos(JSON.parse(cached));
      fetchAndCachePopularVideos();
    } else {
      await fetchAndCachePopularVideos();
    }
  }
  
  async function fetchAndCachePopularVideos() {
    try {
      const res = await fetch('https://renderbackend-xfh6.onrender.com/popular_videos');
      if (!res.ok) throw new Error('Failed to fetch popular videos');
      const data = await res.json();
      localStorage.setItem('popularVideos', JSON.stringify(data));
      localStorage.setItem('popularVideosTimestamp', Date.now());
      renderPopularVideos(data);
    } catch (err) {
      console.error('Failed to fetch popular videos:', err);
    }
  }
  
  function renderPopularVideos(videos) {
    const list = document.getElementById('popular-videos-list');
    list.innerHTML = '';
  
    videos.forEach(video => {
        const li = document.createElement('li');
        li.style.width = '180px';
        li.style.cursor = 'pointer';

        const prefix = window.location.href.includes("github") ? "Youtube-Summarizer/" : "";

        li.innerHTML = `
            <a href="/${prefix}summary/${video.video_id}" style="text-decoration:none; color:inherit;">
                <img src="https://img.youtube.com/vi/${video.video_id}/hqdefault.jpg" alt="${video.youtube_title}" style="width:100%; border-radius:8px;" />
                <p style="font-size: 14px; margin: 6px 0 0;">${video.youtube_title}</p>
            </a>
        `;



        list.appendChild(li);
    });
  }
  
  window.addEventListener('DOMContentLoaded', loadPopularVideos);
  


const form = document.getElementById('summarizerForm');
const summaryDiv = document.getElementById('summary');
const descriptionSection = document.getElementById('descriptionSection');
const keyPointsSection = document.getElementById('keyPointsSection');
const container = document.getElementById('container');
const button = form.querySelector('button');
let lastSubmittedUrl = null;
let data = null;
let error = null;


form.addEventListener('submit', async (e) => {
    e.preventDefault();

    button.disabled = true;

    const youtubeLink = document.getElementById('youtubeLink').value.trim();
    let bodyToSend;
    if (youtubeLink === lastSubmittedUrl) {
        // Modify what you send in this case — for example, add a flag or a param
        bodyToSend = JSON.stringify({ url: youtubeLink, refresh: true });
    } else {
        bodyToSend = JSON.stringify({ url: youtubeLink });
    }
    lastSubmittedUrl = youtubeLink;


    button.textContent = 'Getting Summary...';

    const errorMessage = summaryDiv.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }

    try {
        const response = await fetch('https://renderbackend-xfh6.onrender.com/summarize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: bodyToSend,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw errorData;
        }

        const data = await response.json();

        container.style.width = '100%';
        container.style.maxWidth = "800px";

        const header = document.querySelector('.container h1');
        if (header) {
            header.style.marginTop = '20px';
        }

        summaryDiv.classList.add('show');

        let formattedDescription = data.description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formattedDescription = formattedDescription.replace(/\n/g, '<br>');

        let formattedKeyPoints = data.key_points.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formattedKeyPoints = formattedKeyPoints.replace(/\n/g, '<br>');

        const videoId = data.video_id

        if (videoId) {
            const isGithubPages = window.location.hostname.includes('github.io');
            const basePath = isGithubPages ? '/Youtube-Summarizer' : '';
            //console.log("Base Path", basePath);
            
            const newUrl = `${basePath}/summary/${videoId}`;
            window.history.pushState({ path: newUrl }, '', newUrl);
        }
        
        
        const existingTitle = summaryDiv.querySelector('.video-title');
        if (existingTitle) {
            existingTitle.remove();
        }

        const titleElement = document.createElement('h2');
        titleElement.textContent = data.title;
        titleElement.classList.add('video-title');
        summaryDiv.insertBefore(titleElement, summaryDiv.firstChild);

        let descriptionHTML = `<p>${formattedDescription}</p>`;
        let faqHTML = '';

        // --- FAQ Section with Dropdown (Goes Above Iframe Inside Description) ---
        if (data.faqs && typeof data.faqs === 'object' && Object.keys(data.faqs).length > 0) {
            faqHTML += '<div class="faq-container" style="padding-top: 20px;">';
            faqHTML += '<h2 style="padding-bottom:10px;">Related Questions</h2>';
            for (const key in data.faqs) {
                if (data.faqs.hasOwnProperty(key)) {
                    const value = data.faqs[key];

                    faqHTML += `
                        <div class="faq-item" style="cursor: pointer; padding: 10px; border: 1px solid #ccc; border-radius: 6px; margin-bottom: 10px; transition: box-shadow 0.2s;">
                            <div class="faq-question faq-question-element" style="display: flex; justify-content: space-between; align-items: center;">
                            <strong>${key}</strong> <span class="dropdown-arrow">▼</span>
                            </div>
                            <div class="faq-answer" style="display: none; margin-top: 5px;">
                            <p>${value}</p>
                            </div>
                        </div>
                    `;

                }
            }
            faqHTML += '</div>';
        }

        if (videoId) {
            const videoEmbedUrl = `https://www.youtube.com/embed/${videoId}`;
            descriptionHTML += `
                ${faqHTML}
                <iframe width="100%" height="315" src="${videoEmbedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            `;
        } else {
            descriptionHTML += faqHTML;
        }

        descriptionSection.innerHTML = descriptionHTML;

        const faqQuestions = descriptionSection.querySelectorAll('.faq-question-element');
        faqQuestions.forEach(question => {
            question.addEventListener('click', toggleAnswer);
        });

        keyPointsSection.innerHTML = `
            <h2>Key Points</h2>
            <p>${formattedKeyPoints}</p>
        `;
        button.textContent = 'Summarize Another Video';

        if (data.needs_logging) {
            fetch('https://renderbackend-xfh6.onrender.com/log_summary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: data.title,
                    url: youtubeLink,
                    video_id: data.video_id,
                    description: data.description,
                    key_points: data.key_points,
                    faqs: data.faqs,
                }),
            }).catch(err => {
                console.warn('Logging failed:', err);
            });
        }

    } catch (error) {

        const titleElement = summaryDiv.querySelector('.video-title');
        if (titleElement) {
            titleElement.textContent = '';
        }

        const descriptionElement = document.getElementById('descriptionSection');
        if (descriptionElement) {
            descriptionElement.innerHTML = '';
        }

        const keyPointsElement = document.getElementById('keyPointsSection');
        if (keyPointsElement) {
            keyPointsElement.innerHTML = '';
        }
        
        const faqElement = document.getElementById('faqSection');
        if (faqElement) {
            faqElement.innerHTML = '';  // Clear faq content
        }

        // Add error message to the page
        const errorMessageElement = document.createElement('div');
        errorMessageElement.classList.add('error-message');
        errorMessageElement.innerText = error.message || 'An error occurred';

        // Insert the error message into summaryDiv
        summaryDiv.style.display = 'block';
        summaryDiv.appendChild(errorMessageElement);


        button.textContent = 'Retry';

    } finally {
        console.log("Reached finally block")
        button.disabled = false;

        const userUrl = youtubeLink || null;
        const videoTitle = data?.title || 'Unknown';
        const statusCode = error ? '500' : '200';

        // Always log attempt
        if (userUrl) {
            fetch('https://renderbackend-xfh6.onrender.com/log_status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    video_title: videoTitle,
                    video_url: userUrl,
                    status_code: statusCode,
                }),
            }).catch(err => {
                console.warn('Log video call failed:', err);
            });
        }
    }
});



window.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    //console.log('Current path:', path);
  
    const match = path.match(/\/summary\/([\w-]+)(?:\/)?$/);
  
    if (match) {
      const videoId = match[1];
      const input = document.getElementById('youtubeLink');
      if (input) input.value = `https://www.youtube.com/watch?v=${videoId}`;
  
      const form = document.querySelector('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    }
  });