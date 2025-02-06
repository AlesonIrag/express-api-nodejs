import fs from "fs";
import path from "path";
import { User } from "./user.interface";

const filePath = path.join(__dirname, "../users.json");

/*  
// Tig read sa user
*/

export const getUsers = (): User[] => {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};
/*  
// Tig save sa user file
*/
export const saveUsers = (users: User[]): void => {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
};
/*  
// Tig find sa user gamit ID
*/
export const findOne = (id: string): User | undefined => {
  return getUsers().find(user => user.id === id);
};
/*  
// TIG FIND sa user gamit Email
*/
export const findByEmail = (email: string): User | undefined => {
  return getUsers().find(user => user.email === email);
};
/*  
// delete or remove sa user gamit ID
*/
export const remove = (id: string): void => {
  const users = getUsers().filter(user => user.id !== id);
  saveUsers(users);
};
/*  
// Update SA USER gamit sad ID 
*/
export const update = (id: string, updatedUser: User): void => {
  const users = getUsers().map(user => (user.id === id ? updatedUser : user));
  saveUsers(users);
};
