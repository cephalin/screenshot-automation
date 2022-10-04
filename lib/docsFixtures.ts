/*****************************************************************************
 * The test harness used by docs related pages. Any new page class should be 
 * wired up here so it can be directly accessed from a test without needing to
 * set it up there.
 *****************************************************************************/
import { test as base } from '@playwright/test';
import { AzurePortalPage } from './AzurePortalPage';
import { AzurePortalPageChinese } from './AzurePortalPageChinese';
import { GitHubPage } from './GitHubPage';
import { GitHubPageChinese } from './GitHubPageChinese';

// Declare the types of your fixtures.
type MyFixtures = {
    azPage: AzurePortalPage;
    azPageCn: AzurePortalPageChinese;
    githubPage: GitHubPage;
    githubPageCn: GitHubPageChinese;
};

export const test = base.extend<MyFixtures>({
    azPage: async ({ context }, use, testInfo) => {
        // Set up the fixture.
        const azPage = new AzurePortalPage(await context.newPage(), testInfo);
        await azPage.signin();
    
        // Use the fixture value in the test.
        await use(azPage);
    },
    azPageCn: async ({ context }, use, testInfo) => {
        // Set up the fixture.
        const azPageCn = new AzurePortalPageChinese(await context.newPage(), testInfo);
        await azPageCn.signin();
    
        // Use the fixture value in the test.
        await use(azPageCn);
    },
    githubPage: async ({ context }, use, testInfo) => {
        // Set up the fixture.
        const githubPage = new GitHubPage(await context.newPage(), {testInfo: testInfo});
        await githubPage.signin();

        // Use the fixture value in the test.
        await use(githubPage);
    },
    githubPageCn: async ({ context }, use, testInfo) => {
        // Set up the fixture.
        const githubPageCn = new GitHubPageChinese(await context.newPage(), {testInfo: testInfo});
        await githubPageCn.signin();

        // Use the fixture value in the test.
        await use(githubPageCn);
    },

});

export { expect } from '@playwright/test';