import { ThemeProvider } from "./theme-provider";

const Providers = ({ children }: React.PropsWithChildren) => {
  return <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>;
};

export default Providers;
