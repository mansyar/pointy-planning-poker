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
