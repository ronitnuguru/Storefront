import { LightningElement, api } from 'lwc';

export default class StorefrontStepDetail extends LightningElement {
    @api stepNumber;
    @api stepTitle;
    @api stepDescription;
    @api stepTime;
}