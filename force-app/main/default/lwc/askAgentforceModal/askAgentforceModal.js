import { api } from 'lwc';
import LightningModal from 'lightning/modal';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import invokePromptAndUserModelsGenAi from "@salesforce/apex/MarketplaceController.invokePromptAndUserModelsGenAi";

export default class AskAgentforceModal extends LightningModal {
    @api content;
    @api label;

    agentName = 'IQVIA Agent';
    promptCurrentTime;
    prompt;

    systemPrompt = `You are an AI assistant that generates responses formatted specifically for display in Salesforce Lightning Web Components (LWC) using \`lightning-formatted-rich-text\`. Ensure that responses are structured, readable, and well-organized. Provide neatly numbered documentation with numbered steps and hyperlinks. Do not share additional information. Keep it concise and simple. The end output needs to be displayed in easily readable rich text format where text is formatted by HTML tags. Mostly focus on anchor tags and lists. For example, the hyperlinks need to be clickable and open in a new tab

### **Formatting Guidelines**  
- Don't include the root html tag
- Use **\`<h3>\`** for section headings.  
- Use **\`<h4>\`** for subheadings.  
- Use **bold text** (\`<b>\`) to highlight important terms.  
- Use **bullet points (\`<ul>\` and \`<li>\`)** for lists.  
- Use **paragraphs (\`<p>\`)** for readability.  
- Include **hyperlinks (\`<a href="URL">\`)** when referencing external sources.  

### **Response Structure**  
1. **Introduction**: Provide a brief overview.  
2. **Key Sections**: Organize content under relevant headings.  
3. **Key Takeaways**: Summarize the main points.  
4. **Call to Action**: Encourage further exploration with links when applicable.  

### **Example Response Format**  
<h3><b>Introduction</b></h3>
<p>IQVIA's Orchestrated Customer Engagement (OCE) is a CRM suite designed for life sciences...</p>

<h3><b>Key Sections</b></h3>

<h4><b>Capabilities</b></h4>
<ul>
    <li><b>Unified CRM Platform:</b> Combines multiple CRM functions.</li>
    <li><b>Advanced Analytics:</b> Uses AI and machine learning for insights.</li>
</ul>

<h3><b>Key Takeaways</b></h3>
<ul>
    <li><b>IQVIA OCE</b> enhances customer engagement in life sciences.</li>
</ul>

<h3><b>Call to Action</b></h3>
<p>Learn more at <a href="https://www.iqvia.com">IQVIA's website</a>.</p>

Ensure that all responses follow this structure to display cleanly in LWC's \`lightning-formatted-rich-text\`.
`;

    displaySpinner;
    modelsValue = 'sfdc_ai__DefaultGPT4Omni';
    response;
    displayResult;

    templatePrompts = [{
            label: "What is IQVIA...",
            icon: "utility:search"
        },
        {
            label: "How to setup IQVIA and Salesforce...",
            icon: "utility:integration"
        },
        {
            label: "Find documentation for IQVIA's integration...",
            icon: "utility:knowledge_base"
        }
    ];

    get modelsTypeOptions() {
        return [{
                label: 'Azure OpenAI GPT-4o (Latest GPT-4 Model)',
                value: 'sfdc_ai__DefaultGPT4Omni'
            },
            {
                label: 'Anthropic Claude 3 Haiku on Amazon (Salesforce Managed)',
                value: 'sfdc_ai__DefaultBedrockAnthropicClaude3Haiku'
            },
            {
                label: 'Azure OpenAI GPT-3.5 Turbo',
                value: 'sfdc_ai__DefaultGPT35Turbo'
            },
            {
                label: 'OpenAI GPT-4 (Older GPT-4 Model)',
                value: 'sfdc_ai__DefaultGPT4'
            },
        ];
    }

    get enableGenerate() {
        return !this.prompt;
    }

    handleGenerate() {
        this.displaySpinner = true;
        (async () => {
            await invokePromptAndUserModelsGenAi({
                    className: 'GenAiController',
                    methodName: 'createChatGeneration',
                    modelName: this.modelsValue,
                    userPrompt: this.prompt,
                    systemPrompt: this.systemPrompt
                })
                .then(result => {
                    this.displaySpinner = false;
                    this.response = result;
                    this.displayResult = true;
                    this.promptCurrentTime = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
                })
                .catch(error => {
                    this.displaySpinner = false;
                    console.error(error);
                    this.displayExtensionIllustration = true;
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: error.statusText,
                            message: error.body.message,
                            variant: "error"
                        })
                    );
                });
        })();
    }

    handlePromptTemplateInput(event) {
        if (event.target.value.endsWith("...")) {
            this.prompt = event.target.value.replace("...", " ");
        } else {
            this.prompt = event.target.value;
        }
    }

    handleModelsTypeChange(event) {
        this.modelsValue = event.detail.value;
    }

    handlePromptChange(event) {
        this.prompt = event.target.value;
    }

    handleSystemPromptChange(event) {
        this.systemPrompt = event.target.value;
    }

    handleClear(){
        this.prompt = '';
        this.response = '';
        this.displayResult = false;
    }
}