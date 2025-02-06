import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { getUsers, saveUsers, findOne, findByEmail, remove, update } from "./user.database";
import { User } from "./user.interface";

const router: Router = Router();

/*
// tig get tanan user, if ever mo request ka 
*/
router.get("/users", (req: Request, res: Response): void => {
  const users = getUsers();
  if (!users.length) {
    res.status(404).json({ error: "No users found" });
    return;
  }
  res.status(200).json({ totalUsers: users.length, users });
});
/*
// tig get sa user gamit ID
*/
router.get("/user/:id", (req: Request, res: Response): void => {
  const user = findOne(req.params.id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.status(200).json(user);
});
/*
// register og bago user 
*/
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  console.log("Received POST request to /register"); //  Log request received
  console.log("Request body:", req.body); //  Log request body

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    console.log("Validation failed: Missing fields");
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  if (findByEmail(email)) {
    console.log("Validation failed: Email already exists");
    res.status(400).json({ error: "Email is already registered" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser: User = {
    id: uuidv4(),
    username,
    email,
    password: hashedPassword,
  };

  const users = getUsers();
  users.push(newUser);
  saveUsers(users);

  console.log("User registered successfully:", newUser);
  res.status(201).json({ newUser });
});

/*
// login ug user 
*/
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const user = findByEmail(email);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(400).json({ error: "Invalid credentials" });
    return;
  }

  res.status(200).json({ user });
});
/*
// tig update sa user gamit ID
*/
router.put("/user/:id", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  let users = getUsers();
  const userIndex = users.findIndex(user => user.id === id);

  if (userIndex === -1) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users[userIndex] = { ...users[userIndex], username, email, password: hashedPassword };
  saveUsers(users);

  res.status(200).json({ updatedUser: users[userIndex] });
});
/*
// Delete sa user gamit ID
*/
router.delete("/user/:id", (req: Request, res: Response): void => {
  const user = findOne(req.params.id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  remove(req.params.id);
  res.status(200).json({ message: "User deleted successfully" });
});

export default router;
