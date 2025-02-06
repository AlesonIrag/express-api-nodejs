"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.remove = exports.findByEmail = exports.findOne = exports.saveUsers = exports.getUsers = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const filePath = path_1.default.join(__dirname, "../users.json");
// 🟢 Read users from file
const getUsers = () => {
    if (!fs_1.default.existsSync(filePath))
        return [];
    return JSON.parse(fs_1.default.readFileSync(filePath, "utf-8"));
};
exports.getUsers = getUsers;
// 🟢 Save users to file
const saveUsers = (users) => {
    fs_1.default.writeFileSync(filePath, JSON.stringify(users, null, 2));
};
exports.saveUsers = saveUsers;
// 🟢 Find a user by ID
const findOne = (id) => {
    return (0, exports.getUsers)().find(user => user.id === id);
};
exports.findOne = findOne;
// 🟢 Find a user by email
const findByEmail = (email) => {
    return (0, exports.getUsers)().find(user => user.email === email);
};
exports.findByEmail = findByEmail;
// 🟢 Remove a user by ID
const remove = (id) => {
    const users = (0, exports.getUsers)().filter(user => user.id !== id);
    (0, exports.saveUsers)(users);
};
exports.remove = remove;
// 🟢 Update a user by ID
const update = (id, updatedUser) => {
    const users = (0, exports.getUsers)().map(user => (user.id === id ? updatedUser : user));
    (0, exports.saveUsers)(users);
};
exports.update = update;
