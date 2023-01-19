
const { MongoClient } = require("mongodb");
require("dotenv").config();
const fs = require("fs").promises;
const path = require("path");
const loading = require("loading-cli");
const { MONGODB_URI } = process.env;



const client = new MongoClient(MONGODB_URI);

async function main() {
  try {
    await client.connect();
    const db = client.db();
    const results = await db.collection("teamData").find({}).count();

    /**
     * If existing records then delete the current collections
     */
    if (results) {
      db.dropDatabase();
    }

    /**
     * This is just a fun little loader module that displays a spinner
     * to the command line
     */
    const load = loading("Importing your fpl teams !!!").start();

    /**
     * Import the JSON data into the database
     */

    const data = await fs.readFile(path.join(__dirname, "squadData.json"), "utf8");
    await db.collection("teamData").insertMany(JSON.parse(data));

    /**
     * This perhaps appears a little more complex than it is. Below, we are
     * grouping the wine tasters and summing their total tastings. Finally,
     * we tidy up the output so it represents the format we need for our new collection
     */

    const teamsRef = await db.collection("teamData").aggregate([
      { $match: { team: { $ne: null } } },
      {
        $group: {
          _id: "$team",
        },

      },
      {
        $project: {
          _id: 0,
          name: '$_id',
        },
      },
    ]);

    /**
     * Below, we output the results of our aggregate into a
     * new collection
     */
    const teams = await teamsRef.toArray();
    await db.collection("teamData").insertMany(teams);

    await db.collection("tastings")
      .updateMany({ teams: { $all: [null] } }, [
        { $set: { teams: [{ $arrayElemAt: ["$teams", 0] }] } },
      ])

    db.collection("teamData").aggregate([
      { $group: { _id: "$goals" } },
      { $project: { name: "$_id", "_id": 0 } },
      { $out: "goals" }
    ]).toArray();

    db.collection("teamData").aggregate([
      { $group: { _id: "$shots_total" } },
      { $project: { name: "$_id", "_id": 0 } },
      { $out: "shots_total" }
    ]).toArray()

    await db.collection("teamData").aggregate([
      { $group: { _id: "$shots_on_target" } },
      { $project: { name: "$_id", "_id": 0 } },
      { $out: "shots_on_target" }
    ]).toArray();

    
    load.stop();
    console.info(
      `Teams collection set up!`
    );


    process.exit();
  } catch (error) {
    console.error("error:", error);
    process.exit();
  }
}

main();
