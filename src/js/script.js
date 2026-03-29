//---------- Clone the svg in each hotspot ----------//
  const template = document.getElementById('hotspot');

  document.querySelectorAll('.hs_point').forEach((point) => {
    const clone = template.content.cloneNode(true);
    point.appendChild(clone);
  });


//<<------------------------- OPENED BOXES ------------------------->>

//---------- CONTENT POPULATION ----------//
// Fills element with [data-text="key_name"] using matching value from content object in content.js
  document.querySelectorAll("[data-text]").forEach((el) => {
    const key = el.dataset.text;
    const value = content[key];

    if (value !== undefined) {
      el.textContent = value;
    }
  });


//---------- DOM REF ----------//
// Elements being controlled
  const openBox = document.querySelector(".openbox"); // Opened hotspot box
  const openTitle = document.querySelector(".ob_title"); // Opened hotspot box - title
  const openBody = document.querySelector(".ob_body"); // Opened hotspot box - body content
  const openPass = document.querySelector(".ob_pass"); // Opened hotspot box - passionately content
  const openPurp = document.querySelector(".ob_purp"); // Opened hotspot box - purposefully content

  const main = document.querySelector(".main"); // Overview content

  const bgImage = document.querySelector(".img.bg"); // Bg img
  const itemImages = document.querySelectorAll(".img:not(.bg)"); // Not bg img - all other fade ons

  const hotspotPoints = document.querySelectorAll(".hs_point");// Hotspots

  const prevButton = document.querySelector(".ob_prev"); // Prev arrow
  const nextButton = document.querySelector(".ob_next"); // Next arrow
  const dots = document.querySelectorAll(".ob_dot"); // Pagination dots


//---------- HOTSPOT ORDER ----------//
  const hotspotOrder = [1, 2, 3, 4, 5, 6]; // Defines order for prev/next nav for pagination dots

  let currentHotspot = null; // Tracks which hotspot is open - null is no hotspot open


//---------- RESET ACTIVE STATES ----------//
  function clearActiveStates() { //ensures only 1 hotspot is active, 1 image is visible & 1 dot is active
    hotspotPoints.forEach((point) => {
      point.classList.remove("active"); // Clears all active hotspots
    });

    itemImages.forEach((img) => {
      img.classList.remove("active_img"); // Clears all active imgs
    });

    dots.forEach((dot) => {
      dot.classList.remove("active"); // Clears all active pagination dots
    });
  }


//---------- GET HOTSPOT CONTENT ----------//
// Uses content.js naming structure to add content
  function getHotspotContent(hotspotNumber) {
    return {
      title: content[`hotspot_${hotspotNumber}_title`] || "", // Opened hotspot box - title
      body: content[`hotspot_${hotspotNumber}_body`] || "", // Opened hotspot box - body
      pass: content[`hotspot_${hotspotNumber}_pass`] || "", // Opened hotspot box - pass
      purp: content[`hotspot_${hotspotNumber}_purp`] || "", // Opened hotspot box - purp
    };
  }


//---------- RETRIGGER BOX ANIMATION ----------//
// directional transition of text in & out
  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function clearBoxAnimationClasses() {
    openBox.classList.remove(
      "animate-in-left",
      "animate-in-right",
      "animate-out-left",
      "animate-out-right"
    );
  }


//---------- CONTENT SWAP - L/R ----------//
  async function swapOpenBoxContent(hotspotNumber, direction = "left", isInitial = false) {
    const hotspotData = getHotspotContent(hotspotNumber);

    if (!isInitial) {
      clearBoxAnimationClasses();
    
    openBox.classList.add(direction === "left" ? "animate-out-right" : "animate-out-left"); // Old content leaves first

       await wait(220); // stagger content
     }

    openTitle.textContent = hotspotData.title; // swap content after old is gone
    openBody.textContent = hotspotData.body;
    openPass.textContent = hotspotData.pass;
    openPurp.textContent = hotspotData.purp;

    clearBoxAnimationClasses();
    
    void openBox.offsetWidth; // Force reflow > enter animation restarts

    openBox.classList.add(direction === "left" ? "animate-in-left" : "animate-in-right"); // New content enters
  }


//---------- OPEN HOTSPOT ----------//
  async function openHotspot(hotspotNumber, direction = "left", isInitial = false) {
    const point = document.querySelector(`.hs_point.hs${hotspotNumber}`); // Opens selected hotspot
    const activeImage = document.querySelector(`.img.hs${hotspotNumber}`); // Opens selected hotspot img
    const activeDot = document.querySelector(`.ob_dot[data-dot="${hotspotNumber}"]`); // Highlights correct pagination dot

    if (!point) return;

    clearActiveStates(); // Clear previous active state

    openBox.classList.add("open"); // Update open box text content
    main.classList.add("hidden");
    bgImage.classList.add("dimmed");
    point.classList.add("active");

    if (activeImage) {
      activeImage.classList.add("active_img"); // Fade in matching image
    }

    if (activeDot) {
      activeDot.classList.add("active"); // Activate matching pagination dot
    }

    await swapOpenBoxContent(hotspotNumber, direction, isInitial);

    currentHotspot = hotspotNumber; // Store current hotspot number
  }


//---------- CLOSE HOTSPOT ----------//
// Resets page to default
  function closeHotspot() {
    clearActiveStates(); // Clear active state
    clearBoxAnimationClasses(); // Clear the directional classes

    openBox.classList.remove("open"); // Close content box

    main.classList.remove("hidden"); // Show main content
    bgImage.classList.remove("dimmed"); // Restore bg img - removes dim

    currentHotspot = null; // Remove active hotspot
  }


