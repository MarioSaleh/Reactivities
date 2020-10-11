import {observable,action,computed,configure,runInAction} from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import agent from '../api/agent';
import { IActivity } from '../models/activity';

configure({enforceActions:'always'})

export class ActivityStore{
    @observable activityRegistry = new Map();
    @observable activities : IActivity[] = [];
    @observable selectedActivity: IActivity | undefined = undefined;
    @observable loadingInitial = false;
    @observable editMode = false;
    @observable submitting = false;
    @observable target = '';

    @computed get activitiesByDate(){
        return Array.from(this.activityRegistry.values())
        .sort((a,b) => Date.parse(a.date) - Date.parse(b.date));
    }


    @action loadActivities = async () => {
        this.loadingInitial = true;
        try{
            const activities = await agent.Activities.list()
            runInAction('loading activities',() => {
                activities.forEach((activity) => {
                    activity.date = activity.date.split(".")[0];
                    this.activityRegistry.set(activity.id,activity);
                  });
            })
          this.loadingInitial = false;
        } catch(error){
            runInAction('load activities error',() => {
                this.loadingInitial = false;
            })
          console.log(error);
        }
    }
    
    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try{
            await agent.Activities.create(activity);
            runInAction('creating an activity',() => {
                this.activityRegistry.set(activity.id,activity);
                this.submitting = false;
                this.editMode = false;
            })
            
        } catch(error){
            runInAction('create activity error',() => {
                this.submitting = false;
            })
            console.log(error);
        }
    }

    @action openCreateForm = () => {
        this.editMode = true;
        this.selectedActivity = undefined;
    }

    @action openEditForm = (id:string) => {
        this.selectedActivity = this.activityRegistry.get(id);
        this.editMode = true;
    }

    @action cancelSelectedActivity = () => {
        this.selectedActivity = undefined;
    }   

    @action cancelFormOpen = () => {
        this.editMode = false
    }

    @action selectActivity = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id); //filter is used on an array to determine which elements you want (like where in C#)
        this.editMode = false;
    };

    @action editActivity = async(activity:IActivity) => {
        this.submitting = true
        try{
            await agent.Activities.update(activity);
            runInAction('editing an activity',() => {
                this.activityRegistry.set(activity.id,activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.submitting = false;
            })
        }catch(error){
            runInAction('editing activity error',() => {
                this.submitting = false;
            })
            console.log(error);
        }
    }
   
    @action  deleteActivity = async(
        event: SyntheticEvent<HTMLButtonElement>,
        id: string
      ) => {
        this.submitting = true;
        this.target = event.currentTarget.name;
          try{
            await agent.Activities.delete(id);
            runInAction('deleting an activity',() => {
                this.activityRegistry.delete(id);
                this.selectedActivity = undefined;
                this.submitting = false;
                this.target = '';
            })
          }catch(error){
            runInAction('deleting activity error',() => {
                this.target = '';
                this.submitting=false;
            })
            console.log(error);
          }
       
      };
    

}

export default createContext(new ActivityStore())