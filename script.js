const menuButton = document.querySelector(".site-header__menu-button");
const navigation = document.querySelector(".site-navigation");
const navigationLinks = document.querySelectorAll(".site-navigation__link");
const enquiryForm = document.querySelector(".booking-enquiry__form");
const enquiryStatus = document.querySelector(".booking-enquiry__status");
const placeholderImages = document.querySelectorAll("img[data-placeholder]");
const serviceDetailsToggles = document.querySelectorAll(".service-card__details-toggle");

const createPlaceholderSvg = (label) => {
  const safeLabel = label.replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
      <defs>
        <linearGradient id="softGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f6e7d3"/>
          <stop offset="46%" stop-color="#dfe8d7"/>
          <stop offset="100%" stop-color="#e8dff1"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="900" fill="url(#softGradient)"/>
      <circle cx="920" cy="170" r="220" fill="#fffaf2" opacity="0.34"/>
      <circle cx="150" cy="760" r="260" fill="#e9ad93" opacity="0.22"/>
      <path d="M332 514 C450 390 564 390 682 514 C566 638 448 638 332 514Z" fill="#fffaf2" opacity="0.45"/>
      <text x="600" y="472" text-anchor="middle" fill="#5b4767" font-family="Georgia, serif" font-size="54" font-weight="700">${safeLabel}</text>
      <text x="600" y="535" text-anchor="middle" fill="#70665f" font-family="Arial, sans-serif" font-size="26">Rapid Reset Studio</text>
    </svg>
  `)}`;
};

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  navigationLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navigation.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
    });
  });
}

serviceDetailsToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const detailsId = toggle.getAttribute("aria-controls");
    const details = detailsId ? document.getElementById(detailsId) : null;
    const serviceCard = toggle.closest(".service-card");

    if (!details) {
      return;
    }

    const isExpanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isExpanded));
    toggle.textContent = isExpanded ? "More information" : "Hide information";
    details.hidden = isExpanded;

    if (serviceCard) {
      serviceCard.classList.toggle("service-card--details-open", !isExpanded);
    }
  });
});

if (enquiryForm && enquiryStatus) {
  enquiryForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = enquiryForm.querySelector(".booking-enquiry__submit");
    const formData = new FormData(enquiryForm);

    enquiryStatus.textContent = "Sending your enquiry...";

    if (submitButton) {
      submitButton.disabled = true;
    }

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      enquiryStatus.textContent = "Thank you for your enquiry. I will be in touch with you soon.";
      enquiryForm.reset();
    } catch (error) {
      enquiryStatus.textContent = "Sorry, something went wrong. Please try again or email me directly.";
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}

placeholderImages.forEach((image) => {
  const applyFallback = () => {
    image.src = createPlaceholderSvg(image.dataset.placeholder || "Rapid Reset Studio");
  };

  image.addEventListener("error", applyFallback, { once: true });

  if (image.complete && image.naturalWidth === 0) {
    applyFallback();
  }
});
