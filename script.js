(() => {
  "use strict";

  // ------------------------------------------------------------
  // Mock Seed Data (in-memory only, no server or persistence)
  // ------------------------------------------------------------
  function createInitialGroups() {
    return [
      {
        id: "grp-design",
        name: "Product Design",
        subtitle: "12 members • UI critiques & patterns",
        unread: 0,
        messages: [
          {
            id: "m1",
            sender: "Maya Lin",
            isSelf: false,
            text: "Morning everyone! Just uploaded the updated spacing tokens for the mobile drawer.",
            time: "9:42 AM",
          },
          {
            id: "m2",
            sender: "Samir Patel",
            isSelf: false,
            text: "Looks super clean. The contrast on the active tab pill feels much easier to scan now.",
            time: "9:47 AM",
          },
          {
            id: "m3",
            sender: "Maya Lin",
            isSelf: false,
            text: "Awesome! Let me know if anyone spots edge cases on smaller 360px viewports.",
            time: "9:51 AM",
          },
        ],
      },
      {
        id: "grp-frontend",
        name: "Frontend Guild",
        subtitle: "19 members • Accessibility & performance",
        unread: 2,
        messages: [
          {
            id: "m4",
            sender: "Elena Cruz",
            isSelf: false,
            text: "Reminder: always return focus to the menu button when closing the navigation drawer.",
            time: "10:05 AM",
          },
          {
            id: "m5",
            sender: "Devon Brooks",
            isSelf: false,
            text: "Tested Escape key handling too—works smoothly across Safari and Chrome.",
            time: "10:12 AM",
          },
        ],
      },
      {
        id: "grp-hikers",
        name: "Weekend Hikers",
        subtitle: "8 members • Saturday trail plans",
        unread: 0,
        messages: [
          {
            id: "m6",
            sender: "Noah Kim",
            isSelf: false,
            text: "Are we still meeting at Cedar Ridge trailhead at 7:30 AM this Saturday?",
            time: "Yesterday",
          },
          {
            id: "m7",
            sender: "Priya Nair",
            isSelf: false,
            text: "Yes! Bringing extra water and trail snacks for the overlook stop.",
            time: "Yesterday",
          },
        ],
      },
      {
        id: "grp-books",
        name: "Book Club",
        subtitle: "14 members • Monthly reading picks",
        unread: 0,
        messages: [
          {
            id: "m8",
            sender: "Hannah Cole",
            isSelf: false,
            text: "Chapters 4–7 are on deck for Thursday's discussion. Favorite quote so far?",
            time: "Mon",
          },
        ],
      },
      {
        id: "grp-photo",
        name: "Photography Corner",
        subtitle: "6 members • New channel",
        unread: 0,
        messages: [],
      },
    ];
  }

  function createInitialInbox() {
    return [
      {
        id: "dm-maya",
        name: "Maya Lin",
        subtitle: "Direct message • Design Lead",
        unread: 1,
        messages: [
          {
            id: "dm1",
            sender: "Maya Lin",
            isSelf: false,
            text: "Hey! Could you take a quick look at the new empty-state copy when you have a minute?",
            time: "10:18 AM",
          },
        ],
      },
      {
        id: "dm-noah",
        name: "Noah Kim",
        subtitle: "Direct message • Trail Organizer",
        unread: 1,
        messages: [
          {
            id: "dm2",
            sender: "Noah Kim",
            isSelf: false,
            text: "Weather forecast looks clear for Saturday morning. Need a ride to the trailhead?",
            time: "9:10 AM",
          },
        ],
      },
      {
        id: "dm-elena",
        name: "Elena Cruz",
        subtitle: "Direct message • Accessibility",
        unread: 0,
        messages: [
          {
            id: "dm3",
            sender: "Elena Cruz",
            isSelf: false,
            text: "Thanks for reviewing the keyboard focus states earlier!",
            time: "Yesterday",
          },
        ],
      },
    ];
  }

  // ------------------------------------------------------------
  // Local In-Memory Application State
  // ------------------------------------------------------------
  const state = {
    user: {
      name: "Alex Morgan",
      email: "alex@example.com",
      status: "Online",
      bio: "Testing local chat workflows and responsive UI states.",
    },
    activeSection: "groups", // "groups" | "inbox" | "profile" | "settings"
    groups: createInitialGroups(),
    inbox: createInitialInbox(),
    selectedGroupId: "grp-design",
    selectedInboxId: "dm-maya",
    searchQuery: "",
    inboxFilter: "all", // "all" | "unread"
    mobileChatOpen: false,
    settings: {
      enterToSend: true,
      compactMode: false,
      showTimestamps: true,
    },
    loadingRafId: null,
  };

  // ------------------------------------------------------------
  // DOM References
  // ------------------------------------------------------------
  const authScreen = document.getElementById("auth-screen");
  const loadingScreen = document.getElementById("loading-screen");
  const appShell = document.getElementById("app-shell");

  const tabLogin = document.getElementById("tab-login");
  const tabSignup = document.getElementById("tab-signup");
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const authNotice = document.getElementById("auth-notice");
  const fillDemoBtn = document.getElementById("fill-demo-btn");
  const switchToSignupBtn = document.getElementById("switch-to-signup");
  const switchToLoginBtn = document.getElementById("switch-to-login");

  const progressRingFill = document.getElementById("progress-ring-fill");
  const loadingPercent = document.getElementById("loading-percent");
  const loadingStatus = document.getElementById("loading-status");

  const topbarSectionTitle = document.getElementById("topbar-section-title");
  const topbarProfileBtn = document.getElementById("topbar-profile-btn");
  const topbarAvatar = document.getElementById("topbar-avatar");
  const topbarUserName = document.getElementById("topbar-user-name");
  const topbarUserStatus = document.getElementById("topbar-user-status");

  const menuToggleBtn = document.getElementById("menu-toggle-btn");
  const drawerBackdrop = document.getElementById("drawer-backdrop");
  const sideDrawer = document.getElementById("side-drawer");
  const drawerCloseBtn = document.getElementById("drawer-close-btn");
  const drawerAvatar = document.getElementById("drawer-avatar");
  const drawerUserName = document.getElementById("drawer-user-name");
  const drawerUserEmail = document.getElementById("drawer-user-email");
  const drawerNavItems = document.querySelectorAll(".drawer-nav-item[data-nav]");
  const logoutBtn = document.getElementById("logout-btn");
  const badgeGroups = document.getElementById("badge-groups");
  const badgeInbox = document.getElementById("badge-inbox");

  const viewChat = document.getElementById("view-chat");
  const viewProfile = document.getElementById("view-profile");
  const viewSettings = document.getElementById("view-settings");

  const threadListHeading = document.getElementById("thread-list-heading");
  const threadCountLabel = document.getElementById("thread-count-label");
  const threadSearchInput = document.getElementById("thread-search-input");
  const inboxFilterBar = document.getElementById("inbox-filter-bar");
  const inboxFilterChips = document.querySelectorAll("[data-inbox-filter]");
  const threadList = document.getElementById("thread-list");
  const threadListEmpty = document.getElementById("thread-list-empty");
  const threadEmptyTitle = document.getElementById("thread-empty-title");
  const threadEmptyDesc = document.getElementById("thread-empty-desc");
  const resetThreadFilterBtn = document.getElementById("reset-thread-filter-btn");

  const mobileBackBtn = document.getElementById("mobile-back-btn");
  const chatAvatar = document.getElementById("chat-avatar");
  const chatTitle = document.getElementById("chat-title");
  const chatSubtitle = document.getElementById("chat-subtitle");
  const messageList = document.getElementById("message-list");
  const chatEmptyState = document.getElementById("chat-empty-state");
  const messageForm = document.getElementById("message-form");
  const messageInput = document.getElementById("message-input");

  const profileForm = document.getElementById("profile-form");
  const profileAvatarLg = document.getElementById("profile-avatar-lg");
  const profilePreviewName = document.getElementById("profile-preview-name");
  const profilePreviewEmail = document.getElementById("profile-preview-email");
  const profileNameInput = document.getElementById("profile-name-input");
  const profileNameError = document.getElementById("profile-name-error");
  const profileStatusSelect = document.getElementById("profile-status-select");
  const profileBioInput = document.getElementById("profile-bio-input");
  const profileSavedMsg = document.getElementById("profile-saved-msg");

  const settingEnterSend = document.getElementById("setting-enter-send");
  const settingCompactMode = document.getElementById("setting-compact-mode");
  const settingShowTimestamps = document.getElementById("setting-show-timestamps");
  const resetDemoDataBtn = document.getElementById("reset-demo-data-btn");
  const settingsFeedback = document.getElementById("settings-feedback");
  const backToGroupsBtns = document.querySelectorAll(".back-to-groups-btn");

  // ------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------
  function getInitial(name) {
    const cleaned = (name || "").trim();
    return cleaned ? cleaned.charAt(0).toUpperCase() : "?";
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function formatCurrentTime() {
    return new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function setFieldError(inputEl, errorEl, message) {
    errorEl.textContent = message;
    inputEl.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function clearAuthErrors() {
    const pairs = [
      ["login-email", "login-email-error"],
      ["login-password", "login-password-error"],
      ["signup-name", "signup-name-error"],
      ["signup-email", "signup-email-error"],
      ["signup-password", "signup-password-error"],
      ["signup-confirm", "signup-confirm-error"],
    ];
    pairs.forEach(([inputId, errId]) => {
      setFieldError(document.getElementById(inputId), document.getElementById(errId), "");
    });
  }

  function showAuthNotice(message) {
    if (!message) {
      authNotice.hidden = true;
      authNotice.textContent = "";
      return;
    }
    authNotice.textContent = message;
    authNotice.hidden = false;
  }

  // ------------------------------------------------------------
  // Authentication Screen Logic
  // ------------------------------------------------------------
  function switchAuthMode(mode) {
    clearAuthErrors();
    showAuthNotice("");

    const isLogin = mode === "login";
    tabLogin.classList.toggle("is-active", isLogin);
    tabLogin.setAttribute("aria-selected", String(isLogin));
    tabSignup.classList.toggle("is-active", !isLogin);
    tabSignup.setAttribute("aria-selected", String(!isLogin));

    loginForm.hidden = !isLogin;
    signupForm.hidden = isLogin;
  }

  tabLogin.addEventListener("click", () => switchAuthMode("login"));
  tabSignup.addEventListener("click", () => switchAuthMode("signup"));
  switchToSignupBtn.addEventListener("click", () => switchAuthMode("signup"));
  switchToLoginBtn.addEventListener("click", () => switchAuthMode("login"));

  fillDemoBtn.addEventListener("click", () => {
    document.getElementById("login-email").value = "alex@example.com";
    document.getElementById("login-password").value = "demo1234";
    clearAuthErrors();
  });

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("login-email");
    const emailError = document.getElementById("login-email-error");
    const passInput = document.getElementById("login-password");
    const passError = document.getElementById("login-password-error");

    const email = emailInput.value.trim();
    const password = passInput.value;
    let valid = true;

    if (!email) {
      setFieldError(emailInput, emailError, "Please enter your email address.");
      valid = false;
    } else if (!isValidEmail(email)) {
      setFieldError(emailInput, emailError, "Please enter a valid email format.");
      valid = false;
    } else {
      setFieldError(emailInput, emailError, "");
    }

    if (!password) {
      setFieldError(passInput, passError, "Please enter your password.");
      valid = false;
    } else if (password.length < 6) {
      setFieldError(passInput, passError, "Password must be at least 6 characters.");
      valid = false;
    } else {
      setFieldError(passInput, passError, "");
    }

    if (!valid) return;

    const derivedName =
      email === "alex@example.com"
        ? "Alex Morgan"
        : email
            .split("@")[0]
            .replace(/[._-]+/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());

    state.user.email = email;
    state.user.name = derivedName || "Demo User";
    startLoadingSequence();
  });

  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("signup-name");
    const nameError = document.getElementById("signup-name-error");
    const emailInput = document.getElementById("signup-email");
    const emailError = document.getElementById("signup-email-error");
    const passInput = document.getElementById("signup-password");
    const passError = document.getElementById("signup-password-error");
    const confirmInput = document.getElementById("signup-confirm");
    const confirmError = document.getElementById("signup-confirm-error");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passInput.value;
    const confirm = confirmInput.value;
    let valid = true;

    if (name.length < 2) {
      setFieldError(nameInput, nameError, "Please enter your name (at least 2 characters).");
      valid = false;
    } else {
      setFieldError(nameInput, nameError, "");
    }

    if (!email || !isValidEmail(email)) {
      setFieldError(emailInput, emailError, "Please enter a valid email address.");
      valid = false;
    } else {
      setFieldError(emailInput, emailError, "");
    }

    if (password.length < 6) {
      setFieldError(passInput, passError, "Password must be at least 6 characters.");
      valid = false;
    } else {
      setFieldError(passInput, passError, "");
    }

    if (confirm !== password || !confirm) {
      setFieldError(confirmInput, confirmError, "Passwords do not match.");
      valid = false;
    } else {
      setFieldError(confirmInput, confirmError, "");
    }

    if (!valid) return;

    state.user.name = name;
    state.user.email = email;
    startLoadingSequence();
  });

  // ------------------------------------------------------------
  // Simulated Loading Sequence (0% -> 100%)
  // ------------------------------------------------------------
  const RING_RADIUS = 52;
  const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

  function setProgressVisual(pct) {
    const clamped = Math.max(0, Math.min(100, pct));
    const offset = RING_CIRCUMFERENCE - (clamped / 100) * RING_CIRCUMFERENCE;
    progressRingFill.style.strokeDasharray = `${RING_CIRCUMFERENCE}`;
    progressRingFill.style.strokeDashoffset = `${offset}`;
    loadingPercent.textContent = `${Math.round(clamped)}%`;

    if (clamped < 25) {
      loadingStatus.textContent = "Initializing local demo session…";
    } else if (clamped < 55) {
      loadingStatus.textContent = "Preparing your groups and channels…";
    } else if (clamped < 85) {
      loadingStatus.textContent = "Loading sample conversations…";
    } else if (clamped < 100) {
      loadingStatus.textContent = "Polishing workspace layout…";
    } else {
      loadingStatus.textContent = "Ready!";
    }
  }

  function startLoadingSequence() {
    if (state.loadingRafId) {
      cancelAnimationFrame(state.loadingRafId);
    }

    authScreen.hidden = true;
    appShell.hidden = true;
    loadingScreen.hidden = false;
    setProgressVisual(0);

    // Vary simulated load duration between 2.2s and 3.4s with organic speed changes
    const totalDuration = 2200 + Math.random() * 1200;
    const pausePoint = 0.35 + Math.random() * 0.25;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const rawT = Math.min(1, elapsed / totalDuration);

      // Non-linear curve with a brief mid-load pause simulation
      let eased;
      if (rawT < pausePoint) {
        eased = (rawT / pausePoint) * 0.42;
      } else if (rawT < pausePoint + 0.14) {
        eased = 0.42 + ((rawT - pausePoint) / 0.14) * 0.06;
      } else {
        const rem = (rawT - (pausePoint + 0.14)) / (1 - (pausePoint + 0.14));
        eased = 0.48 + (1 - Math.pow(1 - rem, 2.2)) * 0.52;
      }

      setProgressVisual(eased * 100);

      if (rawT < 1) {
        state.loadingRafId = requestAnimationFrame(step);
      } else {
        setProgressVisual(100);
        setTimeout(() => {
          openMainApp();
        }, 220);
      }
    }

    state.loadingRafId = requestAnimationFrame(step);
  }

  function openMainApp() {
    loadingScreen.hidden = true;
    appShell.hidden = false;
    state.activeSection = "groups";
    state.mobileChatOpen = false;
    state.searchQuery = "";
    threadSearchInput.value = "";
    syncUserUI();
    applySettingsToShell();
    renderApp();
  }

  // ------------------------------------------------------------
  // Side Navigation Drawer
  // ------------------------------------------------------------
  function openDrawer() {
    drawerBackdrop.hidden = false;
    sideDrawer.hidden = false;
    menuToggleBtn.setAttribute("aria-expanded", "true");
    drawerCloseBtn.focus();
  }

  function closeDrawer(restoreFocus = true) {
    drawerBackdrop.hidden = true;
    sideDrawer.hidden = true;
    menuToggleBtn.setAttribute("aria-expanded", "false");
    if (restoreFocus) {
      menuToggleBtn.focus();
    }
  }

  menuToggleBtn.addEventListener("click", openDrawer);
  drawerCloseBtn.addEventListener("click", () => closeDrawer(true));
  drawerBackdrop.addEventListener("click", () => closeDrawer(true));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !sideDrawer.hidden) {
      closeDrawer(true);
    }
  });

  drawerNavItems.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-nav");
      navigateTo(target);
      closeDrawer(false);
    });
  });

  logoutBtn.addEventListener("click", () => {
    closeDrawer(false);
    appShell.hidden = true;
    loadingScreen.hidden = true;
    authScreen.hidden = false;
    loginForm.reset();
    signupForm.reset();
    switchAuthMode("login");
    showAuthNotice("You have been logged out of the local demo.");
  });

  topbarProfileBtn.addEventListener("click", () => {
    navigateTo("profile");
  });

  backToGroupsBtns.forEach((btn) => {
    btn.addEventListener("click", () => navigateTo("groups"));
  });

  function navigateTo(section) {
    state.activeSection = section;
    state.searchQuery = "";
    threadSearchInput.value = "";
    state.mobileChatOpen = false;
    profileSavedMsg.textContent = "";
    settingsFeedback.textContent = "";
    renderApp();
  }

  // ------------------------------------------------------------
  // Rendering Logic
  // ------------------------------------------------------------
  function syncUserUI() {
    const initial = getInitial(state.user.name);
    topbarAvatar.textContent = initial;
    topbarUserName.textContent = state.user.name;
    topbarUserStatus.textContent = state.user.status;

    drawerAvatar.textContent = initial;
    drawerUserName.textContent = state.user.name;
    drawerUserEmail.textContent = state.user.email;

    profileAvatarLg.textContent = initial;
    profilePreviewName.textContent = state.user.name;
    profilePreviewEmail.textContent = state.user.email;
    profileNameInput.value = state.user.name;
    profileStatusSelect.value = state.user.status;
    profileBioInput.value = state.user.bio;
  }

  function applySettingsToShell() {
    appShell.classList.toggle("compact-mode", state.settings.compactMode);
    appShell.classList.toggle("hide-timestamps", !state.settings.showTimestamps);
    settingEnterSend.checked = state.settings.enterToSend;
    settingCompactMode.checked = state.settings.compactMode;
    settingShowTimestamps.checked = state.settings.showTimestamps;
  }

  function getActiveCollection() {
    return state.activeSection === "inbox" ? state.inbox : state.groups;
  }

  function getSelectedThreadId() {
    return state.activeSection === "inbox" ? state.selectedInboxId : state.selectedGroupId;
  }

  function setSelectedThreadId(id) {
    if (state.activeSection === "inbox") {
      state.selectedInboxId = id;
    } else {
      state.selectedGroupId = id;
    }
  }

  function updateBadges() {
    badgeGroups.textContent = String(state.groups.length);
    const unreadInboxCount = state.inbox.reduce((sum, item) => sum + item.unread, 0);
    badgeInbox.textContent = String(unreadInboxCount);
    badgeInbox.hidden = unreadInboxCount === 0;
  }

  function renderApp() {
    const sectionLabels = {
      groups: "Groups",
      inbox: "Inbox",
      profile: "Profile",
      settings: "Settings",
    };

    topbarSectionTitle.textContent = sectionLabels[state.activeSection] || "Groups";

    drawerNavItems.forEach((item) => {
      item.classList.toggle("is-active", item.getAttribute("data-nav") === state.activeSection);
    });

    updateBadges();

    const isChatSection = state.activeSection === "groups" || state.activeSection === "inbox";
    viewChat.hidden = !isChatSection;
    viewProfile.hidden = state.activeSection !== "profile";
    viewSettings.hidden = state.activeSection !== "settings";

    if (isChatSection) {
      renderChatWorkspace();
    }
  }

  function renderChatWorkspace() {
    const isInbox = state.activeSection === "inbox";
    const items = getActiveCollection();

    threadListHeading.textContent = isInbox ? "Inbox" : "Groups";
    threadSearchInput.placeholder = isInbox ? "Search messages..." : "Search groups...";
    inboxFilterBar.hidden = !isInbox;
    viewChat.classList.toggle("is-chat-open", state.mobileChatOpen);

    // Filter items
    const query = state.searchQuery.trim().toLowerCase();
    const filtered = items.filter((thread) => {
      const matchesQuery =
        !query ||
        thread.name.toLowerCase().includes(query) ||
        thread.subtitle.toLowerCase().includes(query);
      const matchesUnread = !isInbox || state.inboxFilter === "all" || thread.unread > 0;
      return matchesQuery && matchesUnread;
    });

    threadCountLabel.textContent = isInbox
      ? `${filtered.length} thread${filtered.length === 1 ? "" : "s"}`
      : `${filtered.length} group${filtered.length === 1 ? "" : "s"}`;

    // Render list
    threadList.innerHTML = "";
    if (filtered.length === 0) {
      threadList.hidden = true;
      threadListEmpty.hidden = false;
      threadEmptyTitle.textContent = isInbox ? "No inbox conversations" : "No matching groups";
      threadEmptyDesc.textContent = query
        ? `Nothing matched "${state.searchQuery.trim()}".`
        : "You're all caught up with unread messages.";
    } else {
      threadList.hidden = false;
      threadListEmpty.hidden = true;

      const selectedId = getSelectedThreadId();

      filtered.forEach((thread) => {
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "thread-item" + (thread.id === selectedId ? " is-selected" : "");
        btn.setAttribute("role", "option");
        btn.setAttribute("aria-selected", String(thread.id === selectedId));

        const avatar = document.createElement("span");
        avatar.className = "avatar avatar-md";
        avatar.textContent = getInitial(thread.name);

        const body = document.createElement("div");
        body.className = "thread-item-body";

        const top = document.createElement("div");
        top.className = "thread-item-top";

        const nameSpan = document.createElement("span");
        nameSpan.className = "thread-item-name";
        nameSpan.textContent = thread.name;

        const lastMsg = thread.messages[thread.messages.length - 1];
        const timeSpan = document.createElement("span");
        timeSpan.className = "thread-item-time";
        timeSpan.textContent = lastMsg ? lastMsg.time : "";

        top.append(nameSpan, timeSpan);

        const bottom = document.createElement("div");
        bottom.className = "thread-item-bottom";

        const preview = document.createElement("span");
        preview.className = "thread-item-preview";
        preview.textContent = lastMsg
          ? `${lastMsg.isSelf ? "You: " : ""}${lastMsg.text}`
          : "No messages yet";

        bottom.appendChild(preview);

        if (thread.unread > 0) {
          const badge = document.createElement("span");
          badge.className = "unread-dot";
          badge.textContent = String(thread.unread);
          badge.setAttribute("aria-label", `${thread.unread} unread`);
          bottom.appendChild(badge);
        }

        body.append(top, bottom);
        btn.append(avatar, body);

        btn.addEventListener("click", () => {
          thread.unread = 0;
          setSelectedThreadId(thread.id);
          state.mobileChatOpen = true;
          updateBadges();
          renderChatWorkspace();
          if (window.innerWidth < 768) {
            messageInput.focus();
          }
        });

        li.appendChild(btn);
        threadList.appendChild(li);
      });
    }

    renderActiveConversation();
  }

  function renderActiveConversation() {
    const items = getActiveCollection();
    const selectedId = getSelectedThreadId();
    const active = items.find((item) => item.id === selectedId) || items[0];

    if (!active) return;

    chatAvatar.textContent = getInitial(active.name);
    chatTitle.textContent = active.name;
    chatSubtitle.textContent = active.subtitle;

    messageList.innerHTML = "";

    if (active.messages.length === 0) {
      messageList.hidden = true;
      chatEmptyState.hidden = false;
    } else {
      messageList.hidden = false;
      chatEmptyState.hidden = true;

      active.messages.forEach((msg) => {
        const row = document.createElement("div");
        row.className = "message-row" + (msg.isSelf ? " is-self" : "");

        const avatar = document.createElement("span");
        avatar.className = "avatar avatar-sm";
        avatar.textContent = getInitial(msg.isSelf ? state.user.name : msg.sender);

        const bubbleWrap = document.createElement("div");
        bubbleWrap.className = "message-bubble-wrap";

        const meta = document.createElement("div");
        meta.className = "message-meta";

        const senderSpan = document.createElement("span");
        senderSpan.className = "message-sender";
        senderSpan.textContent = msg.isSelf ? state.user.name : msg.sender;

        const timeSpan = document.createElement("span");
        timeSpan.className = "message-time";
        timeSpan.textContent = msg.time;

        meta.append(senderSpan, timeSpan);

        const bubble = document.createElement("div");
        bubble.className = "message-bubble";
        bubble.textContent = msg.text;

        bubbleWrap.append(meta, bubble);
        row.append(avatar, bubbleWrap);
        messageList.appendChild(row);
      });

      messageList.scrollTop = messageList.scrollHeight;
    }
  }

  // ------------------------------------------------------------
  // Search, Filters, Mobile Navigation & Sending Messages
  // ------------------------------------------------------------
  threadSearchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value;
    renderChatWorkspace();
  });

  inboxFilterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      state.inboxFilter = chip.getAttribute("data-inbox-filter");
      inboxFilterChips.forEach((c) => c.classList.toggle("is-active", c === chip));
      renderChatWorkspace();
    });
  });

  resetThreadFilterBtn.addEventListener("click", () => {
    state.searchQuery = "";
    state.inboxFilter = "all";
    threadSearchInput.value = "";
    inboxFilterChips.forEach((c) =>
      c.classList.toggle("is-active", c.getAttribute("data-inbox-filter") === "all")
    );
    renderChatWorkspace();
  });

  mobileBackBtn.addEventListener("click", () => {
    state.mobileChatOpen = false;
    renderChatWorkspace();
  });

  function sendCurrentMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    const items = getActiveCollection();
    const active = items.find((item) => item.id === getSelectedThreadId());
    if (!active) return;

    active.messages.push({
      id: `msg-${Date.now()}`,
      sender: state.user.name,
      isSelf: true,
      text,
      time: formatCurrentTime(),
    });

    messageInput.value = "";
    messageInput.style.height = "auto";
    renderChatWorkspace();
    messageInput.focus();
  }

  messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sendCurrentMessage();
  });

  messageInput.addEventListener("keydown", (e) => {
    if (state.settings.enterToSend && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendCurrentMessage();
    }
  });

  messageInput.addEventListener("input", () => {
    messageInput.style.height = "auto";
    messageInput.style.height = `${Math.min(messageInput.scrollHeight, 120)}px`;
  });

  // ------------------------------------------------------------
  // Profile & Settings Handlers
  // ------------------------------------------------------------
  profileForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nextName = profileNameInput.value.trim();
    if (nextName.length < 2) {
      setFieldError(profileNameInput, profileNameError, "Display name must be at least 2 characters.");
      return;
    }

    setFieldError(profileNameInput, profileNameError, "");
    state.user.name = nextName;
    state.user.status = profileStatusSelect.value;
    state.user.bio = profileBioInput.value.trim();

    syncUserUI();
    profileSavedMsg.textContent = "Profile updated for this session.";
  });

  settingEnterSend.addEventListener("change", () => {
    state.settings.enterToSend = settingEnterSend.checked;
  });

  settingCompactMode.addEventListener("change", () => {
    state.settings.compactMode = settingCompactMode.checked;
    applySettingsToShell();
  });

  settingShowTimestamps.addEventListener("change", () => {
    state.settings.showTimestamps = settingShowTimestamps.checked;
    applySettingsToShell();
  });

  resetDemoDataBtn.addEventListener("click", () => {
    state.groups = createInitialGroups();
    state.inbox = createInitialInbox();
    state.selectedGroupId = "grp-design";
    state.selectedInboxId = "dm-maya";
    updateBadges();
    settingsFeedback.textContent = "Mock conversations have been restored.";
  });
})();