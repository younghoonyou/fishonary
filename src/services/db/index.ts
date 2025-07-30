import SQLite, {
  enablePromise,
  openDatabase,
  SQLiteDatabase,
} from 'react-native-sqlite-storage';
import {Fish, User, LocationInfo} from 'types/index';

let dbInstance: SQLiteDatabase | null = null;

enablePromise(true);

export const connectToDatabase = async (): Promise<SQLiteDatabase> => {
  if (dbInstance) return dbInstance;
  else
    dbInstance = await openDatabase(
      {
        name: 'fishonary.db',
        // location: 'default',
        // createFromLocation: '~www/fishonary.db',
        createFromLocation: 1,
      },
      () => {},
      error => {
        console.error(error);
        throw Error('Could not connect to database');
      },
    );
  return dbInstance;
};

export const getDatabase = async (): Promise<SQLiteDatabase> => {
  if (!dbInstance) {
    dbInstance = await connectToDatabase();
  }
  return dbInstance;
};

export const createTables = async (db: SQLiteDatabase): Promise<void> => {
  const UserCreateQuery = `
      CREATE TABLE IF NOT EXISTS user (
          id                INTEGER PRIMARY KEY AUTOINCREMENT,
          photo             BLOB,
          name              TEXT DEFAULT 'Fisher',
          email             TEXT NOT NULL UNIQUE,
          fish              TEXT DEFAULT '[]',
          isSubscriber      INTEGER DEFAULT 0,
          subscribe_at      TEXT,
          subscribe_period  INTEGER DEFAULT 0
        );
    `;

  const FishCreateQuery = `
      CREATE TABLE IF NOT EXISTS fish (
	        id	              INTEGER PRIMARY KEY AUTOINCREMENT,
	        name	            TEXT,
          type              TEXT,
          date              TEXT,
	        latitude	        REAL,
	        longitude	        REAL,
          location_name     TEXT,
          photo	            BLOB,
	        created_at	      TEXT NOT NULL,
          writer            INTEGER REFERENCES user(id) ON UPDATE CASCADE ON DELETE CASCADE,
          notes             TEXT DEFAULT ''
        );
    `;

  try {
    await db.executeSql(UserCreateQuery);
    await db.executeSql(FishCreateQuery);
    await db.executeSql(
      `INSERT OR IGNORE INTO user (name, email) VALUES (?, ?)`,
      ['fisherman', 'fishonary@gmail.com'],
    );
  } catch (error) {
    console.error('Failed to create tables:', JSON.stringify(error, null, 2));
    throw new Error('Failed to create tables');
  }
};

export const deleteTables = async (db: SQLiteDatabase): Promise<void> => {
  try {
    await db.executeSql(`DROP TABLE user`);
    await db.executeSql(`DROP TABLE fish`);
  } catch (error) {
    console.error('Failed to create tables:', JSON.stringify(error, null, 2));
    throw new Error('Failed to create tables');
  }
};

// ================ USER ================

export const createUser = async (
  db: SQLiteDatabase,
  email: string,
  name: string | null,
): Promise<User | null> => {
  try {
    if (!email || !name) throw new Error('Fail to create user');
    const res = await db.executeSql(
      'INSERT INTO user (name, email) VALUES (?, ?)',
      [name, email],
    );
    const insertId = res[0].insertId;

    const userRes = await db.executeSql('SELECT * FROM user WHERE id = ?', [
      insertId,
    ]);

    const row = userRes[0].rows.item(0);
    const user: User = {
      id: row.id,
      name: row.name,
      email: row.email,
      photo: row.photo ?? null,
      fish: JSON.parse(row.fish) ?? [],
      isSubscriber: !!row.isSubscriber,
      subscribe_at: row.subscribe_at ?? null,
      subscribe_period: row.subscribe_period ?? 0,
    };
    return user;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get user information from database');
  }
};

export const getUserInfo = async (
  db: SQLiteDatabase,
  email: string,
): Promise<User | null> => {
  try {
    if (!email) throw new Error('Fail to get info');
    let user: User | null = null;
    const res = await db.executeSql('SELECT * FROM user WHERE email = ?', [
      email,
    ]);
    if (res[0].rows.length === 0) return null;
    const row = res[0].rows.item(0);
    const fish_results = row.fish.length
      ? await Promise.all(
          JSON.parse(row.fish).map(async (num: number) => {
            const res = await db.executeSql(`SELECT * FROM fish WHERE id = ?`, [
              num,
            ]);
            return res[0].rows.item(0);
          }),
        )
      : [];

    user = {
      id: row.id,
      name: row.name,
      email: row.email,
      photo: row.photo,
      fish: fish_results,
      isSubscriber: row.isSubscriber,
      subscribe_at: row.subscribe_at,
      subscribe_period: row.subscribe_period,
    };
    return user;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get user information');
  }
};

