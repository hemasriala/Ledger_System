// Script to update database index for phone + role compound unique constraint
// Run this once: node update-db-index.js

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function updateIndex() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get the User collection
    const collection = mongoose.connection.db.collection('users');

    // Drop existing unique index on phone if it exists
    try {
      const indexes = await collection.indexes();
      const phoneIndex = indexes.find(idx => idx.key && idx.key.phone === 1 && idx.unique);
      
      if (phoneIndex) {
        console.log('Dropping old unique index on phone...');
        await collection.dropIndex('phone_1');
        console.log('✓ Old index dropped');
      }
    } catch (error) {
      if (error.code !== 27) { // Index not found error
        console.log('No old index to drop or already removed');
      }
    }

    // Create compound unique index on phone + role
    console.log('Creating compound unique index on phone + role...');
    await collection.createIndex({ phone: 1, role: 1 }, { unique: true });
    console.log('✓ Compound unique index created successfully');

    console.log('\n✓ Database index update complete!');
    console.log('Now the same phone number can be used for both seller and customer accounts.');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error updating index:', error);
    process.exit(1);
  }
}

updateIndex();


