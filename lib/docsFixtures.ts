/*****************************************************************************
 * The test harness used by docs related pages. Any new page class should be 
 * wired up here so it can be directly accessed from a test without needing to
 * set it up there.
 *****************************************************************************/
import { test as base } from '@playwright/test';
import { AzurePortalPage } from './AzurePortalPage';
import { GitHubPage } from './GitHubPage';

// Declare the types of your fixtures.
type MyFixtures = {
    azPage: AzurePortalPage;
    githubPage: GitHubPage;
};

export const test = base.extend<MyFixtures>({
    azPage: async ({ context }, use, testInfo) => {
        // Set up the fixture.
        const azPage = new AzurePortalPage(await context.newPage(), testInfo);
        await azPage.signin();
    
        // Use the fixture value in the test.
        await use(azPage);
    },
    githubPage: async ({ context }, use, testInfo) => {
        // Set up the fixture.
        const githubPage = new GitHubPage(await context.newPage(), {testInfo: testInfo});
        await githubPage.signin();

        // Use the fixture value in the test.
        await use(githubPage);
    },

});