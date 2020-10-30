import { action, observable } from "mobx";
import { RootStore } from "./rootStore";

export default class ModalStore {
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    @observable.shallow modal = { // goes one level deep which is open
        open: false,
        body: null
    }

    @action openModal = (content : any) => {
        this.modal.open = true;
        this.modal.body = content;
    }

    @action closeModal = () => {
        this.modal.open = false;
        this.modal.body = null;
    }
}