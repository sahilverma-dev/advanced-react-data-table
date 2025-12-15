import { ThemeProvider } from "./theme-provider";

import { NuqsAdapter } from "nuqs/adapters/react";

const Providers = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      <NuqsAdapter>
        <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
      </NuqsAdapter>
    </>
  );
};

export default Providers;
