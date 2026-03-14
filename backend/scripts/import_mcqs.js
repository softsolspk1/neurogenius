
const fs = require('fs');
const cheerio = require('cheerio');
const { Category, Question, sequelize } = require('../models/index');

async function importMCQs() {
  try {
    console.log('Reading mcqs.html...');
    const content = fs.readFileSync('c:/Users/softs/Desktop/Neurogenious/mcqs.html', 'utf8');
    const $ = cheerio.load(content);

    console.log('Parsing topics and questions...');
    const topics = $('.topic-section');
    
    for (let i = 0; i < topics.length; i++) {
      const topicEl = $(topics[i]);
      const topicName = topicEl.find('.topic-header h2').text().trim();
      const topicDesc = topicEl.find('.topic-header p').text().trim();

      console.log(`Processing Topic: ${topicName}`);

      // Find or create category
      const [category] = await Category.findOrCreate({
        where: { name: topicName },
        defaults: { description: topicDesc }
      });

      const questionsToInsert = [];
      let currentSubtopic = '';

      // Iterate through elements in the topic section
      topicEl.children().each((idx, el) => {
        const element = $(el);

        if (element.hasClass('subtopic-header')) {
          currentSubtopic = element.find('h3').text().trim();
        } else if (element.hasClass('question-card')) {
          const questionText = element.find('.question-text').text().trim();
          const options = [];
          element.find('.options .option').each((optIdx, optEl) => {
            options.push($(optEl).text().trim().replace(/^Option [A-D]\s*/, ''));
          });

          const answerRaw = element.find('.answer-text').text().trim();
          const correctAnswerMatch = answerRaw.match(/Option ([A-D])/);
          const correctAnswer = correctAnswerMatch ? correctAnswerMatch[1] : '';

          const reference = element.find('.reference-text').text().trim();

          questionsToInsert.push({
            text: questionText,
            options: options,
            correct_answer: correctAnswer,
            category_id: category.id,
            subtopic: currentSubtopic,
            reference: reference,
            difficulty: 'medium' // Defaulting to medium
          });
        }
      });

      if (questionsToInsert.length > 0) {
        console.log(`Bulk inserting ${questionsToInsert.length} questions for ${topicName}...`);
        await Question.bulkCreate(questionsToInsert);
      }
    }

    console.log('Import completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during import:', error);
    process.exit(1);
  }
}

importMCQs();
