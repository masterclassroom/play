const loader = document.createElement("div");
loader.style.cssText = `
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: transparent;
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
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1px;
  text-align: center;
`;

const retryBtn = document.createElement("button");
retryBtn.innerText = "Retry";
retryBtn.style.cssText = `
  margin-top: 20px;
  padding: 10px 20px;
  background: #fff;
  border: none;
  color: #1877f2;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  display: none;
`;
retryBtn.onclick = () => {
  checkInternet();
};

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
loader.appendChild(retryBtn);
document.body.appendChild(loader);

let loaderTimeout = null;

function showLoader(max = 8000, customText = "Loading...") {
  text.innerText = customText;
  retryBtn.style.display = "none";
  spinner.style.display = "block";
  loader.style.background = "transparent";
  loader.style.display = "flex";
  clearTimeout(loaderTimeout);
  loaderTimeout = setTimeout(() => {
    if (!navigator.onLine) {
      showOfflineError();
    } else {
      hideLoader();
    }
  }, max);
}

function showOfflineError() {
  loader.style.display = "flex";
  loader.style.background = "transparent"; // Also transparent when offline
  text.innerText = "No Internet Connection";
  retryBtn.style.display = "inline-block";
  spinner.style.display = "block";
}

function hideLoader() {
  loader.style.display = "none";
  retryBtn.style.display = "none";
  spinner.style.display = "block";
  loader.style.background = "transparent";
  clearTimeout(loaderTimeout);
}

function checkInternet() {
  text.innerText = "Rechecking...";
  retryBtn.style.display = "none";
  spinner.style.display = "block";

  setTimeout(() => {
    if (navigator.onLine) {
      hideLoader();
    } else {
      showOfflineError();
    }
  }, 1000);
}

// ✅ Internet check every 3s
setInterval(() => {
  if (!navigator.onLine) {
    showOfflineError();
  }
}, 3000);

// ✅ Loader on page load
window.addEventListener("load", () => {
  if (!navigator.onLine) {
    showOfflineError();
  } else {
    showLoader(1500);
    setTimeout(hideLoader, 1000);
  }
});