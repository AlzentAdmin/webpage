// Navigation module
function navigateTo(target) {
    // Ensure CONFIG is available
    const CONFIG = window.CONFIG || {
        allViewIds: ['view-home', 'view-intelligence', 'view-service-trading', 'view-service-tokenization', 'view-service-treasury', 'view-service-otc', 'view-service-card']
    };
    
    console.log('navigateTo called with target:', target);
    console.log('CONFIG.allViewIds:', CONFIG.allViewIds);
    
    // Hide all views
    CONFIG.allViewIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.remove('active-view');
            el.style.setProperty('display', 'none', 'important');
        }
    });
    
    // Remove active state from all nav links
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active-nav'));
    
    // Handle intelligence view
    if (target === 'intelligence') {
        const intelligenceView = document.getElementById('view-intelligence');
        const intelligenceNav = document.getElementById('nav-intelligence');
        if (intelligenceView) {
            intelligenceView.classList.add('active-view');
        }
        if (intelligenceNav) {
            intelligenceNav.classList.add('active-nav');
        }
        window.scrollTo(0, 0);
    } 
    // Handle service views
    else if (target.startsWith('service-')) {
        const viewId = `view-${target}`;
        console.log('Navigating to service view:', viewId);
        console.log('Available view IDs:', CONFIG.allViewIds);
        
        if (CONFIG.allViewIds.includes(viewId)) {
            const viewEl = document.getElementById(viewId);
            console.log('View element found:', viewEl);
            
            if (viewEl) {
                // Add active-view and force display with !important override
                viewEl.classList.add('active-view');
                // Use setProperty with important flag to override CSS !important
                viewEl.style.setProperty('display', 'flex', 'important');
                viewEl.style.setProperty('flex-direction', 'column', 'important');
                viewEl.style.setProperty('opacity', '1', 'important');
                
                // Initialize forms in the view after it's displayed
                setTimeout(() => {
                    if (typeof initAllForms === 'function') {
                        initAllForms();
                    }
                }, 100);
                
                console.log('Active view class added. Classes:', viewEl.className);
                console.log('View inline styles:', {
                    display: viewEl.style.display,
                    opacity: viewEl.style.opacity
                });
                console.log('View computed style display:', window.getComputedStyle(viewEl).display);
            } else {
                console.error('View element not found in DOM:', viewId);
                // Fallback: show home view
                const homeView = document.getElementById('view-home');
                if (homeView) {
                    homeView.classList.add('active-view');
                    homeView.style.setProperty('display', 'flex', 'important');
                }
            }
        } else {
            console.error('View ID not found in allViewIds:', viewId);
            // Fallback: show home view
            const homeView = document.getElementById('view-home');
            if (homeView) {
                homeView.classList.add('active-view');
                homeView.style.setProperty('display', 'flex', 'important');
            }
        }
        window.scrollTo(0, 0);
    } 
    // Handle wealth section (scroll within home view)
    else if (target === 'wealth') {
        const homeView = document.getElementById('view-home');
        if (homeView) {
            homeView.classList.add('active-view');
        }
        setTimeout(() => {
            const wealthSection = document.getElementById('wealth');
            if (wealthSection) {
                wealthSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 50);
    } 
    // Handle card section (scroll within home view)
    else if (target === 'card') {
        const homeView = document.getElementById('view-home');
        if (homeView) {
            homeView.classList.add('active-view');
        }
        setTimeout(() => {
            const cardSection = document.getElementById('card');
            if (cardSection) {
                cardSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 50);
    } 
    // Handle home or other sections
    else {
        const homeView = document.getElementById('view-home');
        if (homeView) {
            homeView.classList.add('active-view');
        }
        if (target !== 'home') {
            const section = document.getElementById(target);
            if (section) {
                setTimeout(() => {
                    section.scrollIntoView({ behavior: 'smooth' });
                }, 50);
            }
        } else {
            window.scrollTo(0, 0);
        }
    }
    
    // Close mobile menu if open
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.add('hidden');
    }
}

// Make function globally available
window.navigateTo = navigateTo;