//---------- HOTSPOT CLICK EVENTS ----------//
// Opening hotspot directly opens initial - or choose direction based on position relative to current - clicking already-active hotspot closes it
  hotspotPoints.forEach((point) => {
    point.addEventListener("click", async () => {

      const hotspotClass = [...point.classList].find((cls) => /^hs\d+$/.test(cls)); // Find the class
      if (!hotspotClass) return;

      const hotspotNumber = Number(hotspotClass.replace("hs", "")); // Convert hs to hs#
      const isActive = point.classList.contains("active"); // Makes hs active
     
      if (isActive) {
        closeHotspot(); // If clicking current open hotspot > close everything
        return;
      }

      if (currentHotspot === null) {
        await openHotspot(hotspotNumber, "left", true);
        return;
      }

      const currentIndex = hotspotOrder.indexOf(currentHotspot);
      const newIndex = hotspotOrder.indexOf(hotspotNumber);
      const direction = newIndex > currentIndex ? "left" : "right"; // which way content comes in

      await openHotspot(hotspotNumber, direction, false); // Otherwise open the new hotspot
    });
  });


//---------- PREVIOUS BUTTON ----------//
// Moves to prev hotspot in carousel order - Wraps around if at start
  if (prevButton) {
    prevButton.addEventListener("click", async () => {
      if (currentHotspot === null) return;

      prevButton.classList.remove("animate-prev"); // Arrow animation
      void prevButton.offsetWidth;
      prevButton.classList.add("animate-prev");

      const currentIndex = hotspotOrder.indexOf(currentHotspot);
      const prevIndex = (currentIndex - 1 + hotspotOrder.length) % hotspotOrder.length;

      await openHotspot(hotspotOrder[prevIndex], "right", false); // Moves content right
    });
  }


//---------- NEXT BUTTON ----------//
// Moves to next hotspot in order - Wraps around if at end
  if (nextButton) {
    nextButton.addEventListener("click", async () => {
      if (currentHotspot === null) return;

      nextButton.classList.remove("animate-next"); // Arrow animation
      void nextButton.offsetWidth;
      nextButton.classList.add("animate-next");

      const currentIndex = hotspotOrder.indexOf(currentHotspot);
      const nextIndex = (currentIndex + 1) % hotspotOrder.length;

      await openHotspot(hotspotOrder[nextIndex], "left", false); // Moves content left
    });
  }


//<<------------------------- SNOW ------------------------->>
  const snowLayer = document.querySelector(".snow_layer");

  function createSnowflake() {
    if (!snowLayer) return;

    const flake = document.createElement("div");
    flake.classList.add("snowflake");

    const type = Math.floor(Math.random() * 4); // Make irregular flakes

    if (type === 0) {
  
      flake.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M12 2 L12 22 M2 12 L22 12"
          stroke="white"
          stroke-width="1.4"
          stroke-linecap="round"/>
      </svg>`; // Cross snowflake

    } else if (type === 1) {    
      flake.innerHTML = ` 
      <svg viewBox="0 0 24 24">
        <path d="M4 4 L20 20 M20 4 L4 20"
          stroke="white"
          stroke-width="1.2"
          stroke-linecap="round"/>
      </svg>`; // X shape

    } else {
      flake.style.borderRadius = "5%"; // Irregular dot
    }

    const size = Math.random() < 0.8 // % of time ites true 0-1 - ex 0.8 = 80% small size, 20 large
      ? Math.random() * 3 + 1   // Small flakes - ex. [Math.random() * 1.5 + 1] - gives a # between 0 → 1.5 + 1
      : Math.random() * 4 + 3;  // Larger flakes
 
    const startX = Math.random() * window.innerWidth; // Random horizontal starting position
    
    const duration = size < 2
      ? Math.random() * 10 + 12 // Small → slow (12–22s)
      : Math.random() * 6 + 6; // Big → faster (6–12s)
    
    const delay = Math.random() * 5; // Random delay not all together

    const opacity = Math.random() * 0.5 + 0.3; // Random opacity

    const blur = Math.random() * 2; // Blur/depth effect

    const brightness = Math.floor(Math.random() * 40) + 215; // Random flake opacity

    const drift = (Math.random() - 0.5) * 40; // Drift - higher 2nd number more windy

    const rotation = Math.random() * 360;

    
    flake.style.background = `rgb(${brightness}, ${brightness}, ${brightness})`;
    flake.style.filter = `blur(${blur}px)`;
    flake.style.left = `${startX}px`;
    flake.style.width = `${size}px`;
    flake.style.height = `${size}px`;
    flake.style.opacity = opacity;
    flake.style.animationDuration = `${duration}s`;
    flake.style.animationDelay = `${delay}s`;
    flake.style.setProperty("--drift", `${drift}px`);
    flake.style.transform = `rotate(${rotation}deg)`;

    snowLayer.appendChild(flake);

    setTimeout(() => { // Remove flake after animation cycle to avoid DOM buildup
      flake.remove();
    }, (duration + delay) * 1000);
  }

  setInterval(createSnowflake, 100); // Create flakes continuously - lower# = more

  for (let i = 0; i < 60; i++) { // Seed a few immediately so snow appears on load
    createSnowflake();
  }

  