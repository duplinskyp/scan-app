const secretCodes = ['ABC123', 'XYZ456', 'QWE789'];
let currentIndex = 0;

export function getNextCode(): string {
  const code = secretCodes[currentIndex];
  currentIndex = (currentIndex + 1) % secretCodes.length;
  return code;
}
