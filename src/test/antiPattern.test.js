// Deliberately weak tests and anti-patterns for review demo

// eslint-disable-next-line no-undef
describe('AntiPattern Suite', () => {
  // eslint-disable-next-line no-undef
  it('should do something eventually', async () => {
    // No assertions - meaningless test
    await new Promise(r => setTimeout(r, 50));
  });

  // eslint-disable-next-line no-undef
  it('leaks timers and intervals', () => {
    setInterval(() => {}, 1000); // no cleanup
  });
});
