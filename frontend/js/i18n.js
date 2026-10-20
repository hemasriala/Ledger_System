// This object will hold all our translated strings
window.translations = {};

// Function to fetch the language JSON
async function loadLanguage(lang) {
  try {
    const response = await fetch(`lang/${lang}.json`);
    if (!response.ok) {
      throw new Error(`Could not load language file: ${lang}.json`);
    }
    window.translations = await response.json();
    applyTranslations();
  } catch (error) {
    console.error(error);
    // Fallback to English if the chosen language fails to load
    if (lang !== 'en') {
      loadLanguage('en');
    }
  }
}

// Function to apply translations to the page
function applyTranslations() {
  // Find all elements that need translation
  document.querySelectorAll('[data-i18n-key]').forEach(element => {
    const key = element.getAttribute('data-i18n-key');
    const translation = window.translations[key];
    
    if (translation) {
      // Handle different elements
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.placeholder = translation;
      } else {
        element.textContent = translation;
      }
    } else {
      console.warn(`Missing translation for key: ${key}`);
    }
  });
}

// Function to set the language
function setLanguage(lang) {
  localStorage.setItem('preferredLang', lang); // Save preference
  loadLanguage(lang);
}

// Main logic runs on page load
document.addEventListener('DOMContentLoaded', () => {
  const langSelector = document.getElementById('lang-selector');
  
  // Set up the language selector dropdown
  if (langSelector) {
    // Get saved language or default to 'en'
    const savedLang = localStorage.getItem('preferredLang') || 'en';
    langSelector.value = savedLang;
    loadLanguage(savedLang);

    // Add event listener to change language
    langSelector.addEventListener('change', (e) => {
      setLanguage(e.target.value);
    });
  } else {
    // If no selector, just load the default
    const savedLang = localStorage.getItem('preferredLang') || 'en';
    loadLanguage(savedLang);
  }
});