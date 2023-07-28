const core = require('@actions/core');
import { Post } from './src/post.js';
import log4js from 'log4js';

async function main() {
  log4js.configure({
    appenders: {
      console: {
        type: 'console'
      }
    },
    categories: {
      default: { appenders: ['console'], level: 'info' }
    }
  });

  let logger = log4js.getLogger()
  logger.log('Starting post creation')

  const templatePath = core.getInput('template-file');
  const outputPath = core.getInput('output-path');
  const openaiAPIKey = core.getInput('openai-api-key');

  let post = new Post(templatePath, outputPath, openaiAPIKey)
  try {
    await post.create()
  } catch (error) {
    core.setFailed(error.message);
  }
}

main()