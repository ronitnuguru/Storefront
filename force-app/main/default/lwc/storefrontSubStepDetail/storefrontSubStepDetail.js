import { LightningElement, api } from 'lwc';
import { NavigationMixin } from "lightning/navigation";

export default class StorefrontSubStepDetail extends NavigationMixin(LightningElement) {
    @api description;
    
    @api buttonType;
    @api buttonLabel;
    @api buttonLink;
    @api buttonVariant;
    @api buttonIcon;

    get isButtonIcon(){
        return this.buttonType === 'icon';
    }

    get isButtonStandard(){
        return this.buttonType === 'standard';
    }

    handleButtonClick(){
        this[NavigationMixin.Navigate]({
            type: "standard__webPage",
            attributes: {
              url: this.buttonLink
            }
        });
    }
}