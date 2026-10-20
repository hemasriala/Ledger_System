// Script to fix phone number unique index issue
require('dotenv').config();
const mongoose = require('mongoose');

async function fixIndex() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const collection = db.collection('users');

    console.log('Current indexes:');
    const indexes = await collection.indexes();
    indexes.forEach(idx => {
      console.log('  -', JSON.stringify(idx.key), 'unique:', idx.unique);
    });
    console.log('');

    // Drop ALL existing indexes except _id
    console.log('Dropping all indexes (except _id)...');
    try {
      await collection.dropIndexes();
      console.log('✓ All indexes dropped\n');
    } catch (error) {
      console.log('Note:', error.message);
    }

    // Create compound unique index on phone + role
    console.log('Creating compound unique index on phone + role...');
    await collection.createIndex(
      { phone: 1, role: 1 }, 
      { unique: true, name: 'phone_role_unique' }
    );
    console.log('✓ Compound index created\n');

    // Verify the new index
    console.log('Updated indexes:');
    const newIndexes = await collection.indexes();
    newIndexes.forEach(idx => {
      console.log('  -', JSON.stringify(idx.key), 'unique:', idx.unique);
    });

    console.log('\n✓ Database index fix complete!');
    console.log('You can now use the same phone number for both seller and customer.\n');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

fixIndex();


