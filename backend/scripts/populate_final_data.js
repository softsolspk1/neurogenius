
const fs = require('fs');
const cheerio = require('cheerio');
const bcrypt = require('bcryptjs');
const { Category, Question, User, sequelize } = require('../models/index');

async function populateData() {
  try {
    console.log('Connecting to database and sinking schema...');
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('Database connected and synced.');

    // 0. Ensure all 15 Categories exist
    const categoriesList = [
      "Neuroanatomy", "Neurophysiology", "Cerebrovascular Diseases", 
      "Epilepsy and Seizure Disorders", "Movement Disorders", 
      "Demyelinating Diseases", "Neurodegenerative Diseases", 
      "Headache and Pain Disorders", "Neuromuscular Disorders", 
      "Infectious Diseases of the Nervous System", "Tumors of the Nervous System", 
      "Traumatic Brain Injury", "Pediatric Neurology", 
      "Neuropharmacology", "Neuroimaging"
    ];

    for (const catName of categoriesList) {
      await Category.findOrCreate({
        where: { name: catName },
        defaults: { description: `Specialized category for ${catName}` }
      });
      console.log(`Ensured Category: ${catName}`);
    }

    // 1. Create Demo Doctors
    const demoDoctors = [
      {
        name: 'Demo Doctor 1',
        email: 'doctor1@demo.com',
        designation: 'Doctor',
        specialty: 'Neurology',
        hospital: 'City Hospital',
        city: 'New York',
        phone: '1234567890',
        password_hash: await bcrypt.hash('password123', 10),
        status: 'active'
      },
      {
        name: 'Demo Doctor 2',
        email: 'doctor2@demo.com',
        designation: 'Doctor',
        specialty: 'Neuroscience',
        hospital: 'Mercy Clinic',
        city: 'Chicago',
        phone: '0987654321',
        password_hash: await bcrypt.hash('password123', 10),
        status: 'active'
      },
      {
        name: 'Demo Doctor 3',
        email: 'doctor3@demo.com',
        designation: 'Doctor',
        specialty: 'General Medicine',
        hospital: 'St. Peter Center',
        city: 'Los Angeles',
        phone: '1122334455',
        password_hash: await bcrypt.hash('password123', 10),
        status: 'active'
      }
    ];

    for (const doc of demoDoctors) {
      await User.findOrCreate({
        where: { email: doc.email },
        defaults: doc
      });
      console.log(`Ensured Demo Doctor: ${doc.name}`);
    }

    // 2. Import Categories and Questions
    console.log('Reading mcqs.html...');
    const htmlPath = 'c:/Users/softs/Desktop/Neurogenious/mcqs.html';
    if (!fs.existsSync(htmlPath)) {
        throw new Error('mcqs.html not found');
    }
    const content = fs.readFileSync(htmlPath, 'utf8');
    const $ = cheerio.load(content);

    console.log('Parsing topics and questions...');
    const topics = $('.topic-section');
    
    for (let i = 0; i < topics.length; i++) {
      const topicEl = $(topics[i]);
      const topicName = topicEl.find('.topic-header h2').text().trim();
      const topicDesc = topicEl.find('.topic-header p').text().trim();

      if (!topicName) continue;

      console.log(`Processing Topic: ${topicName}`);

      // Find or create category
      const [category] = await Category.findOrCreate({
        where: { name: topicName },
        defaults: { description: topicDesc }
      });

      const questionsToInsert = [];
      let currentSubtopic = '';

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

          if (questionText) {
              questionsToInsert.push({
                text: questionText,
                options: options,
                correct_answer: correctAnswer,
                category_id: category.id,
                subtopic: currentSubtopic,
                reference: reference,
                difficulty: 'medium'
              });
          }
        }
      });

      if (questionsToInsert.length > 0) {
        // To avoid massive duplicates if running multiple times, we'll check if questions exist
        // For efficiency in a bulk import, we'll just check the count for this category first
        const existingCount = await Question.count({ where: { category_id: category.id } });
        if (existingCount < questionsToInsert.length) {
            console.log(`Category ${topicName} has ${existingCount} questions. Importing ${questionsToInsert.length - existingCount} more...`);
            // This is a naive sync but given the volume, we'll just bulk create new ones if the count is low.
            // In a real scenario we'd use upserts on question text but for this test we'll just ensure count parity.
            await Question.bulkCreate(questionsToInsert, { ignoreDuplicates: true });
        } else {
            console.log(`Category ${topicName} already has ${existingCount} questions.`);
        }
      }
    }

    console.log('Final data population completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during data population:', error);
    process.exit(1);
  }
}

populateData();
