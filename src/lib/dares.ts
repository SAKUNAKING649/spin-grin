export type Dare = {
  label: string; // full sentence template using {loser} and {winner}
  short: string; // short label on wheel
};

export const DARES: Dare[] = [
  { short: "Hug", label: "{loser} gives {winner} a big warm hug 🤗" },
  { short: "Kiss", label: "{loser} gives {winner} a sweet kiss 💋" },
  { short: "Slap", label: "{loser} playfully slaps {winner} 🖐️" },
  { short: "Compliment", label: "{loser} pays {winner} an over-the-top compliment ✨" },
  { short: "Selfie", label: "{loser} takes a goofy selfie with {winner} 📸" },
  { short: "Serenade", label: "{loser} sings 10 seconds of a love song to {winner} 🎤" },
  { short: "Dance", label: "{loser} performs a 15-second dance for {winner} 💃" },
  { short: "Snack run", label: "{loser} owes {winner} a snack of their choice 🍫" },
];

export const fillTemplate = (template: string, loser: string, winner: string) =>
  template.replaceAll("{loser}", loser).replaceAll("{winner}", winner);
