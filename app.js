const express = require("express");
const app = express();
app.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server is running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`db error: ${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

//api 1
app.get("/players/", async (request, response) => {
  const getPlayersQuery = `SELECT * FROM cricket_team;`;
  const playersDb = await db.all(getPlayersQuery);
  const getAllPlayersDetails = (playerArray) => {
    return {
      playerId: playerArray.player_id,
      playerName: playerArray.player_name,
      jerseyNumber: playerArray.jersey_number,
      role: playerArray.role,
    };
  };
  response.send(
    playersDb.map((playerArray) => getAllPlayersDetails(playerArray))
  );
});

//api 2

app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const createPlayerQuery = ` 
  INSERT INTO 
        cricket_team (player_name, jersey_number, role)
  VALUES (
        '${playerName}',
        ${jerseyNumber},
        '${role}'
  );
`;
  await db.run(createPlayerQuery);
  response.send("Player Added to Team");
});

//api 3

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `SELECT * FROM cricket_team WHERE player_id=${playerId};`;
  const playersDb = await db.get(getPlayerQuery);
  const getAllPlayersDetails = (playerArray) => {
    return {
      playerId: playerArray.player_id,
      playerName: playerArray.player_name,
      jerseyNumber: playerArray.jersey_number,
      role: playerArray.role,
    };
  };
  response.send(getAllPlayersDetails(playersDb));
});

module.exports = app;

//api 4

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const { playerName, jerseyNumber, role } = request.body;
  const updateQuery = `
  UPDATE 
  cricket_team 
    SET 
    player_name='${playerName}',
    jersey_number=${jerseyNumber},
    role='${role}'
    WHERE player_id=${playerId};`;
  await db.run(updateQuery);
  response.send("Player Details Updated");
});

//api 5

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
    DELETE FROM cricket_team
    WHERE player_id=${playerId};`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});
