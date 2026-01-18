export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // eliminar acentos
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function generateUniqueSlug(
  name: string,
  existingSlugCheck: (slug: string) => Promise<boolean>
): Promise<string> {
  let slug = generateSlug(name);
  let counter = 1;
  
  while (await existingSlugCheck(slug)) {
    slug = `${generateSlug(name)}-${counter}`;
    counter++;
  }
  
  return slug;
}
