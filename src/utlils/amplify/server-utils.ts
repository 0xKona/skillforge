import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { amplifyConfig } from "@/configs/amplify.config";

export const { runWithAmplifyServerContext } = createServerRunner({
  config: amplifyConfig,
});