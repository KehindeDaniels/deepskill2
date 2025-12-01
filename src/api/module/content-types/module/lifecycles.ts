export default {
  async beforeCreate(event) {
    await calculateModuleStats(event);
  },

  async beforeUpdate(event) {
    await calculateModuleStats(event);
  },
};

async function calculateModuleStats(event) {
  const { data } = event.params;

  // Generate slug from title if missing
  if (data?.title && !data?.slug) {
    data.slug = generateSlug(data.title);
  }

  // Calculate duration in minutes
  let durationInMinutes = 60; // Default 1 hour

  if (data?.description) {
    const { wordCount, estimatedMinutes } = analyzeContent(
      data.description,
      data.level
    );

    // Store word count if you have the field
    // data.wordCount = wordCount;

    durationInMinutes = estimatedMinutes;
  }

  // Set duration field (in minutes)
  data.duration = durationInMinutes;

  // Set default level if not provided
  if (!data?.level) {
    data.level = "beginner";
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/--+/g, "-") // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, "") // Trim hyphens from start/end
    .trim();
}

function analyzeContent(
  blocks: any[],
  level: string = "intermediate"
): {
  wordCount: number;
  estimatedMinutes: number;
} {
  const wordCount = countWordsInRichText(blocks);

  // Reading speeds (words per minute)
  const readingSpeeds = {
    beginner: 140, // Slower for complex material
    intermediate: 180, // Average reading speed
    advanced: 220, // Faster for familiar topics
  };

  const wpm = readingSpeeds[level] || 180;

  // Calculate reading time
  const readingTimeMinutes = Math.ceil(wordCount / wpm);

  // Add time for different content types
  const contentAnalysis = analyzeBlockTypes(blocks);

  // Additional time based on content complexity
  let additionalMinutes = 0;

  // Time for lists (more structured, takes longer to process)
  additionalMinutes += contentAnalysis.listCount * 2;

  // Time for tables (complex to understand)
  additionalMinutes += contentAnalysis.tableCount * 5;

  // Time for code blocks (if any)
  additionalMinutes += contentAnalysis.codeCount * 3;

  // Time for images (viewing/analyzing)
  additionalMinutes += contentAnalysis.imageCount * 1;

  // Calculate total minutes
  let totalMinutes = readingTimeMinutes + additionalMinutes;

  // Add 25% buffer for exercises, quizzes, reflection
  totalMinutes = Math.ceil(totalMinutes * 1.25);

  // Set reasonable bounds (30 min to 40 hours)
  totalMinutes = Math.max(30, Math.min(totalMinutes, 2400));

  return {
    wordCount,
    estimatedMinutes: totalMinutes,
  };
}

function countWordsInRichText(blocks: any[]): number {
  if (!blocks || !Array.isArray(blocks)) return 0;

  let totalWords = 0;

  const extractTextFromNode = (node: any): string => {
    if (!node) return "";

    // Get text from current node
    let text = node.text || "";

    // Add text from children recursively
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach((child) => {
        text += " " + extractTextFromNode(child);
      });
    }

    return text;
  };

  blocks.forEach((block) => {
    const blockText = extractTextFromNode(block);

    if (blockText.trim()) {
      // Count words in the extracted text
      const words = blockText
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);

      totalWords += words.length;
    }
  });

  return totalWords;
}

function analyzeBlockTypes(blocks: any[]): {
  listCount: number;
  tableCount: number;
  codeCount: number;
  imageCount: number;
  headingCount: number;
} {
  const counts = {
    listCount: 0,
    tableCount: 0,
    codeCount: 0,
    imageCount: 0,
    headingCount: 0,
  };

  if (!blocks || !Array.isArray(blocks)) return counts;

  const analyzeNode = (node: any) => {
    if (!node) return;

    // Count block types
    switch (node.type) {
      case "list":
        counts.listCount++;
        break;
      case "table":
        counts.tableCount++;
        break;
      case "code":
        counts.codeCount++;
        break;
      case "image":
        counts.imageCount++;
        break;
      case "heading":
        counts.headingCount++;
        break;
    }

    // Recursively analyze children
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(analyzeNode);
    }
  };

  blocks.forEach(analyzeNode);

  return counts;
}
