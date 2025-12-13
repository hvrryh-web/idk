/**
 * WuXuxian TTRPG - Main JavaScript
 * Interactive features for the landing page
 */

(function() {
    'use strict';

    // ============================================
    // Theme Toggle (Dark Mode)
    // ============================================
    const THEME_KEY = 'wuxuxian-theme';
    
    function initTheme() {
        const savedTheme = localStorage.getItem(THEME_KEY);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            updateThemeIcon(savedTheme);
        } else if (prefersDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
            updateThemeIcon('dark');
        }
    }
    
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem(THEME_KEY, newTheme);
        updateThemeIcon(newTheme);
        
        // Announce change to screen readers
        announceToScreenReader(newTheme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled');
    }
    
    function updateThemeIcon(theme) {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('.theme-icon');
            if (icon) {
                icon.textContent = theme === 'dark' ? '☀️' : '🌙';
            }
            themeToggle.setAttribute('aria-label', 
                theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
            );
        }
    }

    // ============================================
    // Features Section Toggle
    // ============================================
    function initFeaturesToggle() {
        const toggleBtn = document.getElementById('toggle-features');
        const featuresList = document.getElementById('features-list');
        
        if (!toggleBtn || !featuresList) return;
        
        toggleBtn.addEventListener('click', function() {
            const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
            
            toggleBtn.setAttribute('aria-expanded', !isExpanded);
            featuresList.classList.toggle('collapsed', isExpanded);
            
            // Update icon
            const icon = toggleBtn.querySelector('.toggle-icon');
            if (icon) {
                icon.textContent = isExpanded ? '▶' : '▼';
            }
            
            // Announce change
            announceToScreenReader(isExpanded ? 'Features collapsed' : 'Features expanded');
        });
    }

    // ============================================
    // Footer Year
    // ============================================
    function updateFooterYear() {
        const yearSpan = document.getElementById('current-year');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    }

    // ============================================
    // Smooth Scroll for Anchor Links
    // ============================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    
                    // Account for sticky header
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Set focus for accessibility
                    targetElement.setAttribute('tabindex', '-1');
                    targetElement.focus({ preventScroll: true });
                }
            });
        });
    }

    // ============================================
    // Accessibility: Live Region Announcements
    // ============================================
    let announcer = null;
    
    function createAnnouncer() {
        announcer = document.createElement('div');
        announcer.setAttribute('role', 'status');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        document.body.appendChild(announcer);
    }
    
    function announceToScreenReader(message) {
        if (!announcer) {
            createAnnouncer();
        }
        
        // Clear and set message (helps with repeated announcements)
        announcer.textContent = '';
        setTimeout(function() {
            announcer.textContent = message;
        }, 100);
    }

    // ============================================
    // Keyboard Navigation Enhancement
    // ============================================
    function initKeyboardNav() {
        // Add keyboard shortcut hints
        document.addEventListener('keydown', function(e) {
            // Escape key closes any open toggles
            if (e.key === 'Escape') {
                const toggleBtn = document.getElementById('toggle-features');
                if (toggleBtn && toggleBtn.getAttribute('aria-expanded') === 'false') {
                    return; // Already collapsed
                }
                if (toggleBtn) {
                    toggleBtn.click();
                }
            }
            
            // 'T' key toggles theme (when not in an input field)
            if (e.key === 't' || e.key === 'T') {
                if (document.activeElement.tagName !== 'INPUT' && 
                    document.activeElement.tagName !== 'TEXTAREA') {
                    toggleTheme();
                }
            }
        });
    }

    // ============================================
    // Performance: Intersection Observer for Animations
    // ============================================
    function initScrollAnimations() {
        if (!('IntersectionObserver' in window)) return;
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe feature items
        document.querySelectorAll('.feature-item').forEach(function(item) {
            observer.observe(item);
        });
    }

    // ============================================
    // Form Validation Example (for future forms)
    // ============================================
    function initFormValidation() {
        // This is a placeholder for future form functionality
        // Currently no forms on the page, but structure is here
        const forms = document.querySelectorAll('form[data-validate]');
        
        forms.forEach(function(form) {
            form.addEventListener('submit', function(e) {
                let isValid = true;
                const requiredFields = form.querySelectorAll('[required]');
                
                requiredFields.forEach(function(field) {
                    if (!field.value.trim()) {
                        isValid = false;
                        field.classList.add('error');
                        field.setAttribute('aria-invalid', 'true');
                    } else {
                        field.classList.remove('error');
                        field.setAttribute('aria-invalid', 'false');
                    }
                });
                
                if (!isValid) {
                    e.preventDefault();
                    announceToScreenReader('Please fill in all required fields');
                }
            });
        });
    }

    // ============================================
    // Initialize All Features
    // ============================================
    function init() {
        // Initialize theme first (before page renders fully)
        initTheme();
        
        // DOM-dependent initializations
        document.addEventListener('DOMContentLoaded', function() {
            updateFooterYear();
            initFeaturesToggle();
            initSmoothScroll();
            initKeyboardNav();
            initScrollAnimations();
            initFormValidation();
            
            // Theme toggle button
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) {
                themeToggle.addEventListener('click', toggleTheme);
            }
            
            console.log('🎮 WuXuxian TTRPG - Landing page initialized');
            console.log('💡 Tip: Press "T" to toggle dark mode');
        });
    }

    // Start initialization
    init();
})();
