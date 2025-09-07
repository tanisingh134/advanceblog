document.addEventListener('DOMContentLoaded', () => {
    const articles = document.querySelectorAll('article');

    // Mobile menu toggle functionality
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const sidebar = document.querySelector('.sidebar');

    mobileMenuToggle.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        const icon = mobileMenuToggle.querySelector('i');
        if (mobileNav.classList.contains('active')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.mobile-nav a').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            const icon = mobileMenuToggle.querySelector('i');
            icon.className = 'fas fa-bars';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            mobileNav.classList.remove('active');
            const icon = mobileMenuToggle.querySelector('i');
            icon.className = 'fas fa-bars';
        }
    });

    // Sidebar toggle for mobile
    const sidebarToggle = document.createElement('button');
    sidebarToggle.innerHTML = '<i class="fas fa-filter"></i>';
    sidebarToggle.className = 'sidebar-toggle';
    sidebarToggle.style.cssText = `
        position: fixed;
        top: 50%;
        left: 10px;
        z-index: 150;
        background: linear-gradient(to right, #6a11cb, #2575fc);
        color: white;
        border: none;
        padding: 10px;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(sidebarToggle);

    // Sidebar close button
    const sidebarClose = document.getElementById('sidebar-close');

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.add('open');
    });

    sidebarClose.addEventListener('click', () => {
        // Only close sidebar on mobile devices
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('open');
        }
    });

    // Close sidebar when clicking on category links (mobile only)
    document.querySelectorAll('.sidebar a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        });
    });

    // Close sidebar when clicking outside (mobile only)
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            !sidebar.contains(e.target) && 
            !sidebarToggle.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });

    // Show sidebar toggle on mobile only
    const checkScreenSize = () => {
        if (window.innerWidth <= 768) {
            sidebarToggle.style.display = 'block';
            // On mobile, sidebar starts closed
            sidebar.classList.remove('open');
        } else {
            sidebarToggle.style.display = 'none';
            // On desktop/laptop, sidebar is always visible and not in 'open' state
            sidebar.classList.remove('open');
        }
    };

    window.addEventListener('resize', checkScreenSize);
    checkScreenSize();

    // 1. Navigation smooth scrolling with category reset
    document.querySelectorAll('nav a, .mobile-nav a').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            // Reset category filter to show all posts
            articles.forEach(article => {
                article.style.display = 'block';
            });
            const targetId = anchor.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 2. Persist and load dark mode
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = 'Light Mode';
    }
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            darkModeToggle.textContent = 'Light Mode';
            localStorage.setItem('darkMode', 'enabled');
        } else {
            darkModeToggle.textContent = 'Dark Mode';
            localStorage.setItem('darkMode', 'disabled');
        }
    });

    // 3. Comment Section with animation
    const commentForms = document.querySelectorAll('.comment-form');
    commentForms.forEach(form => {
        const postId = form.getAttribute('data-post-id');
        const commentsList = document.getElementById(comments-${postId});
        
        // Load comments from localStorage
        const storedComments = JSON.parse(localStorage.getItem(comments-${postId})) || [];
        storedComments.forEach(comment => {
            const newComment = document.createElement('li');
            newComment.innerHTML = <strong>${comment.name}</strong>: ${comment.message};
            commentsList.appendChild(newComment);
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = form.querySelector('input');
            const messageInput = form.querySelector('textarea');
            const name = nameInput.value;
            const message = messageInput.value;
            if (name && message) {
                const newComment = document.createElement('li');
                newComment.innerHTML = <strong>${name}</strong>: ${message};
                newComment.style.opacity = '0';
                commentsList.appendChild(newComment);
                
                // Animation for new comment
                setTimeout(() => {
                    newComment.style.transition = 'opacity 0.5s ease';
                    newComment.style.opacity = '1';
                }, 10);
                
                // Save to localStorage
                const updatedComments = [...storedComments, { name, message }];
                localStorage.setItem(comments-${postId}, JSON.stringify(updatedComments));
                
                nameInput.value = '';
                messageInput.value = '';
            } else {
                alert('Please enter your name and message.');
            }
        });
    });

    // 4. "Read More" functionality
    document.querySelectorAll('.read-more-btn').forEach(button => {
        button.addEventListener('click', () => {
            const postContent = button.closest('.post-content');
            const fullContent = postContent.querySelector('.full-content');
            if (fullContent.classList.contains('open')) {
                fullContent.classList.remove('open');
                button.textContent = 'Read More';
            } else {
                fullContent.classList.add('open');
                button.textContent = 'Read Less';
            }
        });
    });

    // 5. Search Bar functionality
    const searchBar = document.getElementById('search-bar');
    searchBar.addEventListener('keyup', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        articles.forEach(article => {
            const title = article.querySelector('h2').textContent.toLowerCase();
            const content = article.querySelector('.post-content').textContent.toLowerCase();
            if (title.includes(searchTerm) || content.includes(searchTerm)) {
                article.style.display = 'block';
            } else {
                article.style.display = 'none';
            }
        });
    });

    // 6. "Back to Top" button and reading progress
    const backToTopBtn = document.getElementById("back-to-top");
    window.onscroll = function() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            backToTopBtn.style.display = "block";
        } else {
            backToTopBtn.style.display = "none";
        }
        // Update reading progress bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.getElementById('reading-progress').style.width = scrolled + '%';
    };
    backToTopBtn.addEventListener("click", () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    });

    // 7. Like button functionality
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(button => {
        const postId = button.getAttribute('data-post-id');
        const likesSpan = document.querySelector(.likes[data-post-id="${postId}"]);
        
        let likes = parseInt(localStorage.getItem(likes-${postId})) || 0;
        likesSpan.textContent = Likes: ${likes};
        
        button.addEventListener('click', () => {
            likes++;
            likesSpan.textContent = Likes: ${likes};
            localStorage.setItem(likes-${postId}, likes);
            button.classList.add('liked');
            setTimeout(() => button.classList.remove('liked'), 300);
        });
    });

    // 8. Social sharing
    const shareButtons = document.querySelectorAll('.social-share a');
    shareButtons.forEach(button => {
        const title = encodeURIComponent(button.getAttribute('data-title'));
        const url = encodeURIComponent(window.location.href + '#' + button.closest('article').id);
        
        if (button.classList.contains('share-twitter')) {
            button.href = https://twitter.com/intent/tweet?text=${title}&url=${url};
        } else if (button.classList.contains('share-facebook')) {
            button.href = https://www.facebook.com/sharer/sharer.php?u=${url};
        } else if (button.classList.contains('share-linkedin')) {
            button.href = https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title};
        }
        button.target = '_blank';
    });

    // 9. Newsletter signup
    const newsletterForm = document.getElementById('newsletter-form');
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('newsletter-email').value;
        if (email) {
            alert(Thank you for subscribing with ${email}!);
            newsletterForm.reset();
        } else {
            alert('Please enter a valid email.');
        }
    });

    // 10. Category filtering
    const categoryLinks = document.querySelectorAll('.categories a');
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.getAttribute('data-category');
            articles.forEach(article => {
                if (category === 'all' || article.getAttribute('data-category') === category) {
                    article.style.display = 'block';
                } else {
                    article.style.display = 'none';
                }
            });
        });
    });

    // 11. Moving crystals background
    const container = document.getElementById('crystals-background');
    const crystalCount = 10;
    for (let i = 0; i < crystalCount; i++) {
        const crystal = document.createElement('div');
        crystal.className = 'crystal';
        crystal.style.left = ${Math.random() * 100}vw;
        crystal.style.top = ${Math.random() * 100}vh;
        crystal.style.animationDelay = ${Math.random() * 5}s;
        container.appendChild(crystal);
    }
});
