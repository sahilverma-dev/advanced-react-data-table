import { NuqsAdapter } from "nuqs/adapters/react";
import { Toaster } from "sonner";

const Providers = ({ children }: React.PropsWithChildren) => {
  return (
    <NuqsAdapter>
      {children}
      <Toaster richColors />
    </NuqsAdapter>
  );
};

export default Providers;
