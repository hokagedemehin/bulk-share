import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import outputs from "@/amplify_outputs.json";

export const { runWithAmplifyServerContext } = createServerRunner({
  config: outputs,

  runtimeOptions: {
    cookies: {
      domain: "", // making cookies available to all subdomains
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    },
  },
});
