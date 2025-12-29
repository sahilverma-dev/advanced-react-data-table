import { faker } from "@faker-js/faker";
import type { User } from "../types/product";

export const users: User[] = Array.from({ length: 20 }, () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
    id: faker.string.uuid(),
    name: `${firstName} ${lastName}`,
    avatarUrl: faker.image.avatar(),
    role: faker.helpers.arrayElement(["Admin", "Editor", "Viewer"]),
    email: faker.internet.email({ firstName, lastName }),
  };
});
