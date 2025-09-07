document.addEventListener('DOMContentLoaded', () => {
    // These variables are provided by the canvas environment.
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
    const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : '';

    // Custom modal functions to replace native alerts
    const modal = document.getElementById('custom-modal');
    const modalMessage = document.getElementById('modal-message');
    const closeModalBtn = document.querySelector('.modal .close-btn');

    function showModal(message) {
        modalMessage.innerHTML = message;
        modal.style.display = 'block';
    }

    closeModalBtn.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
    
    const articles = document.querySelectorAll('article');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
    const sidebarCloseBtn = document.getElementById('sidebar-close');

    // Mobile menu toggle functionality
    mobileMenuToggle.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        mobileMenuToggle.querySelector('i').className = mobileNav.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
    });
    
    // Close mobile nav when a link is clicked
    document.querySelectorAll('.mobile-nav a').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            mobileMenuToggle.querySelector('i').className = 'fas fa-bars';
        });
    });

    // Sidebar toggle functionality for mobile
    sidebarToggleBtn.addEventListener('click', () => {
        sidebar.classList.add('open');
    });

    sidebarCloseBtn.addEventListener('click', () => {
        sidebar.classList.remove('open');
    });
    
    // Close sidebar on category link click
    document.querySelectorAll('.sidebar a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        });
    });

    // 1. Navigation smooth scrolling and category reset
    document.querySelectorAll('nav a, .mobile-nav a').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            // Reset category filter to show all posts
            articles.forEach(article => article.style.display = 'block');
            
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
        const commentsList = document.getElementById(`comments-post${postId.substring(4)}`);
        
        const storedComments = JSON.parse(localStorage.getItem(`comments-post${postId.substring(4)}`)) || [];
        storedComments.forEach(comment => {
            const newComment = document.createElement('li');
            newComment.innerHTML = `<strong>${comment.name}</strong>: ${comment.message}`;
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
                newComment.innerHTML = `<strong>${name}</strong>: ${message}`;
                newComment.style.opacity = '0';
                commentsList.appendChild(newComment);
                
                setTimeout(() => {
                    newComment.style.transition = 'opacity 0.5s ease';
                    newComment.style.opacity = '1';
                }, 10);
                
                const updatedComments = [...storedComments, { name, message }];
                localStorage.setItem(`comments-post${postId.substring(4)}`, JSON.stringify(updatedComments));
                
                nameInput.value = '';
                messageInput.value = '';
            } else {
                showModal('Please enter your name and message.');
            }
        });
    });

    // 4. "Read More" functionality with smooth transition
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
    const progressBar = document.getElementById('reading-progress');
    window.onscroll = function() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            backToTopBtn.style.display = "flex";
        } else {
            backToTopBtn.style.display = "none";
        }
        
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPosition = window.scrollY;
        const progress = (scrollPosition / totalHeight) * 100;
        progressBar.style.width = `${progress}%`;
    };
    backToTopBtn.addEventListener("click", () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    });

    // 7. Like button functionality with localStorage
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(button => {
        const postId = button.getAttribute('data-post-id');
        const likesSpan = document.querySelector(`.likes[data-post-id="${postId}"]`);
        
        let likes = parseInt(localStorage.getItem(`likes-${postId}`)) || 0;
        likesSpan.textContent = `Likes: ${likes}`;
        
        button.addEventListener('click', () => {
            likes++;
            likesSpan.textContent = `Likes: ${likes}`;
            localStorage.setItem(`likes-${postId}`, likes);
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
            button.href = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
        } else if (button.classList.contains('share-facebook')) {
            button.href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        } else if (button.classList.contains('share-linkedin')) {
            button.href = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`;
        }
        button.target = '_blank';
    });

    // 9. Newsletter signup (simulated)
    const newsletterForm = document.getElementById('newsletter-form');
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('newsletter-email').value;
        if (email) {
            showModal(`<b>Thank you for subscribing!</b><br>You will receive our latest blog updates at: <b>${email}</b>.`);
            newsletterForm.reset();
        } else {
            showModal('Please enter a valid email address.');
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
            
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        });
    });

    // 11. Related posts
    const relatedSections = document.querySelectorAll('.related-posts ul');
    articles.forEach((article, index) => {
        const category = article.getAttribute('data-category');
        const relatedList = relatedSections[index];
        const related = Array.from(articles).filter((a, i) => i !== index && a.getAttribute('data-category') === category).slice(0, 3);
        related.forEach(rel => {
            const title = rel.querySelector('h2').textContent;
            const li = document.createElement('li');
            li.innerHTML = `<a href="#${rel.id}">${title}</a>`;
            relatedList.appendChild(li);
        });
    });
    
    // 12. 3D Background with Three.js
    let scene, camera, renderer, particles = [];
    const particleCount = 100;
    const canvas = document.getElementById('three-js-canvas');
    let mouseX = 0, mouseY = 0;

    function initThreeJS() {
        if (!canvas) {
            console.error('Canvas element with id "three-js-canvas" not found.');
            return;
        }
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);

        const particleGeometry = new THREE.IcosahedronGeometry(0.1, 0);
        const particleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });

        for (let i = 0; i < particleCount; i++) {
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            particle.position.x = (Math.random() - 0.5) * 20;
            particle.position.y = (Math.random() - 0.5) * 20;
            particle.position.z = (Math.random() - 0.5) * 20;
            
            particle.userData.rotationSpeed = new THREE.Vector3(
                (Math.random() - 0.5) * 0.005,
                (Math.random() - 0.5) * 0.005,
                (Math.random() - 0.5) * 0.005
            );
            
            particles.push(particle);
            scene.add(particle);
        }
    }

    function animate() {
        requestAnimationFrame(animate);

        particles.forEach(p => {
            p.rotation.x += p.userData.rotationSpeed.x;
            p.rotation.y += p.userData.rotationSpeed.y;
            p.rotation.z += p.userData.rotationSpeed.z;
        });

        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
    
    window.onload = function() {
        initThreeJS();
        animate();
    }

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    window.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

});
