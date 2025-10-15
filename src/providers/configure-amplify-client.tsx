"use client";

import { amplifyConfig } from "@/configs/amplify.config";
import { Amplify } from "aws-amplify";

Amplify.configure({ ...amplifyConfig }, { ssr: true });

export default function ConfigureAmplifyClientSide() {
  return null;
}