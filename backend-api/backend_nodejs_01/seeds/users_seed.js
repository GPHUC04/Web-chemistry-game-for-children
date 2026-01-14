const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");

// Hàm tạo mật khẩu đã mã hóa
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Hàm tạo dữ liệu người dùng giả lập
function createUser() {
  return {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: hashPassword("Password123!"), // Mật khẩu mặc định
    date_of_birth: faker.date.past({ years: 18 }).toISOString().split("T")[0],
    school: faker.company.name(),
    grade_level: faker.helpers.arrayElement([
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "university",
      "other",
    ]),
    total_score: faker.number.int({ min: 0, max: 1000 }),
    total_games_played: faker.number.int({ min: 0, max: 100 }),
    level: faker.number.int({ min: 1, max: 10 }),
    experience_points: faker.number.int({ min: 0, max: 5000 }),
    created_at: faker.date.recent({ days: 30 }).toISOString(),
    updated_at: faker.date.recent({ days: 30 }).toISOString(),
    last_login: faker.date.recent({ days: 7 }).toISOString(),
    is_active: faker.datatype.boolean(),
    preferred_language: faker.helpers.arrayElement(["vi", "en"]),
  };
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
exports.seed = async function (knex) {
  // Xóa toàn bộ dữ liệu trong bảng users trước khi seed
  await knex("users").del();

  // Tạo mảng 100 bản ghi và chèn vào bảng users
  const users = await Promise.all(
    Array(100)
      .fill()
      .map(async () => {
        const user = await createUser();
        return {
          ...user,
          password: await user.password, // Đợi mã hóa mật khẩu
        };
      })
  );

  await knex("users").insert(users);
};
