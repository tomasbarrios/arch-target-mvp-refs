function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    console.log(`Attempted to add an invalid URL: ${url}`);
    return false;
  }
}

export function validateURLString(urlString: string): boolean {
  // Split the string by newline separator
  const urls = urlString.split("\n");
  console.log("URLS", { urls });

  // Validate each URL
  for (const url of urls) {
    if (!isValidURL(url.trim())) {
      return false;
    }
  }

  return true;
}
