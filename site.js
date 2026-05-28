(function () {
  const content = window.SITE_CONTENT || {};
  const page = document.body.dataset.page;

  setActiveNav(page);

  if (page === "home") {
    const nameEl = document.getElementById("artist-name");
    if (nameEl) nameEl.textContent = content.name || "";
    const homeImg = document.getElementById("home-image");
    if (homeImg && content.homeImage) {
      homeImg.src = `assets/home/${content.homeImage}`;
      homeImg.alt = content.name ? `${content.name} artwork` : "Home artwork";
      homeImg.style.display = "block";
      homeImg.addEventListener("load", () => makeNearBlackTransparent(homeImg), {
        once: true
      });
    }
  }

  if (page === "about") {
    const aboutEl = document.getElementById("about-text");
    if (aboutEl) aboutEl.textContent = content.aboutText || "";
    const aboutImg = document.getElementById("about-image");
    if (aboutImg && content.aboutImage) {
      aboutImg.src = `assets/about/${content.aboutImage}`;
      aboutImg.alt = content.name ? `${content.name} about image` : "About image";
      aboutImg.style.display = "block";
    }
  }

  if (page === "work") {
    const grid = document.getElementById("gallery-grid");
    const artworks = Array.isArray(content.artworks) ? content.artworks : [];
    artworks.forEach((filename) => {
      const card = document.createElement("article");
      card.className = "art-card";

      const img = document.createElement("img");
      img.src = `assets/artwork/${filename}`;
      img.alt = filenameToTitle(filename);
      img.loading = "lazy";
      card.append(img);
      grid.appendChild(card);
    });
  }

  function setActiveNav(pageName) {
    const active = document.querySelector(`[data-nav="${pageName}"]`);
    if (active) active.classList.add("active");
  }

  function filenameToTitle(filename) {
    return filename
      .replace(/\.[^/.]+$/, "")
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function makeNearBlackTransparent(imgEl) {
    const canvas = document.createElement("canvas");
    canvas.width = imgEl.naturalWidth;
    canvas.height = imgEl.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(imgEl, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    // Remove only near-black background pixels to preserve the artwork texture.
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      if (r < 12 && g < 12 && b < 12) {
        pixels[i + 3] = 0;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    imgEl.src = canvas.toDataURL("image/png");
  }
})();
