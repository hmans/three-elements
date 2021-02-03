export const dasherize = (str: string) =>
  str
    .replace(/([A-Za-z0-9])([A-Z][a-z])/g, "$1-$2")
    .replace(/_/g, "-")
    .toLowerCase()
