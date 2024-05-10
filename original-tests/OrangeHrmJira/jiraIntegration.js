import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import FormData from 'form-data';

// Load environment variables
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class JiraIntegration {
    constructor() {
        this.jiraBaseUrl = process.env.JIRA_BASE_URL;
        this.jiraEmail = process.env.JIRA_EMAIL;
        this.jiraApiToken = process.env.JIRA_API_TOKEN;
        this.projectKey = process.env.JIRA_PROJECT_KEY;
    }

    getAuthHeader() {
        const auth = Buffer.from(`${this.jiraEmail}:${this.jiraApiToken}`).toString('base64');
        return {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json'
        };
    }

    async attachFileToIssue(issueKey, filePath, fileName) {
        try {
            console.log(`Attempting to attach ${fileName} to Jira issue ${issueKey}`);

            // Read the file as a Buffer
            const fileData = await fs.promises.readFile(filePath);

            // Create form data
            const form = new FormData();
            form.append('file', fileData, {
                filename: fileName,
                contentType: fileName.endsWith('.html') ? 'text/html' : 'text/csv'
            });

            // Attach the file to the issue
            const response = await axios.post(
                `${this.jiraBaseUrl}/rest/api/3/issue/${issueKey}/attachments`,
                form,
                {
                    headers: {
                        ...this.getAuthHeader(),
                        'X-Atlassian-Token': 'no-check',
                        ...form.getHeaders()
                    },
                    validateStatus: false
                }
            );

            if (response.status !== 200 && response.status !== 201) {
                console.error(`Failed to attach ${fileName}:`, response.status, response.data);
                throw new Error(`Failed to attach ${fileName}: ${response.status}`);
            }

            console.log(`Successfully attached ${fileName} to Jira issue ${issueKey}`);
            return response.data;
        } catch (error) {
            console.error(`Error attaching ${fileName} to Jira:`, error.message);
            throw error;
        }
    }

    async updateTestResult(issueKey, status, comment) {
        try {
            console.log(`Attempting to update Jira issue ${issueKey} with status ${status}`);

            // First add the comment
            const commentResponse = await this.addComment(issueKey, comment);

            // Then update the status
            await this.updateIssueStatus(issueKey, status);

            // Create reports directory if it doesn't exist
            const reportsDir = path.join(__dirname, 'reports');
            if (!fs.existsSync(reportsDir)) {
                fs.mkdirSync(reportsDir, { recursive: true });
            }

            // Attach the HTML report
            const htmlReportPath = path.join(reportsDir, 'cucumber_report.html');
            if (fs.existsSync(htmlReportPath)) {
                console.log('Attaching HTML report...');
                await this.attachFileToIssue(issueKey, htmlReportPath, 'cucumber_report.html');
            } else {
                console.warn('HTML report file not found');
            }

            // Attach the CSV report
            const csvReportPath = path.join(reportsDir, 'test_results.csv');
            if (fs.existsSync(csvReportPath)) {
                console.log('Attaching CSV report...');
                await this.attachFileToIssue(issueKey, csvReportPath, 'test_results.csv');
            } else {
                console.warn('CSV report file not found');
            }

            console.log(`Successfully updated Jira issue ${issueKey} with test result: ${status}`);
            return commentResponse;
        } catch (error) {
            console.error('Error updating Jira:', error.message);
            throw error;
        }
    }

    async generateAndAttachCSVReport(issueKey, csvPath) {
        try {
            // Read the cucumber JSON report
            const jsonReportPath = path.join(__dirname, 'reports', 'cucumber_report.json');
            const jsonReport = JSON.parse(await fs.promises.readFile(jsonReportPath, 'utf8'));

            // Convert to CSV format
            let csvContent = 'Feature,Scenario,Status,Duration\n';

            jsonReport.forEach(feature => {
                feature.elements.forEach(scenario => {
                    const duration = scenario.steps.reduce((total, step) =>
                        total + (step.result.duration || 0), 0) / 1e9; // Convert to seconds

                    csvContent += `"${feature.name}","${scenario.name}","${scenario.result.status}","${duration.toFixed(2)}s"\n`;
                });
            });

            // Write CSV file
            await fs.promises.writeFile(csvPath, csvContent);

            // Attach to Jira
            await this.attachFileToIssue(issueKey, csvPath, 'test_results.csv');
        } catch (error) {
            console.error('Error generating/attaching CSV report:', error.message);
            throw error;
        }
    }

    async addComment(issueKey, comment) {
        const commentData = {
            body: {
                type: "doc",
                version: 1,
                content: [
                    {
                        type: "paragraph",
                        content: [
                            {
                                text: comment,
                                type: "text"
                            }
                        ]
                    }
                ]
            }
        };

        const response = await axios.post(
            `${this.jiraBaseUrl}/rest/api/3/issue/${issueKey}/comment`,
            commentData,
            {
                headers: this.getAuthHeader(),
                validateStatus: false
            }
        );

        if (response.status !== 201 && response.status !== 200) {
            throw new Error(`Failed to add comment: ${response.status}`);
        }

        return response.data;
    }

    async updateIssueStatus(issueKey, status) {
        try {
            // First get available transitions
            const transitionsResponse = await axios.get(
                `${this.jiraBaseUrl}/rest/api/3/issue/${issueKey}/transitions`,
                { headers: this.getAuthHeader() }
            );

            const transitions = transitionsResponse.data.transitions;
            const transition = transitions.find(t => t.name.toLowerCase() === status.toLowerCase());

            if (transition) {
                // Perform the transition
                await axios.post(
                    `${this.jiraBaseUrl}/rest/api/3/issue/${issueKey}/transitions`,
                    {
                        transition: { id: transition.id }
                    },
                    { headers: this.getAuthHeader() }
                );
            } else {
                console.warn(`No transition found for status: ${status}`);
            }
        } catch (error) {
            console.error('Error updating issue status:', error.message);
            throw error;
        }
    }

    mapStatusToJira(cucumberStatus) {
        switch (cucumberStatus.toLowerCase()) {
            case 'passed':
                return 'Done';
            case 'failed':
                return 'To Do';
            case 'skipped':
                return 'In Progress';
            default:
                return 'To Do';
        }
    }

    async updateJiraIssue(issueKey, status) {
        try {
            const response = await axios({
                method: 'PUT',
                url: `${process.env.JIRA_BASE_URL}/rest/api/3/issue/${issueKey}`,
                auth: {
                    username: process.env.JIRA_EMAIL,
                    password: process.env.JIRA_API_TOKEN
                },
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: {
                    fields: {
                        status: {
                            name: status
                        }
                    }
                }
            });

            console.log(`Successfully updated Jira issue ${issueKey}`);
            return response;
        } catch (error) {
            console.error('Error updating Jira:', error.message);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
            }
            throw error;
        }
    }
}

export default JiraIntegration;