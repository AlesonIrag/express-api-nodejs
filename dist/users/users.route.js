"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_database_1 = require("./user.database");
const router = express_1.default.Router();
// 🟢 GET all users
router.get("/users", (req, res) => {
    const users = (0, user_database_1.getUsers)();
    if (!users.length) {
        return res.status(404).json({ error: "No users found" });
    }
    res.status(200).json({ totalUsers: users.length, users });
});
// 🟢 GET a single user by ID
router.get("/user/:id", (req, res) => {
    const user = (0, user_database_1.findOne)(req.params.id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
});
// 🟢 REGISTER a new user
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }
    if ((0, user_database_1.findByEmail)(email)) {
        return res.status(400).json({ error: "Email is already registered" });
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const newUser = {
        id: (0, uuid_1.v4)(),
        username,
        email,
        password: hashedPassword,
    };
    const users = (0, user_database_1.getUsers)();
    users.push(newUser);
    (0, user_database_1.saveUsers)(users);
    res.status(201).json({ newUser });
}));
// 🟢 LOGIN a user
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }
    const user = (0, user_database_1.findByEmail)(email);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    const isMatch = yield bcryptjs_1.default.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
    }
    res.status(200).json({ user });
}));
// 🟢 UPDATE a user by ID
router.put("/user/:id", (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }
    let users = (0, user_database_1.getUsers)();
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
        return res.status(404).json({ error: "User not found" });
    }
    users[userIndex] = Object.assign(Object.assign({}, users[userIndex]), { username, email, password });
    (0, user_database_1.saveUsers)(users);
    res.status(200).json({ updatedUser: users[userIndex] });
});
// 🟢 DELETE a user by ID
router.delete("/user/:id", (req, res) => {
    const user = (0, user_database_1.findOne)(req.params.id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    (0, user_database_1.remove)(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
});
exports.default = router;
