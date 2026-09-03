const RULESET_ID = "ruleset_1";

// Initialize state on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ enabled: true, blockedCount: 0 });
});

// Toggle the ruleset on/off based on stored preference
async function applyEnabledState() {
  const { enabled } = await chrome.storage.local.get("enabled");
  if (enabled === false) {
    await chrome.declarativeNetRequest.updateEnabledRulesets({
      disableRulesetIds: [RULESET_ID],
    });
  } else {
    await chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: [RULESET_ID],
    });
  }
}

applyEnabledState();

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.enabled) {
    applyEnabledState();
  }
});

// Count blocked requests (per-session) and show on the badge
if (chrome.declarativeNetRequest.onRuleMatchedDebug) {
  chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(async () => {
    const { blockedCount = 0 } = await chrome.storage.local.get("blockedCount");
    const newCount = blockedCount + 1;
    await chrome.storage.local.set({ blockedCount: newCount });
    chrome.action.setBadgeText({ text: newCount > 999 ? "999+" : String(newCount) });
    chrome.action.setBadgeBackgroundColor({ color: "#4285F4" });
  });
}
