export function createPageUrl(name) {
  if (!name) return '/';
  if (name === 'Home') return '/';
  return `/${name}`;
}

