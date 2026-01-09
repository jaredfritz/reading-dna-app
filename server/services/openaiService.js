const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Analyzes reading history to generate a Reading DNA profile
 */
async function generateReadingDNA(books) {
  const readBooks = books.filter(book =>
    book.shelf === 'read' || book['Exclusive Shelf'] === 'read'
  );

  const bookSummary = readBooks.slice(0, 100).map(book => ({
    title: book['Title'] || book.title,
    author: book['Author'] || book.author,
    rating: book['My Rating'] || book.rating,
    dateRead: book['Date Read'] || book.dateRead,
  }));

  const prompt = `Analyze this reader's book history and create a "Reading DNA" profile. The profile should be insightful, personalized, and reveal patterns in their reading preferences.

Books read (up to 100 most recent):
${JSON.stringify(bookSummary, null, 2)}

Create a Reading DNA profile with these sections:
1. **Core Reading Identity** (2-3 sentences): What defines this reader?
2. **Genre Distribution**: Break down their genre preferences with percentages
3. **Pacing Preference**: Do they prefer slow literary fiction, fast-paced thrillers, or a mix?
4. **Themes & Patterns**: What recurring themes, character types, or plot elements do they gravitate toward?
5. **Reading Evolution**: How has their taste changed over time (if data shows this)?
6. **Unique Fingerprint**: What makes this reader's taste unique or interesting?

Format as JSON with this structure:
{
  "coreIdentity": "string",
  "genreDistribution": [{"genre": "string", "percentage": number}],
  "pacingPreference": "string",
  "themesAndPatterns": ["string"],
  "readingEvolution": "string",
  "uniqueFingerprint": "string"
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error generating Reading DNA:', error);
    throw new Error('Failed to generate Reading DNA profile');
  }
}

/**
 * Generates book recommendations with genre diversity
 */
async function generateRecommendations(books, readingDNA) {
  const readBooks = books.filter(book =>
    book.shelf === 'read' || book['Exclusive Shelf'] === 'read'
  );

  const recentBooks = readBooks.slice(0, 30).map(book => ({
    title: book['Title'] || book.title,
    author: book['Author'] || book.author,
  }));

  const prompt = `Based on this reader's Reading DNA profile and recent books, recommend 10 books they haven't read yet.

Reading DNA:
${JSON.stringify(readingDNA, null, 2)}

Recent books they've read:
${JSON.stringify(recentBooks, null, 2)}

IMPORTANT: Include variety! The 10 recommendations should span different genres to prevent typecasting:
- Include at least 3-4 different genres
- Mix popular and lesser-known titles
- Include different time periods (classic and contemporary)
- Vary the pacing and tone

For each book, provide:
- Title and author
- Why it fits their Reading DNA
- What genre/category it represents
- A brief (1 sentence) hook

Format as JSON array:
[{
  "title": "string",
  "author": "string",
  "reason": "string",
  "genre": "string",
  "hook": "string"
}]`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result.recommendations || result;
  } catch (error) {
    console.error('Error generating recommendations:', error);
    throw new Error('Failed to generate recommendations');
  }
}

/**
 * Evaluates a specific book the user is considering
 */
async function evaluateBook(bookTitle, bookAuthor, readingDNA, userBooks) {
  const prompt = `A reader is considering reading "${bookTitle}" by ${bookAuthor}.

Their Reading DNA profile:
${JSON.stringify(readingDNA, null, 2)}

Provide feedback on whether this book would be a good fit for them. Include:
1. **Match Score** (1-10): How well does this book align with their Reading DNA?
2. **Why It Fits**: Specific reasons this might appeal to them
3. **Potential Concerns**: Any aspects that might not align with their preferences
4. **Content Warnings**: List potential triggers WITHOUT spoilers (violence, sexual content, death, mental health themes, etc.) - be specific but vague enough to avoid spoilers
5. **Similar Books They Might Prefer**: 2-3 alternatives if this isn't a perfect match

CRITICAL: Do not spoil plot points, twists, or endings. Keep all descriptions spoiler-free.

Format as JSON:
{
  "matchScore": number,
  "whyItFits": "string",
  "potentialConcerns": "string",
  "contentWarnings": ["string"],
  "alternatives": [{"title": "string", "author": "string", "reason": "string"}]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error evaluating book:', error);
    throw new Error('Failed to evaluate book');
  }
}

/**
 * Generates book connection graph data
 */
async function generateBookConnections(books) {
  const readBooks = books.filter(book =>
    book.shelf === 'read' || book['Exclusive Shelf'] === 'read'
  ).slice(0, 50);

  const bookList = readBooks.map(book => ({
    title: book['Title'] || book.title,
    author: book['Author'] || book.author,
  }));

  const prompt = `Analyze these books and identify thematic connections between them. Create a network graph showing how books relate to each other.

Books:
${JSON.stringify(bookList, null, 2)}

Identify connections based on:
- Similar themes
- Related genres
- Character archetypes
- Narrative style
- Author influences
- Subject matter

Create connections between books that share significant commonalities. Each book should connect to 2-5 other books.

Format as JSON:
{
  "nodes": [{"id": "string (book title)", "author": "string", "group": "string (primary theme/genre)"}],
  "links": [{"source": "string (book title)", "target": "string (book title)", "reason": "string (why they connect)"}]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error generating book connections:', error);
    throw new Error('Failed to generate book connections');
  }
}

module.exports = {
  generateReadingDNA,
  generateRecommendations,
  evaluateBook,
  generateBookConnections,
};
