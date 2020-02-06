const timeout = (ms: number) => new Promise(res => setTimeout(res, ms));

export { timeout };
