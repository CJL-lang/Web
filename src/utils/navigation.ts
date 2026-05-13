const lastPathBySectionPath = new Map<string, string>();

export function isWithinNavSection(pathname: string, sectionPath: string) {
  return pathname === sectionPath || pathname.startsWith(`${sectionPath}/`);
}

export function rememberNavSectionPath(
  pathname: string,
  sectionPaths: readonly string[],
) {
  const sectionPath = sectionPaths.find((path) =>
    isWithinNavSection(pathname, path),
  );

  if (sectionPath) {
    lastPathBySectionPath.set(sectionPath, pathname);
  }
}

export function getNavTargetPath(pathname: string, sectionPath: string) {
  if (isWithinNavSection(pathname, sectionPath)) {
    return sectionPath;
  }

  return lastPathBySectionPath.get(sectionPath) ?? sectionPath;
}
