import { configureAllowedScripts } from "@ministryofjustice/hmpps-npm-script-allowlist";

export default configureAllowedScripts({
  allowlist: {
    // ESBuild is written in GoLang - this is needed to download prebuilt binaries for the specific platform
    "node_modules/esbuild@0.28.0": "ALLOW",
    // Needed by jest for running tests in watch mode
    "node_modules/fsevents@2.3.2": "ALLOW",
    // Need by playwright for detecting file system changes during test runs
    "node_modules/tsx/node_modules/fsevents@2.3.3": "ALLOW",
  },
});
