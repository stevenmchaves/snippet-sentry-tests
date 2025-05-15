// global-setup.ts
import { FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
    // Set environment variables or perform other setup tasks
    process.env.TEST_ENV = 'regression';
    console.log('Global setup completed');
}

export default globalSetup;
