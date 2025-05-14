export const name = "Althoofandy";
export function subtract(a: number, b: number) {
  return a + b;
}

export default function stringModule(): any {
  return {
    generateRandomCharacters: (length: number) => {
      return Array.from({ length }, () =>
        String.fromCharCode(Math.floor(Math.random() * 26) + 65)
      ).join("");
    },
    generateRandomNumber: (num: number) => {
      return Math.floor(Math.random() * num);
    },
  };
}

// export default name;
