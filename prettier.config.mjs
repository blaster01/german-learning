/** @type {import("prettier").Config} */
const config = {
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  // Respect whatever line ending is already in the file (this repo is
  // developed on both Windows and CI/*nix) instead of forcing LF, which
  // would otherwise make every file appear "unformatted" on Windows.
  endOfLine: "auto",
  plugins: ["prettier-plugin-tailwindcss"],
};

export default config;
