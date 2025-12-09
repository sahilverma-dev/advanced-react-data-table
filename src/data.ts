import { faker } from "@faker-js/faker";

export type Person = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: "Active" | "Inactive" | "Pending" | "Archived";
  role: "Admin" | "User" | "Guest";
  age: number;
  visits: number;
  progress: number;
  createdAt: Date;
  lastSeen: Date;
};

export type PersonKeys = keyof Person;

export function generateData(count: number): Person[] {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    status: faker.helpers.arrayElement([
      "Active",
      "Inactive",
      "Pending",
      "Archived",
    ]),
    role: faker.helpers.arrayElement(["Admin", "User", "Guest"]),
    age: faker.number.int({ min: 18, max: 80 }),
    visits: faker.number.int({ min: 0, max: 1000 }),
    progress: faker.number.int({ min: 0, max: 100 }),
    createdAt: faker.date.past({ years: 2 }),
    lastSeen: faker.date.recent(),
  }));
}
