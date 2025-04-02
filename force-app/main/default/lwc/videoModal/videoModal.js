import { api } from 'lwc';
import LightningModal from 'lightning/modal';


export default class VideoModal extends LightningModal {
    @api content;
    @api label;

    handleClose(){
        this.close();
    }

    handleOpen(){
        window.open(this.content.videoAsset, "_blank");
    }
}