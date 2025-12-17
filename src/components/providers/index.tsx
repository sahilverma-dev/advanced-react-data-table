import { NuqsAdapter } from "nuqs/adapters/react";

const Providers = ({ children }: React.PropsWithChildren) => {
  return <NuqsAdapter>{children}</NuqsAdapter>;
};

export default Providers;
