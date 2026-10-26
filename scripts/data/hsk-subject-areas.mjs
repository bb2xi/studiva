// Higher Education Compass fields of study (second level of its "Course of
// Study" tree, ids as returned by the API) → Studiva subject areas. A field can
// feed two areas; fields with no sensible match (Sport) feed none.

const ENGINEERING = [
  "1-59", "1-63", "1-66", "1-69", "1-71", "1-74", "1-84", "1-87", "1-91", "1-94", "1-96",
  "1-102", "1-104", "1-108", "1-116", "1-120", "1-132", "1-134", "1-145", "1-400", "1-401",
];
const NATURAL_SCIENCES = ["1-193", "1-204", "1-212", "1-214", "1-217", "1-242", "1-248", "1-250", "1-402"];
const LANGUAGE_CULTURE = [
  "1-273", "1-277", "1-279", "1-282", "1-288", "1-293", "1-302", "1-316", "1-320", "1-325",
  "1-328", "1-334", "1-342", "1-348", "1-351", "1-357", "1-363", "1-369", "1-404",
];
const ARTS = ["1-146", "1-156", "1-165", "1-173", "1-176", "1-179", "1-405"];

export const HSK_FIELD_AREAS = {
  // Agricultural and Forest Sciences
  "1-1": ["agriculture-environment"],
  "1-8": ["agriculture-environment"],
  "1-12": ["agriculture-environment"],
  // Humanities and Social Sciences (1-42 Sport is left out)
  "1-17": ["education-teaching"],
  "1-26": ["social-sciences"],
  "1-29": ["social-sciences"],
  "1-37": ["social-sciences"],
  "1-40": ["social-sciences"],
  "1-46": ["humanities-languages"],
  "1-399": ["social-sciences"],
  // Engineering Sciences
  ...Object.fromEntries(ENGINEERING.map((id) => [id, ["engineering"]])),
  "1-56": ["architecture-planning"],
  "1-109": ["architecture-planning"],
  "1-126": ["engineering", "agriculture-environment"],
  // Art, Music, Design
  ...Object.fromEntries(ARTS.map((id) => [id, ["arts-design-music"]])),
  // Mathematics, Natural Sciences
  ...Object.fromEntries(NATURAL_SCIENCES.map((id) => [id, ["natural-sciences"]])),
  "1-403": ["natural-sciences", "agriculture-environment"],
  "1-226": ["computer-science"],
  "1-237": ["mathematics"],
  // Medicine, Health Sciences
  "1-255": ["medicine-health"],
  "1-263": ["medicine-health"],
  "1-270": ["medicine-health"],
  // Language and Cultural Studies
  ...Object.fromEntries(LANGUAGE_CULTURE.map((id) => [id, ["humanities-languages"]])),
  // Economic Sciences, Law
  "1-380": ["business-economics"],
  "1-395": ["law"],
  // Teaching Degrees
  "1-396": ["education-teaching"],
  "1-397": ["education-teaching"],
  "1-398": ["education-teaching"],
  // Public Administration
  "1-406": ["social-sciences"],
};

/** Field ids the mapping deliberately leaves out. */
export const HSK_UNMAPPED_FIELDS = ["1-42"];
