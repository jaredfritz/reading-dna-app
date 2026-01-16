require('dotenv').config();
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { generateReadingDNA, generateBookConnections } = require('../server/services/aiService');

// Read and parse the Goodreads CSV
async function parseGoodreadsCSV() {
  const books = [];
  const csvPath = path.join(__dirname, '../data/goodreads_library_export.csv');

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        // Only include books that have been read
        if (row['Exclusive Shelf'] === 'read') {
          books.push({
            'Title': row['Title'],
            'Author': row['Author'],
            'My Rating': row['My Rating'] || '0',
            'Date Read': row['Date Read'] || '',
            'Average Rating': row['Average Rating'] || '0',
            'Number of Pages': row['Number of Pages'] || '0',
            'Year Published': row['Original Publication Year'] || row['Year Published'] || '',
            'Read Count': row['Read Count'] || '1',
            'Exclusive Shelf': 'read'
          });
        }
      })
      .on('end', () => {
        console.log(`✓ Parsed ${books.length} read books from CSV`);
        resolve(books);
      })
      .on('error', reject);
  });
}

// Generate and save Reading DNA
async function generateAndSaveReadingDNA(books) {
  console.log('\n🧬 Generating Reading DNA profile...');
  console.log('This may take 1-2 minutes as we analyze the reading history.\n');

  try {
    const readingDNA = await generateReadingDNA(books);

    // Save to data file
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const dnaFilePath = path.join(dataDir, 'preloaded-reading-dna.json');
    fs.writeFileSync(dnaFilePath, JSON.stringify(readingDNA, null, 2));

    console.log('✓ Reading DNA profile generated and saved!');
    console.log(`  Saved to: ${dnaFilePath}\n`);

    return readingDNA;
  } catch (error) {
    console.error('✗ Error generating Reading DNA:', error.message);
    throw error;
  }
}

// Generate and save Book Connections
async function generateAndSaveBookConnections(books) {
  console.log('🔗 Generating book connection graph...');
  console.log('This may take 1-2 minutes as we analyze thematic connections.\n');

  try {
    const connections = await generateBookConnections(books);

    const dataDir = path.join(__dirname, '../data');
    const connectionsFilePath = path.join(dataDir, 'preloaded-book-connections.json');
    fs.writeFileSync(connectionsFilePath, JSON.stringify(connections, null, 2));

    console.log('✓ Book connections generated and saved!');
    console.log(`  Saved to: ${connectionsFilePath}\n`);

    return connections;
  } catch (error) {
    console.error('✗ Error generating book connections:', error.message);
    throw error;
  }
}

// Save parsed books data
function saveBooksData(books) {
  const dataDir = path.join(__dirname, '../data');
  const booksFilePath = path.join(dataDir, 'preloaded-books.json');

  // Create a user data structure similar to what the app expects
  const userData = {
    userId: 'default-user',
    books: books,
    uploadDate: new Date().toISOString()
  };

  fs.writeFileSync(booksFilePath, JSON.stringify(userData, null, 2));
  console.log('✓ Books data saved!');
  console.log(`  Saved to: ${booksFilePath}\n`);
}

// Main execution
async function main() {
  console.log('='.repeat(60));
  console.log('📚 Reading DNA - Preloaded Data Generator');
  console.log('='.repeat(60));
  console.log();

  try {
    // Step 1: Parse CSV
    console.log('📖 Step 1: Parsing Goodreads CSV...');
    const books = await parseGoodreadsCSV();

    // Step 2: Save books data
    console.log('\n💾 Step 2: Saving books data...');
    saveBooksData(books);

    // Step 3: Generate Reading DNA
    console.log('🧬 Step 3: Generating Reading DNA...');
    const readingDNA = await generateAndSaveReadingDNA(books);

    // Step 4: Generate Book Connections
    console.log('🔗 Step 4: Generating book connections...');
    const connections = await generateAndSaveBookConnections(books);

    console.log('='.repeat(60));
    console.log('✅ SUCCESS! All preloaded data files created:');
    console.log('='.repeat(60));
    console.log('  1. preloaded-books.json');
    console.log('  2. preloaded-reading-dna.json');
    console.log('  3. preloaded-book-connections.json');
    console.log();
    console.log('📊 Summary:');
    console.log(`  • Total books analyzed: ${books.length}`);
    console.log(`  • Reading DNA profile: Generated`);
    console.log(`  • Book connections: ${connections.nodes ? connections.nodes.length : 0} nodes, ${connections.links ? connections.links.length : 0} links`);
    console.log();
    console.log('Next step: Update the app to load this pre-generated data!');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nMake sure:');
    console.error('  1. Your .env file has a valid ANTHROPIC_API_KEY');
    console.error('  2. You have sufficient API credits');
    console.error('  3. The goodreads_library_export.csv file is in the data/ directory');
    process.exit(1);
  }
}

// Run the script
main();
