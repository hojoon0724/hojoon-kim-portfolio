import type { UserInterface } from "./user";

export interface SessionStorage {
  key: string;
  user: UserInterface;
  easterEggsFound: string[];
  loggedIn: boolean;
  createdAt: Date;
}
