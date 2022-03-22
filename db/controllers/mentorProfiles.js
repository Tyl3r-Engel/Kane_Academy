const { pool } = require('../pool');

const addMentorProfile = (mentor_id, about, cb) => {
  const queryString = `INSERT INTO mentor_profiles (mentor_id, about)
  VALUES ($1, $2)`;

  pool.query(queryString, [mentor_id, about], cb);
}

const queryMentorProfile = (mentor_id, cb) => {
  const queryString = `SELECT * FROM mentor_profiles WHERE mentor_id = $1 RETURNING *`

  pool.query(queryString, [mentor_id], cb)
}

const getMentorProfile = (mentor_id, cb) => {
  const queryString = `
  SELECT mp.about, users.id, users.mentor, users.first_name, users.last_name, users.email, (
    SELECT JSON_OBJECT_AGG(
      ms.id, JSON_BUILD_OBJECT(
        'id', ms.id,
        'skill_id', ms.skill_id,
        'skill', (SELECT name FROM skills WHERE ms.skill_id = skills.id),
        'price', ms.pricing
      )
    )
    FROM mentor_skills AS ms WHERE ms.mentor_id = mp.mentor_id
  ) as skills
  FROM mentor_profiles as mp
  LEFT JOIN users ON mp.mentor_id = users.id
  WHERE mp.mentor_id = $1`

  pool.query(queryString, [mentor_id], cb)
}

const updateMentorProfile = (mentor_id, about, cb) => {
  const queryString = `UPDATE mentor_profiles SET about = $2 WHERE mentor_id = $1`

  pool.query(queryString, [mentor_id, about], cb)
}

module.exports = {
  addMentorProfile, getMentorProfile, updateMentorProfile, queryMentorProfile
};
