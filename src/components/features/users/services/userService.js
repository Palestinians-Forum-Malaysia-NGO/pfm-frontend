const delay = (ms) => new Promise((r) => setTimeout(r, ms));

let USERS = [
  { id: 1, name: "Adnan Madi",       email: "adnan@pfm.org.my",   role: "admin",           is_active: true,  created_at: "2024-01-10" },
  { id: 2, name: "Sara Ibrahim",     email: "sara@pfm.org.my",    role: "account_manager", is_active: true,  created_at: "2024-02-15" },
  { id: 3, name: "Khalid Al-Rashid", email: "khalid@pfm.org.my",  role: "account_manager", is_active: false, created_at: "2024-03-01" },
  { id: 4, name: "Layla Hassan",     email: "layla@pfm.org.my",   role: "account_manager", is_active: true,  created_at: "2024-03-20" },
  { id: 5, name: "Omar Mansour",     email: "omar@pfm.org.my",    role: "admin",           is_active: true,  created_at: "2024-04-05" },
  { id: 6, name: "Nour Al-Amin",    email: "nour@pfm.org.my",    role: "account_manager", is_active: false, created_at: "2024-05-12" },
];

let nextId = 7;

export const userService = {
  async getAll() {
    await delay(350);
    return [...USERS];
  },

  async getById(id) {
    await delay(200);
    return USERS.find((u) => u.id === Number(id)) ?? null;
  },

  async create(data) {
    await delay(400);
    const user = {
      id: nextId++,
      created_at: new Date().toISOString().split("T")[0],
      ...data,
    };
    USERS = [...USERS, user];
    return user;
  },

  async update(id, data) {
    await delay(400);
    USERS = USERS.map((u) => (u.id === Number(id) ? { ...u, ...data } : u));
    return USERS.find((u) => u.id === Number(id));
  },

  async remove(id) {
    await delay(300);
    USERS = USERS.filter((u) => u.id !== Number(id));
  },
};
