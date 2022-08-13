import React, { useEffect } from 'react';
import './App.css';
import { Grid, Typography, List, ListItem, ListItemButton, ListSubheader, Divider, Input, Slider, Box, IconButton, ButtonGroup, Button } from '@mui/material';
import noImageSelected from './no-photo-available.png'
import { Undo, Redo, Upload } from '@mui/icons-material';

function App() {

  const [imageList, setImageList] = React.useState([]);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [imageUrl, setImageUrl] = React.useState(null);
  const [history, setHistory] = React.useState([]);
  const [historyIndex, setHistoryIndex] = React.useState(-1);
  const [transformations, setTransformations] = React.useState({ w: '725', h: '530' });
  const [newImageUrl, setNewImageUrl] = React.useState('');

  function applyTransformations(transformations) {
    let newImageUrl = '';
    if (imageUrl !== null) {
      newImageUrl = imageUrl.replace(/\?.*/, '') + '?' + Object.keys(transformations).map(key => `${key}=${transformations[key]}`).join('&');
    } else {
      newImageUrl = imageList[selectedIndex].url.replace(/\?.*/, '') + '?' + Object.keys(transformations).map(key => `${key}=${transformations[key]}`).join('&');
    }
    setImageUrl(newImageUrl);
  }

  function modifyTransformations(newTransformation, apply) {
    if (apply) {
      setHistory([...history.slice(0, historyIndex + 1), { ...transformations, ...newTransformation }]);
      setHistoryIndex(historyIndex + 1);
      applyTransformations({ ...transformations, ...newTransformation });

    }
    setTransformations({ ...transformations, ...newTransformation });
  }

  function undoAction() {
    if (historyIndex > 0) {
      setTransformations(history[historyIndex - 1])
      setHistoryIndex(historyIndex - 1);
      applyTransformations(history[historyIndex - 1]);
    }
  }

  function redoAction() {
    if (historyIndex < history.length - 1) {
      setTransformations(history[historyIndex + 1]);
      setHistoryIndex(historyIndex + 1);
      applyTransformations(history[historyIndex + 1]);
    }
  }



  const handleListItemClick = (_, index) => {
    setSelectedIndex(index);
    setImageUrl(null);
    setHistory([]);
    setTransformations({ w: '725', h: '530' });
    setHistoryIndex(-1);
  };


  useEffect(() => {
    async function getImageList() {
      const imageList = await fetch('https://storage.googleapis.com/nanlabs-engineering-technical-interviews/imgix-samples-list.json')
      const imageListJson = await imageList.json()
      setImageList(imageListJson)
    }
    getImageList()
  }, [])

  return (
    <div className="App">
      <header className="App-header" >
        <Typography variant="h4" className="Header-text">imgix-app</Typography>
      </header>
      <div className="Grid-container">
        <Grid container spacing={1} />
        <Grid item xs={3} className="Image-select-column">
          <List

            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                Upload with imgix URL
              </ListSubheader>
            }
          >
            <div className='Upload-header'>
            <input type="text" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} />
            <IconButton color="primary" aria-label="upload picture" component="label" onClick={() => {
              setImageList([...imageList, { url: newImageUrl, name: newImageUrl.split('/')[newImageUrl.split('/').length - 1] }])
            }}>
              <Upload id='input-field' />
            </IconButton>
            </div>
            {imageList.map((image, index) => (
              <div key={index}>
                <ListItem >
                  <ListItemButton
                    selected={selectedIndex === index}
                    onClick={(event) => handleListItemClick(event, index)}
                  >
                    <img className="Thumbnail" src={image.url} alt={image.name} key={index} />
                    <Typography style={{ paddingLeft: '3px' }} variant="p">{image.name[0].toUpperCase() + image.name.substring(1).slice(0, -4)}</Typography>
                  </ListItemButton>
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>
        </Grid>

        <Grid item xs={9} className="Image-container">
          {selectedIndex >= 0 ? (
            <>
              <IconButton
                disabled={historyIndex <= 0}
                onClick={() => {
                  undoAction();
                }}
              ><Undo></Undo></IconButton>
              <IconButton
                disabled={historyIndex >= history.length - 1}
                onClick={() => {
                  redoAction();
                }}
              ><Redo></Redo></IconButton>
              <img className="Selected-image" src={imageUrl ? imageUrl : imageList[selectedIndex].url} alt="Selected" />
              <Input disableUnderline fullWidth readOnly className="URL-field" value={imageUrl ? imageUrl : imageList[selectedIndex].url} onChange={(value) => setImageUrl(value)}></Input>
              <Box className="Settings-container">
                <div className="Setting-sliders">
                  <ButtonGroup>
                    <Button onClick={() => modifyTransformations({ w: '725', h: '530' }, true)}>725x530</Button>
                    <Button onClick={() => modifyTransformations({ w: '1920', h: '1080' }, true)}>1920x1080</Button>
                    <Button onClick={() => modifyTransformations({ w: '2560', h: '1440' }, true)}>2560x1440</Button>
                  </ButtonGroup>
                  <Typography id="rotation" gutterBottom>Rotation</Typography>
                  <Slider
                    size="small"
                    defaultValue={0}
                    valueLabelDisplay="auto"
                    max={359}
                    value={transformations.rot || 0}
                    onChange={(event, value) => modifyTransformations({ rot: value })}
                    onChangeCommitted={(event, value) => { modifyTransformations({ rot: value }, true) }}
                  />
                  <Typography id="brightness" gutterBottom>Brigtness</Typography>
                  <Slider
                    size="small"
                    defaultValue={0}
                    valueLabelDisplay="auto"
                    track={false}
                    max={100}
                    min={-100}
                    value={transformations.bri || 0}
                    onChange={(event, value) => modifyTransformations({ bri: value })}
                    onChangeCommitted={(event, value) => { modifyTransformations({ bri: value }, true) }}
                  />
                  <Typography id="contrast" gutterBottom>Contrast</Typography>
                  <Slider
                    size="small"
                    defaultValue={0}
                    valueLabelDisplay="auto"
                    track={false}
                    max={100}
                    min={-100}
                    value={transformations.con || 0}
                    onChange={(event, value) => modifyTransformations({ con: value })}
                    onChangeCommitted={(event, value) => { modifyTransformations({ con: value }, true) }}
                  />
                  <Typography id="exposure" gutterBottom>Exposure</Typography>
                  <Slider
                    size="small"
                    defaultValue={0}
                    valueLabelDisplay="auto"
                    track={false}
                    max={100}
                    min={-100}
                    value={transformations.exp || 0}
                    onChange={(event, value) => modifyTransformations({ exp: value })}
                    onChangeCommitted={(event, value) => { modifyTransformations({ exp: value }, true) }}
                  />
                  <Typography id="gamma" gutterBottom>Gamma</Typography>
                  <Slider
                    size="small"
                    defaultValue={0}
                    valueLabelDisplay="auto"
                    track={false}
                    max={100}
                    min={-100}
                    value={transformations.gam || 0}
                    onChange={(event, value) => modifyTransformations({ gam: value })}
                    onChangeCommitted={(event, value) => { modifyTransformations({ gam: value }, true) }}
                  />
                  <Typography id="highlight" gutterBottom>Highlight</Typography>
                  <Slider
                    size="small"
                    defaultValue={0}
                    valueLabelDisplay="auto"
                    track="inverted"
                    max={0}
                    min={-100}
                    value={transformations.high || 0}
                    onChange={(event, value) => modifyTransformations({ high: value })}
                    onChangeCommitted={(event, value) => { modifyTransformations({ high: value }, true) }}
                  />
                  <Typography id="hue-shift" gutterBottom>Hue Shift</Typography>
                  <Slider
                    size="small"
                    defaultValue={0}
                    valueLabelDisplay="auto"
                    max={359}
                    value={transformations.hue || 0}
                    onChange={(event, value) => modifyTransformations({ hue: value })}
                    onChangeCommitted={(event, value) => { modifyTransformations({ hue: value }, true) }}
                  />
                  <Typography id="saturation" gutterBottom>Saturation</Typography>
                  <Slider
                    size="small"
                    defaultValue={0}
                    valueLabelDisplay="auto"
                    track={false}
                    max={100}
                    min={-100}
                    value={transformations.sat || 0}
                    onChange={(event, value) => modifyTransformations({ sat: value })}
                    onChangeCommitted={(event, value) => { modifyTransformations({ sat: value }, true) }}
                  />
                  <Typography id="Shadow" gutterBottom>Shadow</Typography>
                  <Slider
                    size="small"
                    defaultValue={0}
                    valueLabelDisplay="auto"
                    max={100}
                    value={transformations.shad || 0}
                    onChange={(event, value) => modifyTransformations({ shad: value })}
                    onChangeCommitted={(event, value) => { modifyTransformations({ shad: value }, true) }}
                  />
                  <Typography id="sharpen" gutterBottom>Sharpen</Typography>
                  <Slider
                    size="small"
                    defaultValue={0}
                    valueLabelDisplay="auto"
                    max={100}
                    value={transformations.sharp || 0}
                    onChange={(event, value) => modifyTransformations({ sharp: value })}
                    onChangeCommitted={(event, value) => { modifyTransformations({ sharp: value }, true) }}
                  />
                  <Typography id="unsharp-mask" gutterBottom>Unsharp mask</Typography>
                  <Slider
                    size="small"
                    defaultValue={0}
                    valueLabelDisplay="auto"
                    track={false}
                    max={100}
                    min={-100}
                    value={transformations.usm || 0}
                    onChange={(event, value) => modifyTransformations({ usm: value })}
                    onChangeCommitted={(event, value) => { modifyTransformations({ usm: value }, true) }}
                  />
                  <Typography id="unsharp-mask-radius" gutterBottom>Unsharp mask radius</Typography>
                  <Slider
                    size="small"
                    defaultValue={0}
                    valueLabelDisplay="auto"
                    max={500}
                    value={transformations.usmrad || 0}
                    onChange={(event, value) => modifyTransformations({ usmrad: value })}
                    onChangeCommitted={(event, value) => { modifyTransformations({ usmrad: value }, true) }}
                  />
                  <Typography id="vibrance" gutterBottom>Vibrance</Typography>
                  <Slider
                    size="small"
                    defaultValue={0}
                    valueLabelDisplay="auto"
                    track={false}
                    max={100}
                    min={-100}
                    value={transformations.vib || 0}
                    onChange={(event, value) => modifyTransformations({ vib: value })}
                    onChangeCommitted={(event, value) => { modifyTransformations({ vib: value }, true) }}
                  />
                </div>
              </Box>
            </>
          ) : (

            <div className='Image-container'>
              <Typography>Please select an image</Typography>
              <img className="No-image" src={noImageSelected} alt="Not selected" />
            </div>

          )}
        </Grid>
      </div>

    </div>
  );
}

export default App;
