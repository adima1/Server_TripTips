import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { expect } from 'chai';
// טוען את משתני הסביבה מקובץ .env
dotenv.config();

describe('Database Connection', () => {
  // מתחבר למסד הנתונים לפני הרצת הבדיקות
  before(async () => {
    const mongoURL = process.env.MONGO_URL;
    if (!mongoURL) {
      throw new Error('MONGO_URL is not defined');
    }
    // מתחבר ל-MongoDB ללא אפשרויות מיושנות
    await mongoose.connect(mongoURL);
  });

  // מנתק את החיבור למסד הנתונים לאחר סיום הבדיקות
  after(async () => {
    await mongoose.disconnect();
  });

  // בודק אם החיבור ל-MongoDB פעיל
  it('should connect to MongoDB successfully', async () => {
    const dbState = mongoose.connection.readyState;
    expect(dbState).to.equal(1); // מצב 1 מציין חיבור פעיל
  });
});
