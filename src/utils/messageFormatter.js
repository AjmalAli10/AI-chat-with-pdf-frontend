// Format message content for assistant messages
export const formatMessageContent = (content, isUser) => {
  if (isUser) {
    return content;
  }

  // Enhanced formatting for AI responses
  let formattedContent = content
    // Convert markdown headers to HTML (H1-H6)
    .replace(/^#\s+(.*?)$/gm, "<h1 class='text-2xl font-bold mb-3'>$1</h1>")
    .replace(/^##\s+(.*?)$/gm, "<h2 class='text-xl font-bold mb-2'>$1</h2>")
    .replace(
      /^###\s+(.*?)$/gm,
      "<h3 class='text-lg font-semibold mb-2'>$1</h3>"
    )
    .replace(
      /^####\s+(.*?)$/gm,
      "<h4 class='text-base font-semibold mb-2'>$1</h4>"
    )
    .replace(
      /^#####\s+(.*?)$/gm,
      "<h5 class='text-sm font-semibold mb-1'>$1</h5>"
    )
    .replace(
      /^######\s+(.*?)$/gm,
      "<h6 class='text-xs font-semibold mb-1'>$1</h6>"
    )

    // Convert bold text
    .replace(/\*\*(.*?)\*\*/g, "<strong class='font-semibold'>$1</strong>")

    // Convert italic text
    .replace(/\*(.*?)\*/g, "<em class='italic'>$1</em>")

    // Convert strikethrough
    .replace(/~~(.*?)~~/g, "<del class='line-through'>$1</del>")

    // Convert inline code
    .replace(
      /`([^`]+)`/g,
      "<code class='bg-gray-100 px-1 py-0.5 rounded text-sm font-mono'>$1</code>"
    )

    // Convert code blocks
    .replace(
      /```(\w+)?\n([\s\S]*?)```/g,
      "<pre class='bg-gray-100 p-3 rounded mb-2 overflow-x-auto'><code class='text-sm font-mono'>$2</code></pre>"
    )

    // Convert blockquotes
    .replace(
      /^>\s+(.*?)$/gm,
      "<blockquote class='border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-2'>$1</blockquote>"
    )

    // Convert unordered lists
    .replace(/^[-*]\s+(.*?)$/gm, "<li class='ml-4'>$1</li>")

    // Convert ordered lists
    .replace(/^\d+\.\s+(.*?)$/gm, "<li class='ml-4'>$1</li>")

    // Wrap lists in ul/ol tags
    .replace(/(<li.*?<\/li>)/g, "<ul class='list-disc mb-2'>$1</ul>")

    // Convert links
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      "<a href='$2' class='text-blue-600 hover:underline' target='_blank' rel='noopener noreferrer'>$1</a>"
    )

    // Convert horizontal rules
    .replace(/^---$/gm, "<hr class='border-gray-300 my-4'>")

    // Convert line breaks to <br> tags
    .replace(/\n/g, "<br>")

    // Wrap in paragraph if it's just plain text
    .replace(/^([^<].*)$/gm, "<p class='mb-2'>$1</p>")

    // Clean up empty paragraphs
    .replace(/<p class='mb-2'><\/p>/g, "")

    // Remove paragraph tags around headers and other block elements
    .replace(/<p class='mb-2'><(h[1-6]|blockquote|pre|ul|hr)/g, "<$1")
    .replace(/(<\/h[1-6]|<\/blockquote>|<\/pre>|<\/ul>|<\/hr>)<\/p>/g, "$1");

  return formattedContent;
};
