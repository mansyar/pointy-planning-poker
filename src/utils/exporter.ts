interface ExportTopic {
  title: string;
  finalEstimate?: string | number | null;
}

/**
 * Generates a Markdown table of topics and their final estimates.
 */
export function generateMarkdown(
  roomName: string,
  topics: ExportTopic[]
): string {
  let markdown = `# Session Export: ${roomName}\n\n`;
  markdown += `| Topic | Final Estimate |\n`;
  markdown += `| :--- | :--- |\n`;

  for (const topic of topics) {
    const estimate = topic.finalEstimate ?? '-';
    markdown += `| ${topic.title} | ${estimate} |\n`;
  }

  return markdown;
}

/**
 * Generates a plain-text summary list of topics.
 */
export function generateSummary(
  roomName: string,
  topics: ExportTopic[]
): string {
  let summary = `Session Summary: ${roomName}\n\n`;

  for (const topic of topics) {
    const estimate = topic.finalEstimate ?? '-';
    summary += `- ${topic.title}: ${estimate}\n`;
  }

  return summary;
}

/**
 * Generates a CSV string of topics.
 */
export function generateCSV(topics: ExportTopic[]): string {
  let csv = 'Topic,Final Estimate\n';

  for (const topic of topics) {
    const title = `"${topic.title.replace(/"/g, '""')}"`;
    const estimate = `"${(topic.finalEstimate ?? '-').toString().replace(/"/g, '""')}"`;
    csv += `${title},${estimate}\n`;
  }

  return csv.trim();
}

/**
 * Generates a Markdown summary of a standup session.
 */
export function generateStandupSummary(
  roomName: string,
  speakers: { name: string; duration: number }[],
  parkingLotItems: string[]
): string {
  let markdown = `# Standup Summary: ${roomName}\n\n`;
  
  markdown += `## 🎙️ Speaker Durations\n\n`;
  if (speakers.length === 0) {
    markdown += `No speakers recorded.\n\n`;
  } else {
    markdown += `| Speaker | Duration |\n`;
    markdown += `| :--- | :--- |\n`;
    for (const s of speakers) {
      markdown += `| ${s.name} | ${s.duration}s |\n`;
    }
    markdown += `\n`;
  }

  markdown += `## 🚗 Parking Lot Items\n\n`;
  if (parkingLotItems.length === 0) {
    markdown += `No items in parking lot.\n\n`;
  } else {
    for (const item of parkingLotItems) {
      markdown += `- ${item}\n`;
    }
  }

  return markdown;
}
