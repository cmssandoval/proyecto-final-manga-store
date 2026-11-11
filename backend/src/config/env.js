if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET missing or shorter than 32 chars');
}
if (!process.env.FRONTEND_URL) {
  console.error('FRONTEND_URL missing, you can only use non-browser clients!');
}