export const scheduleUpdate = async (mCol, newValues, filters, timeToRun) => {
  cron.schedule(timeToRun, async () => {
    // This example runs at midnight every day
    try {
      const filter = { ...filters }; // e.g., { status: 'pending' }
      const updateDoc = {
        $set: {
          ...newValues,
          updatedAt: new Date(),
        },
      };

      const result = await mCol.updateOne(filter, updateDoc);
      console.log(`Document updated: ${result.modifiedCount}`);
    } catch (err) {
      console.error("Failed to update document", err);
    }
  });
};
