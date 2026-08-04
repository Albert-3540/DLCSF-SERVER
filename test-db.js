import connectDB from './src/config/database.js';
import Contact from './src/models/Contact.js';

async function testDB() {
  console.log('🔌 Testing database connection...');
  
  try {
    await connectDB();
    
    // Test creating a contact
    const contact = await Contact.create({
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Message',
      message: 'This is a test message to verify database connection.',
    });
    
    console.log('✅ Contact created:', contact);
    
    // Test reading contacts
    const contacts = await Contact.find();
    console.log(`📊 Total contacts: ${contacts.length}`);
    
    console.log('✅ Database test passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  }
}

testDB();