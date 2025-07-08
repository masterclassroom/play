// -------------------- EFOOTBALL STYLE LOADER --------------------
const loader = document.createElement("div");
loader.style.cssText = `
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.88);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  display: none;
  font-family: sans-serif;
`;

const spinner = document.createElement("div");
spinner.style.cssText = `
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top: 4px solid #00d8ff;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
`;

const text = document.createElement("div");
text.innerText = "Loading...";
text.style.cssText = `
  margin-top: 15px;
  color: white;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 1px;
`;

const style = document.createElement("style");
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

loader.appendChild(spinner);
loader.appendChild(text);
document.body.appendChild(loader);

let loaderTimeout = null;

function showLoader(max = 8000, customText = "Loading...") {
  text.innerText = customText;
  loader.style.display = "flex";
  clearTimeout(loaderTimeout);
  loaderTimeout = setTimeout(() => {
    hideLoader();
    console.warn("Loader auto-hidden after timeout");
  }, max);
}

function hideLoader() {
  loader.style.display = "none";
  clearTimeout(loaderTimeout);
}

// -------------------- AUTO-DETECT FIREBASE + FETCH + AXIOS --------------------

// Show loader on page load
window.addEventListener("load", () => {
  showLoader(1500);
  setTimeout(hideLoader, 1000);
});

// Wrap Firebase functions: get, set, update, remove
["get", "ref", "set", "update", "remove"].forEach(fnName => {
  if (typeof window[fnName] === "function") {
    const original = window[fnName];
    window[fnName] = async function (...args) {
      try {
        showLoader();
        const result = await original(...args);
        return result;
      } finally {
        hideLoader();
      }
    };
  }
});

// onValue override: hide after first call
if (typeof onValue === "function") {
  const originalOnValue = onValue;
  window.onValue = function (ref, callback, errorCallback, options) {
    showLoader();
    const onceWrapper = snapshot => {
      hideLoader();
      callback(snapshot);
    };
    return originalOnValue(ref, onceWrapper, errorCallback, options);
  };
}

// fetch override
if (typeof fetch === "function") {
  const originalFetch = fetch;
  window.fetch = async function (...args) {
    try {
      showLoader();
      const res = await originalFetch(...args);
      return res;
    } finally {
      hideLoader();
    }
  };
}

// axios override
if (window.axios) {
  axios.interceptors.request.use(config => {
    showLoader();
    return config;
  }, error => {
    hideLoader();
    return Promise.reject(error);
  });

  axios.interceptors.response.use(response => {
    hideLoader();
    return response;
  }, error => {
    hideLoader();
    return Promise.reject(error);
  });
}