export const updateUser = async (
  db: SQLiteDatabase,
  name: string,
  id: number | undefined,
): Promise<User> => {
  try {
    if (!id) throw new Error('Fail to update user');
    const userRes = await db.executeSql(`SELECT id FROM user WHERE id = ?`, [
      id,
    ]);

    const userRow = userRes[0].rows.item(0);

    if (userRow.id !== id) throw new Error('Fail to update user');

    await db.executeSql(`UPDATE user SET name = ? WHERE id = ?;`, [name, id]);

    const res = await db.executeSql(`SELECT * FROM user WHERE id = ?`, [id]);

    const row = res[0].rows.item(0);

    if (!row) throw new Error('Fail to update user');

    const user: User = {
      id: row.id,
      name: row.name,
      email: row.email,
      photo: row.photo,
      fish: JSON.parse(row.fish),
      isSubscriber: row.isSubscriber,
      subscribe_at: row.subscribe_at,
      subscribe_period: row.subscribe_period,
    };
    return user;
  } catch (error) {
    console.error(error);
    throw Error('Fail to update user');
  }
};

export const deleteUser = async (
  db: SQLiteDatabase,
  id: number,
): Promise<void> => {
  try {
    await db.executeSql(`DELETE FROM user WHERE id = ?`, [id]);
    await db.executeSql(`DELETE FROM fish WHERE writer = ?`, [id]);
  } catch (error) {
    console.error(error);
    throw Error('Failed to get fish information');
  }
};

// ================ FISH ================
export const createFish = async (
  db: SQLiteDatabase,
  name: string,
  type: string,
  photo: string,
  location: LocationInfo,
  date: string,
  writer: number,
  notes: string,
): Promise<Fish | null> => {
  if (!name || !writer || !type || !photo || !location || !date)
    throw new Error('Fail to create fish');
  let fish: Fish | null = null;
  try {
    const res = await db.executeSql(
      `INSERT INTO fish (
          name,
          type,
          date,
          latitude,
          longitude,
          location_name,
          photo,
          created_at,
          writer,
          notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        name,
        type,
        date,
        location.latitude,
        location.longitude,
        location.name || '',
        photo,
        date,
        writer,
        notes || '',
      ],
    );
    const newFishId = res[0].insertId;
    const userResult = await db.executeSql(
      `SELECT fish FROM user WHERE id = ?;`,
      [writer],
    );
    console.log(userResult, writer, userResult[0].rows.item(0).fish);

    const fishArray: number[] = JSON.parse(userResult[0].rows.item(0).fish)
      .length
      ? JSON.parse(userResult[0].rows.item(0).fish)
      : [];

    console.log(fishArray);

    fishArray.push(newFishId);

    await db.executeSql(`UPDATE user SET fish = ? WHERE id = ?;`, [
      JSON.stringify(fishArray),
      writer,
    ]);

    const fishRes = await db.executeSql('SELECT * FROM fish WHERE id = ?;', [
      newFishId,
    ]);

    const row = fishRes[0].rows.item(0);
    fish = {
      id: row.id,
      name: row.name,
      type: row.type,
      photo: row.photo,
      latitude: row.latitude,
      longitude: row.longitude,
      location_name: row.location_name || '',
      date: row.date,
      notes: row.notes,
      writer: row.writer,
    };
    return fish;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get fish information');
  }
};
export const getFishInfo = async (
  db: SQLiteDatabase,
  id: number,
): Promise<Fish | null> => {
  try {
    if (!id) throw new Error('Fail to get info');
    let fish: Fish | null = null;
    const res = await db.executeSql('SELECT * FROM fish WHERE id = ?;', [id]);
    if (res[0].rows.length === 0) return null;
    const row = res[0].rows.item(0);
    fish = {
      id: row.id,
      name: row.name,
      type: row.type,
      photo: row.photo,
      latitude: row.latitude,
      longitude: row.longitude,
      location_name: row.location_name || '',
      date: row.date,
      notes: row.notes,
      writer: row.writer,
    };
    return fish;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get fish information');
  }
};

export const getFishLocation = async (db: SQLiteDatabase, writer: number) => {
  // Future WORK: membership loop to get all location within 1 week
  try {
    if (!writer) throw new Error('Fail to create fish information');
    const result = await db.executeSql(`
      SELECT latitude, longitude, photo FROM fish;
    `);
    const rows = result[0].rows;
    const fishList = [];
    for (let i = 0; i < rows.length; i++) {
      fishList.push(rows.item(i));
    }
    return fishList;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get fish information');
  }
};

export const deleteFish = async (
  db: SQLiteDatabase,
  id: number,
  userId: number,
): Promise<void> => {
  try {
    if (!id) throw new Error('Failed to get fish information');
    await db.executeSql(`DELETE FROM fish WHERE id = ?`, [id]);

    const res = await db.executeSql(`SELECT * FROM user WHERE id = ?`, [
      userId,
    ]);
    const row = res[0].rows.item(0);
    console.log(JSON.parse(row.fish), row.fish);
    const newFish =
      JSON.parse(row.fish).filter((num: number) => num !== id) || [];
    console.log(newFish);

    await db.executeSql(`UPDATE user SET fish = ? WHERE id = ?`, [
      JSON.stringify(newFish),
      userId,
    ]);
  } catch (error) {
    console.error(error);
    throw Error('Failed to get fish information');
  }
};

export const getTableNames = async (db: SQLiteDatabase) => {
  try {
    const [result] = await db.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table';",
    );

    const tableNames: string[] = [];

    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows.item(i); // row is a { name: string }
      tableNames.push(row.name);
    }

    console.log('Tables:', tableNames);
  } catch (error) {
    console.error(
      'Failed to fetch table names:',
      JSON.stringify(error, null, 2),
    );
  }
};
