const toggle = document.getElementById("toggle");
const statusLabel = document.getElementById("statusLabel");
const blockedCountEl = document.getElementById("blockedCount");

function render(enabled, blockedCount) {
  toggle.checked = enabled !== false;
  statusLabel.textContent = enabled !== false ? "Blocking is on" : "Blocking is off";
  blockedCountEl.textContent = blockedCount || 0;
}

chrome.storage.local.get(["enabled", "blockedCount"], (data) => {
  render(data.enabled, data.blockedCount);
});

toggle.addEventListener("change", () => {
  const enabled = toggle.checked;
  chrome.storage.local.set({ enabled });
  statusLabel.textContent = enabled ? "Blocking is on" : "Blocking is off";
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.blockedCount) {
    blockedCountEl.textContent = changes.blockedCount.newValue || 0;
  }
});
