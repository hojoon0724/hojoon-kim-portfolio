export const easterEggs = {
  join: {name: "Join?", description: "Tried to join",message: "Come on. You think I built a fake platform just to collect your email? You’re logged in. Go spend money."},
  xfer: {name: "Cash Out", description: "Tried to transfer money out",message: "Where are you gonna transfer this very real fake money to?"},
  broke: {name: "Broke", description: "Broke",message: "Congrats, you broke"},
  millionaire: {name: "Millionaire", description: "One Million Dollars",message: "Oh wow, you're a millionaire. That's middle class nowadays."},
  indexFund: {name: "Index Fund", description: "Invested in every artist",message: "Typical Warren move"},
  favoritedAll: {name: "I like them all", description: "Favorited every artist",message: "Why tho?"},
  sweep: {name: "Sweep", description: "Bought an entire offering",message: "Diversification? Who is she?"},
  verify: {name: "Verify Me", description: "Tried identity verification",message: "I already know who you are, Warren"},
  changedName: {name: "Name Change", description: "Tried to change your name",message: "Your name is Warren, Warren."},
  forgotPassword: {name: "Forgot Password", description: "What password?",message: "You never had one."}
};

export type EasterEggId = keyof typeof easterEggs;
export type EasterEgg = (typeof easterEggs)[EasterEggId];
