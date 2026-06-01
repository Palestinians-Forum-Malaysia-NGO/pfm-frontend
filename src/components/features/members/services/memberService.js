const delay = (ms) => new Promise((r) => setTimeout(r, ms));

let MEMBERS = [
  { id: 1,  name: "Ahmad Faris bin Abdullah",  email: "ahmad.faris@email.com",   phone: "+60123456789", ic_number: "900101-14-1234", membership_type: "regular",   is_active: true,  joined_date: "2023-01-15", nationality: "Malaysian" },
  { id: 2,  name: "Siti Fatimah binti Yusof",  email: "siti.fatimah@email.com",  phone: "+60134567890", ic_number: "950215-10-5678", membership_type: "student",   is_active: true,  joined_date: "2023-03-20", nationality: "Malaysian" },
  { id: 3,  name: "Muhammad Al-Amin",           email: "alamin@email.com",        phone: "+60145678901", ic_number: "PA123456",       membership_type: "regular",   is_active: true,  joined_date: "2023-05-10", nationality: "Palestinian" },
  { id: 4,  name: "Nurul Huda binti Ismail",   email: "nurul.huda@email.com",    phone: "+60156789012", ic_number: "880320-08-9012", membership_type: "lifetime",  is_active: true,  joined_date: "2022-11-05", nationality: "Malaysian" },
  { id: 5,  name: "Yusuf Ibrahim Al-Khalidi",  email: "yusuf.khalidi@email.com", phone: "+60167890123", ic_number: "PA654321",       membership_type: "honorary",  is_active: true,  joined_date: "2022-06-18", nationality: "Palestinian" },
  { id: 6,  name: "Aishah binti Razak",        email: "aishah.razak@email.com",  phone: "+60178901234", ic_number: "010405-12-3456", membership_type: "student",   is_active: false, joined_date: "2023-08-01", nationality: "Malaysian" },
  { id: 7,  name: "Hassan Mahmoud Barakat",    email: "hassan.barakat@email.com",phone: "+60189012345", ic_number: "PA789012",       membership_type: "regular",   is_active: true,  joined_date: "2023-09-14", nationality: "Palestinian" },
  { id: 8,  name: "Zainab binti Ahmad",        email: "zainab.ahmad@email.com",  phone: "+60190123456", ic_number: "750812-07-7890", membership_type: "lifetime",  is_active: true,  joined_date: "2021-03-22", nationality: "Malaysian" },
  { id: 9,  name: "Omar Saeed Al-Najjar",      email: "omar.najjar@email.com",   phone: "+60112345678", ic_number: "PA345678",       membership_type: "regular",   is_active: false, joined_date: "2024-01-08", nationality: "Palestinian" },
  { id: 10, name: "Rohani binti Hamid",        email: "rohani.hamid@email.com",  phone: "+60123456780", ic_number: "820930-06-4321", membership_type: "honorary",  is_active: true,  joined_date: "2022-02-14", nationality: "Malaysian" },
];

let nextId = 11;

export const memberService = {
  async getAll() {
    await delay(350);
    return [...MEMBERS];
  },

  async getById(id) {
    await delay(200);
    return MEMBERS.find((m) => m.id === Number(id)) ?? null;
  },

  async create(data) {
    await delay(400);
    const member = {
      id: nextId++,
      joined_date: new Date().toISOString().split("T")[0],
      ...data,
    };
    MEMBERS = [...MEMBERS, member];
    return member;
  },

  async update(id, data) {
    await delay(400);
    MEMBERS = MEMBERS.map((m) => (m.id === Number(id) ? { ...m, ...data } : m));
    return MEMBERS.find((m) => m.id === Number(id));
  },

  async remove(id) {
    await delay(300);
    MEMBERS = MEMBERS.filter((m) => m.id !== Number(id));
  },
};
