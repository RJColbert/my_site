const content = {
	pass: "Passionately",
	main_title_pass: "curious.",
	purp: "Purposefully",
	main_title_purp: "creative.",
	main_body: "I’m a Massachusetts-based designer—part Art Director, part UI/UX problem-solver, part web tinkerer, part product thinker—with a deep drive to learn and evolve. I have the curiosity of a cat and the perfectionism of a craftsman—constantly testing, tweaking, and chasing the sweet spot where creativity solves a need, works beautifully, and looks even better.",
	direction_1: "Select",
	direction_2: "to reveal more",	
	hotspot_1_title: "Framing the world",
	hotspot_1_body: "Photography is my way of freezing fleeting moments — the ones that tell stories, capture a mood, or spotlight the details. It’s proof that strong visuals can say exactly what words cannot.",
	hotspot_1_pass: "observant.",
	hotspot_1_purp: "framing.",
	hotspot_2_title: "Ear candy",
	hotspot_2_body: "Podcasts let me indulge in my excitement for all sorts of topics. They spark my imagination, push me to see things in new ways, and reinforce the idea that listening is just as important as doing.",
	hotspot_2_pass: "listening.",
	hotspot_2_purp: "learning.",
	hotspot_3_title: "DIY all the way",
	hotspot_3_body: "From furniture to ornaments, making things by hand is a balance of planning and craft, where a strong foundation creates space for thoughtful details.",
	hotspot_3_pass: "crafting.",
	hotspot_3_purp: "planning.",
	hotspot_4_title: "Paws & reflect",
	hotspot_4_body: "My fur-baby Morris is the center of my world! Wide-eyed and quietly curious, he shows me how to appreciate the small things, often inspiring ideas in the most unexpected moments.",
	hotspot_4_pass: "attentive.",
	hotspot_4_purp: "appreciative.",
	hotspot_5_title: "Snowy state of wonder",
	hotspot_5_body: "There’s magic in snow — the stillness, the sparkle, the return of childlike wonder. It softens the world, inviting curiosity and imagination, and reminds me to be fully present.",
	hotspot_5_pass: "playful.",
	hotspot_5_purp: "present.",
	hotspot_6_title: "Planting ideas",
	hotspot_6_body: "I’m endlessly fascinated by watching seedlings grow into something greater than their beginnings. Gardening teaches me patience and structure — showing how a little love, some sunlight, and time can turn the smallest start into something meaningful.",
	hotspot_6_pass: "cultivating.",
	hotspot_6_purp: "rooted.",
};

document.querySelectorAll("[data-text]").forEach((el) => {
  const key = el.dataset.text;
  const value = content[key];

  if (value !== undefined) {
    el.textContent = value;
  } else {
    console.warn(`Missing content key: ${key}`);
  }
});