import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { Card, Header, Tab, Image, Button, Grid } from "semantic-ui-react";
import PhotoUploadWidget from "../../app/common/photoUpload/PhotoUploadWidget";
import { RootStoreContext } from "../../app/stores/rootStore";

const ProfilePhotos = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    profile,
    isCurrentUser,
    uploadPhoto,
    uploadingPhoto,
    setMainPhoto,
    deletePhoto,
    loading,
    loadingDelete,
  } = rootStore.profileStore;
  const [addPhotoMode, setAddPhotoMode] = useState(false);
  const [target, setTarget] = useState<string | undefined>(undefined);

  const handleUploadImage = (photo: Blob) => {
    uploadPhoto(photo).then(() => setAddPhotoMode(false));
  };

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16} style={{ paddingBottom: 0 }}>
          <Header icon="image" floated="left" content="Photos" />
          {isCurrentUser && (
            <Button
              floated="right"
              basic
              content={addPhotoMode ? "Cancel" : "Add Photo"}
              onClick={() => setAddPhotoMode(!addPhotoMode)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {addPhotoMode ? (
            <PhotoUploadWidget
              uploadPhoto={handleUploadImage}
              loading={uploadingPhoto}
            />
          ) : (
            <Card.Group itemsPerRow={5}>
              {profile &&
                profile.photos.map((photo) => (
                  <Card key={photo.id}>
                    <Image src={photo.url} />
                    {isCurrentUser && (
                      <Button.Group fluid width={2}>
                        <Button floated='left'
                          name={photo.id}
                          loading={photo.id === target && loading}
                          basic
                          disabled={photo.isMain}
                          positive
                          content="Main"
                          onClick={(e) => {
                            setTarget(photo.id);
                            setMainPhoto(photo);
                          }}
                        />
                        <Button floated='right'
                          loading={photo.id === target && loadingDelete}
                          basic
                          negative
                          disabled={photo.isMain}
                          icon="trash"
                          onClick={() => {
                            deletePhoto(photo);
                            setTarget(photo.id);
                          }}
                        />
                      </Button.Group>
                    )}
                  </Card>
                ))}
            </Card.Group>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfilePhotos);
