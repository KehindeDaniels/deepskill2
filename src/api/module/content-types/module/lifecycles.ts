function extractText(blocks: any[]): string {
  let text = "";

  for (const block of blocks) {
    if (block.children) {
      for (const child of block.children) {
        if (child.text) {
          text += child.text + " ";
        }
      }
    }
  }

  return text.trim();
}

export default {
  beforeCreate(event) {
    const content = event.params.data.description;

    if (!content || !Array.isArray(content)) return;

    const text = extractText(content);
    if (!text) return;

    const wordCount = text.split(/\s+/).length;
    const minutes = Math.max(1, Math.round(wordCount / 200));

    event.params.data.duration = minutes;
  },

  beforeUpdate(event) {
    const content = event.params.data.description;

    if (!content || !Array.isArray(content)) return;

    const text = extractText(content);
    if (!text) return;

    const wordCount = text.split(/\s+/).length;
    const minutes = Math.max(1, Math.round(wordCount / 200));

    event.params.data.duration = minutes;
  },
};
