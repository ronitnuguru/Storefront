import { LightningElement, api } from 'lwc';
import { NavigationMixin } from "lightning/navigation";
import { encodeDefaultFieldValues } from "lightning/pageReferenceUtils";
import askAgentforceModal from 'c/askAgentforceModal';
import getAnyAccountRecordForMail from '@salesforce/apex/MarketplaceController.getAnyAccountRecordForMail';

export default class StorefrontWelcomeMat extends NavigationMixin(LightningElement) {

    @api header = 'Welcome to the IQVIA Storefront!';
    @api description = `IQVIA's Storefront enhances enterprise operations through a refined user experience, leveraging advanced artificial intelligence and data analytics capabilities. Our strategic optimization of the Salesforce interface enables streamlined, efficient execution of mission-critical business processes.`;

    @api welcomeMatActionLabel = 'Learn More';
    @api welcomeMatActionLink = 'https://www.salesforce.com/news/press-releases/2024/04/08/iqvia-and-salesforce-expand-global-partnership-to-accelerate-the-development-of-life-sciences-cloud/';

    welcomeMatList = [
        {
            id: 0,
            title: 'What is the Connected Storefront?',
            description: 'Seamless digital and in-person interactions, enhancing patient engagement and streamlining care delivery.',
            icon: 'standard:video',
            linkType: 'web',
            link: 'https://drive.google.com/file/d/1MFfrqo7a5bZ14XHQzByvsNytSV2PROOg/view?usp=sharing'
        },
        {
            id: 1,
            title: 'Life Sciences Migration Alliance',
            description: 'Tailored and flexible solutions for life sciences expertise and ensuring successful client outcomes.',
            icon: 'standard:partners',
            linkType: 'web',
            link: 'https://appexchange.salesforce.com/appxConsultingListingDetail?listingId=26eb9e4e-0b89-416f-94af-4e2c164820d7'
        },
        {
            id: 2,
            title: 'Ask Agentforce',
            description: `AI-powered assistance to help find accurate information and streamline decision-making.`,
            icon: 'standard:story',
            linkType: 'agentforce'
        },
        {
            id: 3,
            title: 'Visit our Website',
            description: 'Global provider of technology solutions and clinical research services.',
            icon: 'standard:visualforce_page',
            linkType: 'web',
            link: 'https://www.iqvia.com/'
        },
        {
            id: 4,
            title: 'Connect with IQVIA Support',
            description: 'Seek expert assistance tailored to your health and life sciences needs.',
            icon: 'standard:workforce_engagement',
            linkType: 'email'
        }
    ];

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
                    userPrompt: `How to develop and use Second-Generation Packaging (2GP) in Salesforce?`,
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