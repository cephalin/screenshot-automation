import { Page, TestInfo, expect } from "@playwright/test";
import { DocsPageBase } from "./DocsPageBase";

/*****************************************************************************
 * AppServiceScmPage
 * - Common tasks on the SCM page (https://<appname>.scm.azurewebsites.net) 
 *****************************************************************************/
 export class AppServiceScmPage extends DocsPageBase {
    rootUrl?: string;

    constructor(page: Page, options?: {rootUrl?: string, testInfo?: TestInfo}) {
        super(page, options?.testInfo);
        this.rootUrl = options?.rootUrl;
    }

    /**
     * 
     * @param commands 
     * Array of commands and their timeouts
     *   @param command
     *   the command string.
     *   @param timeout
     *   timeout to wait after a command. default is 2000 ms
     * @param options 
     * Optional parameters
     */
    async runSshShellCommands(
        commands: {command: string, timeout?: number}[], 
        options?: {
            width?: number, 
            height?: number,
            screenshotName?: string
        }
    ): Promise<void> {
    
        options = options ? options : {};
        options.width = options.width ? options.width : 780;
        options.height = options.height ? options.height : 700;

        // Make sure we're in the browser SSH shell of an app
        await this.page.waitForLoadState();
        await expect(this.page).toHaveURL(new RegExp(/^https:\/\/(\w|-)+.scm.azurewebsites.net\/webssh\/host$/));

        while((await this.page.locator('div#status').innerText()) != "SSH CONNECTION ESTABLISHED") {
            await this.page.waitForTimeout(5000);
        };

        for (const c of commands) {
            await this.executeInShell(this.page.locator('textarea.xterm-helper-textarea'), c.command);
            if(c.timeout) {
                await this.page.waitForTimeout(c.timeout);
            } else {
                await this.page.waitForTimeout(2000);
            }     
        }
    
        if(options.screenshotName){
            // DEBUG: no need to blur
            await this.screenshot({
                width: options.width,
                height: options.height, 
                name: options.screenshotName
            });    
        }
    }

    private async executeInShell(shell, command) {
        for (var i = 0; i < command.length; i++) {
          await shell.press(command.charAt(i));
        }
        await shell.press("Enter");
    }

    async goToDeployments( options?:{
        screenshotBefore?: string,
        screenshotAfter?: string
    }): Promise<void> {

        if(!this.rootUrl) {
            throw new Error ('Expected rootUrl to be set');
        }
        this.page.goto(this.rootUrl);

        if(options?.screenshotAfter){
            // DEBUG: no need to blur
            await this.screenshot({
                highlightobjects: [
                    this.page.locator('a[href="api/deployments"]')
                ],
                height: 600, 
                name: options?.screenshotBefore
            });
        }

        this.page.locator('a[href="api/deployments"]').click();

        if(options?.screenshotAfter){
            // DEBUG: no need to blur
            await this.screenshot({
                height: 600, 
                name: options?.screenshotBefore
            });
        }

    }

    async browseFilesLinux(options?: {
        screenshotBefore?: string,
        screenshotAfter?: string
    }): Promise<void> {

        if(!this.rootUrl) {
            throw new Error ('Expected rootUrl to be set');
        }
        this.page.goto(this.rootUrl);

        if(options?.screenshotBefore){
            // DEBUG: no need to blur
            await this.screenshot({
                highlightobjects: [
                    this.page.locator('a[href="wwwroot"]')
                ],
                height: 600, 
                name: options?.screenshotBefore
            });
        }

        this.page.locator('a[href="wwwroot"]').click();

        if(options?.screenshotAfter){
            // DEBUG: no need to blur
            await this.screenshot({
                height: 600, 
                name: options?.screenshotAfter
            });
        }
    }
}
