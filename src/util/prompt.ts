import readline from 'readline';

const prompt = (message: string) => {
  const promptInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => {
    promptInterface.question(message, answer => {
      resolve(answer);
    });
  });
};

export { prompt };
