import { action, observable, runInAction, computed } from "mobx";
import { toast } from "react-toastify";
import agent from "../api/agent";
import { IPhoto, IProfile } from "../models/profile";
import { RootStore } from "./rootStore";

export default class ProfileStore {
    rootStore: RootStore
    
    constructor(rootStore: RootStore){
        this.rootStore = rootStore;
    }

    @observable profile: IProfile | null = null;
    @observable loadingProfile: boolean = true;
    @observable uploadingPhoto:boolean = false;
    @observable loading: boolean = false;
    @observable loadingDelete: boolean = false;

    
    @computed get isCurrentUser() {
        if(this.rootStore.userStore.user && this.profile?.username){
            return this.rootStore.userStore.user.username === this.profile.username;
        } else {
            return false;
        }

    }


    @action loadProfile = async (username: string) => {
        this.loadingProfile = true;
        try{
            const profile = await agent.Profiles.get(username);
            runInAction(() => {
                this.profile = profile;
                this.loadingProfile = false;
            });
        } catch(error)
        {
            runInAction(() => {
                this.loadingProfile = false;
            });
            console.log(error);
        }
    }

    @action uploadPhoto = async (file: Blob) => {
        this.uploadingPhoto = true;
        try{    
            const photo = await agent.Profiles.uploadPhoto(file);
            runInAction(() => {
                if(this.profile) {
                    this.profile.photos.push(photo);
                    if(photo.isMain && this.rootStore.userStore.user) {
                        this.rootStore.userStore.user.image = photo.url;
                        this.profile.image = photo.url;
                    }
                }
                this.uploadingPhoto=false;
            })
        } catch(error) {
            console.log(error);
            toast.error('Problem uploading photo');
            runInAction(() => {
                this.uploadingPhoto = false;
            })
        }
    }

    @action setMainPhoto = async (photo: IPhoto) => {
        this.loading=true;
        await agent.Profiles.setMainPhoto(photo.id);
        try{
            runInAction(() => {
                this.rootStore.userStore.user!.image = photo.url;
                this.profile!.photos.find(a => a.isMain)!.isMain = false;
                this.profile!.photos.find(a => a.id === photo.id)!.isMain = true;
                this.profile!.image = photo.url;
                this.loading = false;
            })
        } catch(error) {
            toast.error("Problem setting photo as main");
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    @action deletePhoto = async (photo: IPhoto) => {
        this.loadingDelete = true;
        await agent.Profiles.deletePhoto(photo.id);
        try{
            runInAction(() => {
                if(photo.isMain)
                    {
                        this.profile!.image = '';  
                        this.rootStore.userStore.user!.image = undefined;
                    }
                this.profile!.photos = this.profile!.photos.filter(p => p.id !== photo.id);
                this.loadingDelete = false;
            })
        } catch (error){
            toast.error("Problem deleting photo");
            runInAction(() => {
                this.loadingDelete = false;
            });
        }
    }
}