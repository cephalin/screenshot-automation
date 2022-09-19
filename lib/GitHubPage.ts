import { expect, Locator, Page, TestInfo } from "@playwright/test";
import { DocsPageBase } from "./DocsPageBase";
import fs from "fs";

/*****************************************************************************
 * GitHubPage class
 * - Collects common tasks on the GitHub site
 *****************************************************************************/
 export class GitHubPage extends DocsPageBase {
    repoUrl: string;

    constructor(page: Page, options?: {testInfo?: TestInfo, repoUrl?: string}){
        super(page, options?.testInfo);
        if(options?.repoUrl) {
            this.repoUrl = options?.repoUrl;
        }
    }

    async signin (): Promise<void> {

        if (fs.existsSync("auth.json")) {
            await this.page.goto('https://github.com');
            return;
        }

        if(!process.env.GITHUB_USER || !process.env.GITHUB_PASSWORD){
            throw new Error('Please specify the following environment variables: GITHUB_USER, GITHUB_PASSWORD.');
        }

        await this.page.goto('https://github.com/login');
        await expect(this.page).toHaveURL('https://github.com/login');
        await this.page.locator('input[name="login"]').click();
        await this.page.locator('input[name="login"]').type(process.env.GITHUB_USER);
        await this.page.locator('input[name="password"]').click();
        await this.page.locator('input[name="password"]').type(process.env.GITHUB_PASSWORD); 
        await this.page.locator('input:has-text("Sign in")').click();      
    }

    async createFork(repo: string, screenshotName?: string): Promise<void> {

        await this.page.goto(repo);

        var forkButtonSelector = `a[href="${repo.replace('https://github.com', '').replace(/\/$/, "")}/fork"]`; 

        // DEBUG: nothing to blur 
        if(screenshotName) { 
            await this.screenshot({
				width: 780, 
				height: 500, 
				highlightobjects: [
					this.page.locator(forkButtonSelector)
				], 
				name: screenshotName
			});
        }

        await this.page.locator(forkButtonSelector).click();
        await expect(this.page).toHaveURL(repo + '/fork');
        await this.page.locator('text=Create fork').click();

        if(process.env.GITHUB_USER) {
            var forkUrl = `https://github.com/${process.env.GITHUB_USER}/${repo.split('/').filter(Boolean).pop()}`;
            await expect(this.page).toHaveURL(forkUrl);
            this.repoUrl = forkUrl;
        }
    }

    async cancelWorkflow (screenshotName?: string): Promise<void> {
        
        if(screenshotName) {
            // DEBUG: nothing to blur
            await this.screenshot({
				width: 780, 
				height: 500, 
				highlightobjects: [
					this.page.locator('button.btn-danger:has-text("Cancel workflow")')
				], 
				name: screenshotName
			});
        }

        await this.page.locator('button.btn-danger:has-text("Cancel workflow")').click();
    }

    async openVSCode (options?: {clickCodeTab?: boolean, screenshotName?: string}): Promise<void> {

        options = options ? options : {};

        if(!this.repoUrl) {
            throw new Error('repoUrl is empty.')            
        }
        let highlighted: Locator[] = [];

        await this.page.goto(this.repoUrl);

        if(options.clickCodeTab) {
            highlighted.push(this.page.locator('#code-tab'));
            await this.page.locator('#code-tab').click();
        }

        // DEBUG: nothing to blur
        if(options.screenshotName) {
            await this.screenshot({
				height: 500, 
				highlightobjects: highlighted,
                pressenter: true,
				name: options.screenshotName
			});
        }

        await this.page.locator('body').press('.');
        await expect(this.page).toHaveURL(this.repoUrl.replace('github.com', 'github.dev'));
    }

    async openFileInVSC(filepath: string): Promise<{cleanSelector: string, dirtySelector: string}> {
        var selectpath = (new URL(this.repoUrl)).pathname.replace(/^\/|\/$/g, '');
        var parts = filepath.split('/').filter(Boolean);
        var file = parts.pop();

        for (const p of parts) {
            selectpath += '/' + p;
            await this.page.locator(`[id="workbench.parts.sidebar"] .pane-body .monaco-icon-label.folder-icon[title="${selectpath}"]`).click();
        }

        var fileSelector = `[id="workbench.parts.sidebar"] .pane-body .monaco-icon-label.file-icon[title^="${selectpath}/${file}"] .monaco-icon-name-container`;
        await this.page.locator(fileSelector).click();

        return {
            cleanSelector: fileSelector, 
            dirtySelector: `[id="workbench.parts.sidebar"] .pane-body .monaco-icon-label.file-icon[title^="${selectpath}/${file} • Modified"] .monaco-icon-name-container`
        };
    }

    /**
     * Functionality is very limited:
     * - Can choose to open a file first or not
     * - Modifies on a per-line bases
     * - Replacement line must be unique within the viewable window
     * - Can only highlight at the line level, can't exclude leading spaces, can't highlight block of lines, can't highlight line deletions
     * - Screenshot routine cannot highlight anything that's not within the immediate view of the window.
     * 
     * @param replaceSet 
     * @param options 
     */
    async modifyFileInVSC(replaceSet: {searchLine: string, replaceLine: string}[], options?: {filepath?: string, screenshotName?: string}): Promise<void> {

        options = options ? options : {};

        var fileSelectors;
        if(options.filepath) {
            fileSelectors = await this.openFileInVSC(options.filepath);
        }

        await this.page.locator('[id="workbench.parts.editor"] .editor-container .view-lines').click();
        await this.page.waitForTimeout(2000); // The FIND fastkey doesn't work without this wait    

        var highlighted: Locator[] = [];

        for (const r of replaceSet) {
            await this.page.locator('html').press('Control+f'); //(Window/Linux is Control+f)
            await this.page.locator('[aria-label="Find"]').fill(r.searchLine);
            await this.page.locator('[aria-label="Find"]').press('Enter');
            await this.page.locator('[aria-label="Close \\(Escape\\)"]').click();

            await this.typeInCodeEditor(r.replaceLine);
            highlighted.push(this.page.locator(`div.view-line span:has-text("${r.replaceLine}")`));
        }    
      
        // CSS changed on the file node after modification so select it now
        highlighted.push(this.page.locator(fileSelectors.dirtySelector));

        // DEBUG: nothing to blur
        if(options.screenshotName) {
            await this.screenshot({
                width: 1200,
				height: 700, 
				highlightobjects: highlighted,
				name: options.screenshotName
			});
        }
    }

    async viewFileInVSC(options?: {filepath?: string, searchString?: string, regex?: string, screenshotName?: string}): Promise<void> {

        options = options ? options : {};

        var fileSelectors;
        if(options.filepath) {
            fileSelectors = await this.openFileInVSC(options.filepath);
        }

        await this.page.locator('html').press('Control+,');
        await this.page.locator('html').type('selection highlight');
        await this.page.locator('.setting-value-checkbox[title="editor.selectionHighlight"]').click();
        await this.page.locator('.tab[title="Settings"] a.codicon-close').click();

        await this.page.locator('[id="workbench.parts.editor"] .editor-container .view-lines').click();
        await this.page.waitForTimeout(2000); // The FIND fastkey doesn't work without this wait

        await this.page.locator('html').press('Control+f'); //(Window/Linux is Control+f)
        if(options?.searchString){
            await this.page.locator('[aria-label="Find"]').fill(options.searchString);
        } else if(options?.regex){
            await this.page.locator('[aria-label="Find"]').press('Alt+r');
            await this.page.locator('[aria-label="Find"]').fill(options.regex);
        }
        // DEBUG: cycle through a few matches to get them in view
        await this.page.locator('[aria-label="Find"]').press('Enter');
        await this.page.locator('[aria-label="Find"]').press('Enter');
        await this.page.locator('[aria-label="Find"]').press('Enter');
        await this.page.locator('[aria-label="Find"]').press('Enter');
        await this.page.locator('[aria-label="Find"]').press('Enter');
        await this.page.locator('[aria-label="Find"]').press('Enter');
        await this.page.locator('[aria-label="Find"]').press('Enter');

        await this.page.locator('[aria-label="Find"]').press('Alt+Enter');
        await this.page.locator('[aria-label="Close \\(Escape\\)"]').click();

        // DEBUG: nothing to blur
        if(options.screenshotName) {
            await this.screenshot({
                width: 1200,
				height: 700, 
				highlightobjects: [
                    this.page.locator(fileSelectors.cleanSelector)
                ],
				name: options.screenshotName
			});
        }
    }

    private async typeInCodeEditor(code: string) {

        for (var i = 0; i < code.length; i++) {
            await this.page.keyboard.press(code.charAt(i));
        }  
    }

    async commitAllChangesInVSC(message: string, screenshotName?: string): Promise<void> {

        await this.page.locator('[id="workbench\.parts\.activitybar"] .action-item[aria-label^="Source Control (Ctrl+Shift+G)"]').click();
        await this.page.locator('[aria-label="Source Control Input"] .monaco-editor').click();
        await this.page.locator('[aria-label="Source Control Input"] .monaco-editor').type(message);
        await this.page.locator('text=Don\'t show again').click();      

        // DEBUG: manually blur
        await this.page.locator('[id="workbench.parts.editor"] .editor-container .view-lines').click();

        if(screenshotName) {
            await this.screenshot({
                width: 1200,
				height: 700, 
				highlightobjects: [
                    this.page.locator('[id="workbench\.parts\.activitybar"] .action-item[aria-label^="Source Control (Ctrl+Shift+G)"]'),
                    this.page.locator('[aria-label="Source Control Input"] .monaco-editor'),
                    this.page.locator('.composite.title [aria-label="Commit and Push"]')
                ],
				name: screenshotName
			});
        }

        await this.page.locator('.composite.title [aria-label="Commit and Push"]').click();
        await this.page.waitForTimeout(5000); // make sure commit finishes. need a better way to do this
    }

    async waitForActionRun(options?: {message?: string, screenshotName?: string}): Promise<void> {

        options = options ? options : {};

        if(!this.repoUrl) {
            throw new Error('repoUrl is empty.')            
        }
    
        var actionsUrl = `${this.repoUrl}/actions`;

        // Right now just go there directly if not already there.
        if(!this.page.url().startsWith(`${actionsUrl}/runs/`) && !options.message) {
            await this.page.goto(actionsUrl);
            await this.page.locator(`a:has-text("${options.message}")`).first().click();
            await this.page.waitForTimeout(3000);
        }

        if(options.screenshotName) {
            // DEBUG: nothing to blur
            await this.screenshot({
				height: 500, 
				name: options.screenshotName
			});
        }

        // while(await this.page.locator('button.btn-danger:has-text("Cancel workflow")').isVisible()) {
        //     await this.page.waitForTimeout(10000);
        // };
        await this.page.locator('summary.btn[role="button"]:has-text("Re-run all jobs")').click({trial: true});
    }

    async deleteFork() {
        await this.page.goto(`${this.repoUrl}/settings`);
        await this.page.locator('summary.btn-danger:has-text("Delete this repository")').click();
        await this.page.locator('[aria-label="Type in the name of the repository to confirm that you want to delete this repository."]').fill((new URL(this.repoUrl).pathname.substring(1)));
        await this.page.locator('button.btn-danger.btn.btn-block:has-text("Delete this repository")').click();      
    }
}
