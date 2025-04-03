import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from "lightning/navigation";
import { encodeDefaultFieldValues } from "lightning/pageReferenceUtils";
import askAgentforceModal from 'c/askAgentforceModal';
import getAnyAccountRecordForMail from '@salesforce/apex/MarketplaceController.getAnyAccountRecordForMail';
import getWelcomeMatItems from '@salesforce/apex/MarketplaceController.getWelcomeMatItems';

export default class StorefrontWelcomeMat extends NavigationMixin(LightningElement) {

    @api header;
    @api description;

    @api welcomeMatActionLabel;
    @api welcomeMatActionLink;

    displaySpinner = true;
    welcomeMatCollection;
    welcomeMatError;

    @wire(getWelcomeMatItems)
    wiredItems({ error, data }) {
        if (data) {
            this.displaySpinner = false;
            this.welcomeMatCollection = data;
            this.welcomeMatError = undefined;
        } else if (error) {
            this.displaySpinner = false;
            this.welcomeMatCollection = undefined;
            this.welcomeMatError = error;
            console.error(error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: "Error",
                    message: error,
                    variant: "error"
                })
            );
        }
    }   

    handleWelcomeStepClick(event){
        switch (event.currentTarget.dataset.id){
            case "email":
                this.sendEmailAction();
                break;
            case "web":
                this[NavigationMixin.Navigate]({
                    type: "standard__webPage",
                    attributes: {
                        url: event.currentTarget.dataset.link
                    }
                });
                break;
            case "agentforce":
                this.openModal({
                    headerLabel: "Ask Agentforce",
                    systemPrompt: `You are an AI assistant that generates responses in a well-structured, readable rich text format suitable for rendering in HTML. Your output should follow these guidelines: 1. **Use HTML Formatting:** - Format key points using <strong> for emphasis and <ul> or <ol> for lists. - Use <p> for paragraphs to ensure readability. - Include <code> for inline code snippets and <pre><code> for blocks of code when needed. 2. **Ensure Readability & Structure:** - Break content into **logical sections** with headings and spacing. - Use **bullet points and numbered lists** for better clarity. - Avoid long, dense paragraphs—use line breaks where necessary. 3. **Enhance User Experience:** - Include relevant hyperlinks (<a href="URL">Link Text</a>) when mentioning external resources. - When listing examples, format them clearly in <blockquote> or <code> where applicable. - Maintain **consistent indentation** and spacing for readability. Do not include unnecessary white spaces. Do not include heading tags and stay consistent with paragraph tags`
                })
                break;
            case "video":
                this.openVideoModal({
                    headerLabel: "What is the Connected Storefront?",
                    videoAsset: event.currentTarget.dataset.link
                })
                break;
            default:
                break;
        }        
    }

    async openModal(details){
        const result = await askAgentforceModal.open({
          label: details.headerLabel,
          size: 'medium',
          content: {
                userPrompt: details.userPrompt,
                systemPrompt: details.systemPrompt
            }
        });   
    }

    async openVideoModal(details){
        const result = await videoModal.open({
          label: details.headerLabel,
          size: 'large',
          content: {
                videoAsset: details.videoAsset
            }
        });   
    }

    sendEmailAction(){
        (async () => {
            await getAnyAccountRecordForMail()
                .then(result => {
                    try {
                        var pageRef = {
                            type: "standard__quickAction",
                            attributes: {
                              apiName: "Global.SendEmail"
                            },
                            state: {
                                recordId: result.Id,
                                defaultFieldValues:
                                    encodeDefaultFieldValues({
                                        Subject: 'Connect with IQVIA Support',
                                        ToAddress: 'support@iqvia.com'
                                    })
                            }
                          };
                          this[NavigationMixin.Navigate](pageRef);
                    } catch (error){
                        console.error(error);
                    }
                })
                .catch(error => {
                    this.displaySpinner = false;
                    this.noStorefrontItems = true;
                    console.error(error);
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: "Error",
                            message: error,
                            variant: "error"
                        })
                    );
                });
        })();
    }

    handleWelcomeMatAction(){
        this[NavigationMixin.Navigate]({
            type: "standard__webPage",
            attributes: {
              url: this.welcomeMatActionLink
            }
        });
    }

}